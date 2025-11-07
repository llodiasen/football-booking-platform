# 📇 Guide Complet - Programmation Cartes NFC vCard

Guide pour créer des applications Android et iOS qui écrivent des cartes de visite (vCard) sur des cartes NFC **sans connexion internet**.

Compatible avec votre **NTAG213** (137 bytes utilisables).

---

## 📱 APPLICATION ANDROID

### 1. Structure du Projet

```
NFCVCardWriter/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/nfcwriter/
│   │   │   │   ├── MainActivity.java
│   │   │   │   ├── VCardModel.java
│   │   │   │   └── NFCManager.java
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   └── activity_main.xml
│   │   │   │   └── values/
│   │   │   │       ├── strings.xml
│   │   │   │       └── colors.xml
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
```

### 2. Code Source Android

#### **AndroidManifest.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.nfcwriter">

    <uses-permission android:name="android.permission.NFC" />
    <uses-feature
        android:name="android.hardware.nfc"
        android:required="true" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.AppCompat.Light.DarkActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Intent filters pour la détection NFC -->
            <intent-filter>
                <action android:name="android.nfc.action.TAG_DISCOVERED" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            
            <intent-filter>
                <action android:name="android.nfc.action.NDEF_DISCOVERED" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/vcard" />
            </intent-filter>
            
            <intent-filter>
                <action android:name="android.nfc.action.TECH_DISCOVERED" />
            </intent-filter>
            
            <meta-data
                android:name="android.nfc.action.TECH_DISCOVERED"
                android:resource="@xml/nfc_tech_filter" />
        </activity>
    </application>

</manifest>
```

#### **res/xml/nfc_tech_filter.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <tech-list>
        <tech>android.nfc.tech.Ndef</tech>
    </tech-list>
    <tech-list>
        <tech>android.nfc.tech.NdefFormatable</tech>
    </tech-list>
</resources>
```

#### **VCardModel.java**
```java
package com.example.nfcwriter;

public class VCardModel {
    private String fullName;
    private String firstName;
    private String lastName;
    private String mobilePhone;
    private String workPhone;
    private String email;
    private String url;
    private String organization;
    private String title;
    private String address;
    private String city;
    private String country;
    private String note;

    public VCardModel() {
    }

    // Getters et Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMobilePhone() { return mobilePhone; }
    public void setMobilePhone(String mobilePhone) { this.mobilePhone = mobilePhone; }

    public String getWorkPhone() { return workPhone; }
    public void setWorkPhone(String workPhone) { this.workPhone = workPhone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    /**
     * Génère la vCard au format standard 3.0
     */
    public String toVCardString() {
        StringBuilder vcard = new StringBuilder();
        vcard.append("BEGIN:VCARD\n");
        vcard.append("VERSION:3.0\n");

        if (fullName != null && !fullName.isEmpty()) {
            vcard.append("FN:").append(fullName).append("\n");
        }

        if (lastName != null && firstName != null) {
            vcard.append("N:").append(lastName).append(";").append(firstName).append(";;;\n");
        }

        if (mobilePhone != null && !mobilePhone.isEmpty()) {
            vcard.append("TEL;TYPE=CELL:").append(mobilePhone).append("\n");
        }

        if (workPhone != null && !workPhone.isEmpty()) {
            vcard.append("TEL;TYPE=WORK:").append(workPhone).append("\n");
        }

        if (email != null && !email.isEmpty()) {
            vcard.append("EMAIL;TYPE=WORK:").append(email).append("\n");
        }

        if (url != null && !url.isEmpty()) {
            vcard.append("URL:").append(url).append("\n");
        }

        if (organization != null && !organization.isEmpty()) {
            vcard.append("ORG:").append(organization).append("\n");
        }

        if (title != null && !title.isEmpty()) {
            vcard.append("TITLE:").append(title).append("\n");
        }

        if (address != null || city != null || country != null) {
            vcard.append("ADR;TYPE=WORK:;;");
            vcard.append(address != null ? address : "").append(";");
            vcard.append(city != null ? city : "").append(";;");
            vcard.append(country != null ? country : "").append("\n");
        }

        if (note != null && !note.isEmpty()) {
            vcard.append("NOTE:").append(note).append("\n");
        }

        vcard.append("END:VCARD");
        return vcard.toString();
    }

    /**
     * Calcule la taille approximative en bytes
     */
    public int estimatedSize() {
        return toVCardString().getBytes().length;
    }
}
```

#### **NFCManager.java**
```java
package com.example.nfcwriter;

import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.nfc.tech.NdefFormatable;
import android.util.Log;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class NFCManager {
    private static final String TAG = "NFCManager";

    public interface NFCCallback {
        void onSuccess(String message);
        void onError(String error);
    }

    /**
     * Écrit une vCard sur une carte NFC
     */
    public static void writeVCardToTag(Tag tag, VCardModel vCard, NFCCallback callback) {
        if (tag == null) {
            callback.onError("Aucune carte détectée");
            return;
        }

        // Générer la vCard
        String vCardString = vCard.toVCardString();
        Log.d(TAG, "vCard générée:\n" + vCardString);
        Log.d(TAG, "Taille: " + vCardString.getBytes().length + " bytes");

        // Vérifier la taille (NTAG213 = 137 bytes max)
        if (vCardString.getBytes().length > 137) {
            callback.onError("vCard trop grande (" + vCardString.getBytes().length + " bytes). Maximum: 137 bytes");
            return;
        }

        // Créer le message NDEF
        NdefMessage message = createVCardNdefMessage(vCardString);

        // Essayer d'écrire sur la carte
        Ndef ndef = Ndef.get(tag);
        if (ndef != null) {
            writeToNdef(ndef, message, callback);
        } else {
            // Carte non formatée, essayer de la formater
            NdefFormatable formatable = NdefFormatable.get(tag);
            if (formatable != null) {
                formatAndWrite(formatable, message, callback);
            } else {
                callback.onError("Carte non compatible NDEF");
            }
        }
    }

    /**
     * Écrit sur une carte déjà formatée NDEF
     */
    private static void writeToNdef(Ndef ndef, NdefMessage message, NFCCallback callback) {
        try {
            ndef.connect();

            if (!ndef.isWritable()) {
                callback.onError("Carte protégée en écriture");
                ndef.close();
                return;
            }

            int size = message.toByteArray().length;
            int maxSize = ndef.getMaxSize();

            if (size > maxSize) {
                callback.onError("Message trop grand (" + size + " bytes). Maximum: " + maxSize + " bytes");
                ndef.close();
                return;
            }

            ndef.writeNdefMessage(message);
            ndef.close();

            Log.d(TAG, "✅ vCard écrite avec succès!");
            callback.onSuccess("vCard programmée avec succès!\nTaille: " + size + " bytes");

        } catch (IOException e) {
            callback.onError("Erreur d'écriture: " + e.getMessage());
            Log.e(TAG, "Erreur d'écriture", e);
        } catch (Exception e) {
            callback.onError("Erreur: " + e.getMessage());
            Log.e(TAG, "Erreur", e);
        }
    }

    /**
     * Formate une carte vierge et écrit le message
     */
    private static void formatAndWrite(NdefFormatable formatable, NdefMessage message, NFCCallback callback) {
        try {
            formatable.connect();
            formatable.format(message);
            formatable.close();

            Log.d(TAG, "✅ Carte formatée et vCard écrite!");
            callback.onSuccess("Carte formatée et vCard programmée avec succès!");

        } catch (IOException e) {
            callback.onError("Erreur de formatage: " + e.getMessage());
            Log.e(TAG, "Erreur de formatage", e);
        } catch (Exception e) {
            callback.onError("Erreur: " + e.getMessage());
            Log.e(TAG, "Erreur", e);
        }
    }

    /**
     * Crée un message NDEF avec une vCard
     */
    private static NdefMessage createVCardNdefMessage(String vCard) {
        byte[] vCardBytes = vCard.getBytes(StandardCharsets.UTF_8);
        
        // Créer le record MIME pour vCard
        NdefRecord vCardRecord = NdefRecord.createMime("text/vcard", vCardBytes);
        
        // Alternative: utiliser text/x-vCard pour meilleure compatibilité
        // NdefRecord vCardRecord = NdefRecord.createMime("text/x-vCard", vCardBytes);

        return new NdefMessage(vCardRecord);
    }

    /**
     * Lit une vCard depuis une carte NFC
     */
    public static void readVCardFromTag(Tag tag, NFCCallback callback) {
        Ndef ndef = Ndef.get(tag);
        if (ndef == null) {
            callback.onError("Carte non compatible NDEF");
            return;
        }

        try {
            ndef.connect();
            NdefMessage message = ndef.getNdefMessage();
            ndef.close();

            if (message == null) {
                callback.onError("Aucune donnée sur la carte");
                return;
            }

            NdefRecord[] records = message.getRecords();
            for (NdefRecord record : records) {
                String mimeType = new String(record.getType(), StandardCharsets.UTF_8);
                Log.d(TAG, "Type MIME: " + mimeType);

                if (mimeType.equals("text/vcard") || mimeType.equals("text/x-vCard")) {
                    String vCard = new String(record.getPayload(), StandardCharsets.UTF_8);
                    Log.d(TAG, "vCard lue:\n" + vCard);
                    callback.onSuccess("vCard lue:\n" + vCard);
                    return;
                }
            }

            callback.onError("Aucune vCard trouvée");

        } catch (Exception e) {
            callback.onError("Erreur de lecture: " + e.getMessage());
            Log.e(TAG, "Erreur de lecture", e);
        }
    }

    /**
     * Obtient les informations de la carte
     */
    public static String getTagInfo(Tag tag) {
        StringBuilder info = new StringBuilder();
        info.append("ID: ").append(bytesToHex(tag.getId())).append("\n");
        info.append("Technologies: ").append(Arrays.toString(tag.getTechList())).append("\n");

        Ndef ndef = Ndef.get(tag);
        if (ndef != null) {
            try {
                ndef.connect();
                info.append("Type: ").append(ndef.getType()).append("\n");
                info.append("Taille max: ").append(ndef.getMaxSize()).append(" bytes\n");
                info.append("Modifiable: ").append(ndef.isWritable() ? "Oui" : "Non").append("\n");
                ndef.close();
            } catch (Exception e) {
                Log.e(TAG, "Erreur lecture info", e);
            }
        }

        return info.toString();
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X:", b));
        }
        return sb.length() > 0 ? sb.substring(0, sb.length() - 1) : "";
    }
}
```

#### **MainActivity.java**
```java
package com.example.nfcwriter;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    
    private NfcAdapter nfcAdapter;
    private PendingIntent pendingIntent;
    
    // UI Elements
    private EditText etFullName, etFirstName, etLastName;
    private EditText etMobile, etWorkPhone, etEmail;
    private EditText etUrl, etOrganization, etTitle;
    private EditText etAddress, etCity, etCountry, etNote;
    private Button btnWrite, btnRead, btnClear;
    private TextView tvStatus, tvInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialiser NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        
        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC non disponible sur cet appareil", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        if (!nfcAdapter.isEnabled()) {
            Toast.makeText(this, "Veuillez activer le NFC dans les paramètres", Toast.LENGTH_LONG).show();
        }

        // Préparer le PendingIntent pour capturer les événements NFC
        Intent intent = new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        pendingIntent = PendingIntent.getActivity(
            this, 
            0, 
            intent, 
            PendingIntent.FLAG_MUTABLE
        );

        // Initialiser les vues
        initViews();
        setupListeners();
        
        // Données de démonstration
        loadDemoData();
    }

    private void initViews() {
        etFullName = findViewById(R.id.etFullName);
        etFirstName = findViewById(R.id.etFirstName);
        etLastName = findViewById(R.id.etLastName);
        etMobile = findViewById(R.id.etMobile);
        etWorkPhone = findViewById(R.id.etWorkPhone);
        etEmail = findViewById(R.id.etEmail);
        etUrl = findViewById(R.id.etUrl);
        etOrganization = findViewById(R.id.etOrganization);
        etTitle = findViewById(R.id.etTitle);
        etAddress = findViewById(R.id.etAddress);
        etCity = findViewById(R.id.etCity);
        etCountry = findViewById(R.id.etCountry);
        etNote = findViewById(R.id.etNote);
        
        btnWrite = findViewById(R.id.btnWrite);
        btnRead = findViewById(R.id.btnRead);
        btnClear = findViewById(R.id.btnClear);
        
        tvStatus = findViewById(R.id.tvStatus);
        tvInfo = findViewById(R.id.tvInfo);
    }

    private void setupListeners() {
        btnWrite.setOnClickListener(v -> {
            tvStatus.setText("📱 Approchez la carte NFC pour l'écriture...");
            tvStatus.setTextColor(getResources().getColor(android.R.color.holo_blue_dark));
        });

        btnRead.setOnClickListener(v -> {
            tvStatus.setText("📖 Approchez la carte NFC pour la lecture...");
            tvStatus.setTextColor(getResources().getColor(android.R.color.holo_blue_dark));
        });

        btnClear.setOnClickListener(v -> clearForm());
    }

    private void loadDemoData() {
        etFullName.setText("Mamadou Diop");
        etFirstName.setText("Mamadou");
        etLastName.setText("Diop");
        etMobile.setText("+221771234567");
        etWorkPhone.setText("+221338765432");
        etEmail.setText("mamadou@221foot.sn");
        etUrl.setText("https://221foot.com");
        etOrganization.setText("221Foot");
        etTitle.setText("Gestionnaire de Terrain");
        etAddress.setText("Avenue Cheikh Anta Diop");
        etCity.setText("Dakar");
        etCountry.setText("Sénégal");
        etNote.setText("Réservation terrains de football");
    }

    private void clearForm() {
        etFullName.setText("");
        etFirstName.setText("");
        etLastName.setText("");
        etMobile.setText("");
        etWorkPhone.setText("");
        etEmail.setText("");
        etUrl.setText("");
        etOrganization.setText("");
        etTitle.setText("");
        etAddress.setText("");
        etCity.setText("");
        etCountry.setText("");
        etNote.setText("");
        tvStatus.setText("Formulaire effacé");
        tvInfo.setText("");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (nfcAdapter != null) {
            nfcAdapter.enableForegroundDispatch(this, pendingIntent, null, null);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (nfcAdapter != null) {
            nfcAdapter.disableForegroundDispatch(this);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction()) ||
            NfcAdapter.ACTION_NDEF_DISCOVERED.equals(intent.getAction()) ||
            NfcAdapter.ACTION_TECH_DISCOVERED.equals(intent.getAction())) {
            
            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            
            if (tag != null) {
                // Afficher les infos de la carte
                String tagInfo = NFCManager.getTagInfo(tag);
                tvInfo.setText(tagInfo);
                
                // Écrire ou lire selon le dernier bouton pressé
                String currentStatus = tvStatus.getText().toString();
                
                if (currentStatus.contains("l'écriture")) {
                    writeVCard(tag);
                } else if (currentStatus.contains("lecture")) {
                    readVCard(tag);
                }
            }
        }
    }

    private void writeVCard(Tag tag) {
        // Créer le modèle vCard
        VCardModel vCard = new VCardModel();
        vCard.setFullName(etFullName.getText().toString());
        vCard.setFirstName(etFirstName.getText().toString());
        vCard.setLastName(etLastName.getText().toString());
        vCard.setMobilePhone(etMobile.getText().toString());
        vCard.setWorkPhone(etWorkPhone.getText().toString());
        vCard.setEmail(etEmail.getText().toString());
        vCard.setUrl(etUrl.getText().toString());
        vCard.setOrganization(etOrganization.getText().toString());
        vCard.setTitle(etTitle.getText().toString());
        vCard.setAddress(etAddress.getText().toString());
        vCard.setCity(etCity.getText().toString());
        vCard.setCountry(etCountry.getText().toString());
        vCard.setNote(etNote.getText().toString());

        // Vérifier que le nom est renseigné au minimum
        if (vCard.getFullName() == null || vCard.getFullName().isEmpty()) {
            tvStatus.setText("❌ Le nom complet est requis");
            tvStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
            return;
        }

        // Écrire sur la carte
        NFCManager.writeVCardToTag(tag, vCard, new NFCManager.NFCCallback() {
            @Override
            public void onSuccess(String message) {
                runOnUiThread(() -> {
                    tvStatus.setText("✅ " + message);
                    tvStatus.setTextColor(getResources().getColor(android.R.color.holo_green_dark));
                    Toast.makeText(MainActivity.this, "Succès!", Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    tvStatus.setText("❌ " + error);
                    tvStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
                    Toast.makeText(MainActivity.this, error, Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void readVCard(Tag tag) {
        NFCManager.readVCardFromTag(tag, new NFCManager.NFCCallback() {
            @Override
            public void onSuccess(String message) {
                runOnUiThread(() -> {
                    tvStatus.setText("✅ " + message);
                    tvStatus.setTextColor(getResources().getColor(android.R.color.holo_green_dark));
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    tvStatus.setText("❌ " + error);
                    tvStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
                });
            }
        });
    }
}
```

#### **res/layout/activity_main.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <!-- Titre -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="📇 Carte de Visite NFC"
            android:textSize="24sp"
            android:textStyle="bold"
            android:gravity="center"
            android:paddingBottom="16dp" />

        <!-- Nom complet -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Nom complet *"
            android:textStyle="bold" />
        
        <EditText
            android:id="@+id/etFullName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Mamadou Diop"
            android:inputType="textPersonName" />

        <!-- Prénom -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Prénom"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etFirstName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Mamadou"
            android:inputType="textPersonName" />

        <!-- Nom de famille -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Nom de famille"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etLastName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Diop"
            android:inputType="textPersonName" />

        <!-- Téléphone mobile -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="📱 Téléphone mobile"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etMobile"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="+221771234567"
            android:inputType="phone" />

        <!-- Téléphone bureau -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="☎️ Téléphone bureau"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etWorkPhone"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="+221338765432"
            android:inputType="phone" />

        <!-- Email -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="✉️ Email"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etEmail"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="contact@exemple.com"
            android:inputType="textEmailAddress" />

        <!-- URL -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🌐 Site web"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etUrl"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="https://monsite.com"
            android:inputType="textUri" />

        <!-- Organisation -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🏢 Organisation"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etOrganization"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Nom de l'entreprise"
            android:inputType="text" />

        <!-- Titre/Poste -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="💼 Poste"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etTitle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Gestionnaire"
            android:inputType="text" />

        <!-- Adresse -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="📍 Adresse"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etAddress"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Rue, avenue..."
            android:inputType="textPostalAddress" />

        <!-- Ville -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🏙️ Ville"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etCity"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Dakar"
            android:inputType="text" />

        <!-- Pays -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🌍 Pays"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etCountry"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Sénégal"
            android:inputType="text" />

        <!-- Note -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="📝 Note"
            android:layout_marginTop="8dp" />
        
        <EditText
            android:id="@+id/etNote"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Note additionnelle..."
            android:inputType="textMultiLine"
            android:lines="2" />

        <!-- Boutons d'action -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginTop="16dp">

            <Button
                android:id="@+id/btnWrite"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="✍️ Écrire"
                android:layout_marginEnd="8dp" />

            <Button
                android:id="@+id/btnRead"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="📖 Lire"
                android:layout_marginEnd="8dp" />

            <Button
                android:id="@+id/btnClear"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="🗑️ Effacer" />
        </LinearLayout>

        <!-- Statut -->
        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Prêt à écrire une vCard"
            android:textSize="16sp"
            android:layout_marginTop="16dp"
            android:padding="12dp"
            android:background="#E3F2FD"
            android:textColor="#1976D2" />

        <!-- Informations de la carte -->
        <TextView
            android:id="@+id/tvInfo"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text=""
            android:textSize="12sp"
            android:layout_marginTop="8dp"
            android:padding="8dp"
            android:background="#F5F5F5"
            android:fontFamily="monospace" />

    </LinearLayout>
</ScrollView>
```

#### **build.gradle (app)**
```gradle
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.example.nfcwriter'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.nfcwriter"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}
```

---

## 🍎 APPLICATION iOS

### Structure du Projet

```
NFCVCardWriter/
├── NFCVCardWriter/
│   ├── ContentView.swift
│   ├── VCardModel.swift
│   ├── NFCManager.swift
│   ├── NFCVCardWriterApp.swift
│   └── Info.plist
```

### Code Source iOS

#### **NFCVCardWriterApp.swift**
```swift
import SwiftUI

@main
struct NFCVCardWriterApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

#### **VCardModel.swift**
```swift
import Foundation

struct VCardModel {
    var fullName: String = ""
    var firstName: String = ""
    var lastName: String = ""
    var mobilePhone: String = ""
    var workPhone: String = ""
    var email: String = ""
    var url: String = ""
    var organization: String = ""
    var title: String = ""
    var address: String = ""
    var city: String = ""
    var country: String = ""
    var note: String = ""
    
    /// Génère la vCard au format standard 3.0
    func toVCardString() -> String {
        var vcard = "BEGIN:VCARD\n"
        vcard += "VERSION:3.0\n"
        
        if !fullName.isEmpty {
            vcard += "FN:\(fullName)\n"
        }
        
        if !lastName.isEmpty && !firstName.isEmpty {
            vcard += "N:\(lastName);\(firstName);;;\n"
        }
        
        if !mobilePhone.isEmpty {
            vcard += "TEL;TYPE=CELL:\(mobilePhone)\n"
        }
        
        if !workPhone.isEmpty {
            vcard += "TEL;TYPE=WORK:\(workPhone)\n"
        }
        
        if !email.isEmpty {
            vcard += "EMAIL;TYPE=WORK:\(email)\n"
        }
        
        if !url.isEmpty {
            vcard += "URL:\(url)\n"
        }
        
        if !organization.isEmpty {
            vcard += "ORG:\(organization)\n"
        }
        
        if !title.isEmpty {
            vcard += "TITLE:\(title)\n"
        }
        
        if !address.isEmpty || !city.isEmpty || !country.isEmpty {
            vcard += "ADR;TYPE=WORK:;;\(address);\(city);;\(country)\n"
        }
        
        if !note.isEmpty {
            vcard += "NOTE:\(note)\n"
        }
        
        vcard += "END:VCARD"
        return vcard
    }
    
    /// Calcule la taille approximative en bytes
    func estimatedSize() -> Int {
        return toVCardString().data(using: .utf8)?.count ?? 0
    }
    
    /// Données de démonstration
    static var demo: VCardModel {
        return VCardModel(
            fullName: "Mamadou Diop",
            firstName: "Mamadou",
            lastName: "Diop",
            mobilePhone: "+221771234567",
            workPhone: "+221338765432",
            email: "mamadou@221foot.sn",
            url: "https://221foot.com",
            organization: "221Foot",
            title: "Gestionnaire de Terrain",
            address: "Avenue Cheikh Anta Diop",
            city: "Dakar",
            country: "Sénégal",
            note: "Réservation terrains de football"
        )
    }
}
```

#### **NFCManager.swift**
```swift
import CoreNFC
import SwiftUI

class NFCManager: NSObject, ObservableObject, NFCNDEFReaderSessionDelegate {
    
    @Published var statusMessage: String = "Prêt à écrire une vCard"
    @Published var statusColor: Color = .blue
    @Published var tagInfo: String = ""
    @Published var isScanning: Bool = false
    
    private var session: NFCNDEFReaderSession?
    private var vCardToWrite: VCardModel?
    private var isWriteMode: Bool = true
    
    /// Vérifie si NFC est disponible
    static var isNFCAvailable: Bool {
        return NFCNDEFReaderSession.readingAvailable
    }
    
    /// Lance l'écriture d'une vCard
    func writeVCard(_ vCard: VCardModel) {
        guard NFCManager.isNFCAvailable else {
            updateStatus("NFC non disponible sur cet appareil", color: .red)
            return
        }
        
        // Vérifier que le nom est renseigné
        guard !vCard.fullName.isEmpty else {
            updateStatus("Le nom complet est requis", color: .red)
            return
        }
        
        // Vérifier la taille (NTAG213 = 137 bytes max)
        let size = vCard.estimatedSize()
        if size > 137 {
            updateStatus("vCard trop grande (\(size) bytes). Maximum: 137 bytes", color: .red)
            return
        }
        
        self.vCardToWrite = vCard
        self.isWriteMode = true
        
        session = NFCNDEFReaderSession(delegate: self, queue: nil, invalidateAfterFirstRead: false)
        session?.alertMessage = "📱 Approchez la carte NFC pour l'écriture"
        session?.begin()
        
        isScanning = true
        updateStatus("Approchez la carte NFC...", color: .blue)
    }
    
    /// Lance la lecture d'une vCard
    func readVCard() {
        guard NFCManager.isNFCAvailable else {
            updateStatus("NFC non disponible sur cet appareil", color: .red)
            return
        }
        
        self.isWriteMode = false
        
        session = NFCNDEFReaderSession(delegate: self, queue: nil, invalidateAfterFirstRead: false)
        session?.alertMessage = "📖 Approchez la carte NFC pour la lecture"
        session?.begin()
        
        isScanning = true
        updateStatus("Lecture en cours...", color: .blue)
    }
    
    // MARK: - NFCNDEFReaderSessionDelegate
    
    func readerSession(_ session: NFCNDEFReaderSession, didDetectNDEFs messages: [NFCNDEFMessage]) {
        // Cette méthode est appelée automatiquement lors de la lecture
        // Mais nous gérons tout dans didDetect tags: pour avoir plus de contrôle
    }
    
    func readerSession(_ session: NFCNDEFReaderSession, didDetect tags: [NFCNDEFTag]) {
        guard tags.count == 1 else {
            session.alertMessage = "⚠️ Plus d'une carte détectée"
            session.invalidate()
            return
        }
        
        let tag = tags.first!
        
        // Se connecter à la carte
        session.connect(to: tag) { [weak self] error in
            guard let self = self else { return }
            
            if let error = error {
                session.invalidate(errorMessage: "Erreur de connexion: \(error.localizedDescription)")
                self.updateStatus("Erreur de connexion", color: .red)
                return
            }
            
            // Lire les informations de la carte
            tag.queryNDEFStatus { status, capacity, error in
                if let error = error {
                    session.invalidate(errorMessage: "Erreur: \(error.localizedDescription)")
                    self.updateStatus("Erreur de lecture", color: .red)
                    return
                }
                
                DispatchQueue.main.async {
                    self.tagInfo = "Capacité: \(capacity) bytes\nStatut: \(status.rawValue)"
                }
                
                if self.isWriteMode {
                    self.writeToTag(tag: tag, session: session, status: status)
                } else {
                    self.readFromTag(tag: tag, session: session)
                }
            }
        }
    }
    
    /// Écrit la vCard sur la carte
    private func writeToTag(tag: NFCNDEFTag, session: NFCNDEFReaderSession, status: NFCNDEFStatus) {
        guard let vCard = vCardToWrite else {
            session.invalidate(errorMessage: "Aucune vCard à écrire")
            return
        }
        
        // Vérifier si la carte est modifiable
        guard status == .readWrite else {
            session.invalidate(errorMessage: "Carte protégée en écriture")
            self.updateStatus("Carte protégée en écriture", color: .red)
            return
        }
        
        // Créer le payload NDEF
        let vCardString = vCard.toVCardString()
        guard let vCardData = vCardString.data(using: .utf8) else {
            session.invalidate(errorMessage: "Erreur de données")
            self.updateStatus("Erreur de conversion", color: .red)
            return
        }
        
        let payload = NFCNDEFPayload(
            format: .media,
            type: "text/vcard".data(using: .utf8)!,
            identifier: Data(),
            payload: vCardData
        )
        
        let message = NFCNDEFMessage(records: [payload])
        
        // Écrire sur la carte
        tag.writeNDEF(message) { error in
            if let error = error {
                session.invalidate(errorMessage: "Erreur d'écriture: \(error.localizedDescription)")
                self.updateStatus("Erreur d'écriture: \(error.localizedDescription)", color: .red)
            } else {
                let size = vCardData.count
                session.alertMessage = "✅ vCard programmée avec succès!\nTaille: \(size) bytes"
                session.invalidate()
                self.updateStatus("vCard programmée avec succès! (\(size) bytes)", color: .green)
            }
            
            DispatchQueue.main.async {
                self.isScanning = false
            }
        }
    }
    
    /// Lit la vCard depuis la carte
    private func readFromTag(tag: NFCNDEFTag, session: NFCNDEFReaderSession) {
        tag.readNDEF { message, error in
            if let error = error {
                session.invalidate(errorMessage: "Erreur de lecture: \(error.localizedDescription)")
                self.updateStatus("Erreur de lecture", color: .red)
                return
            }
            
            guard let message = message else {
                session.invalidate(errorMessage: "Aucune donnée sur la carte")
                self.updateStatus("Aucune donnée", color: .orange)
                return
            }
            
            // Rechercher les records vCard
            for record in message.records {
                let typeString = String(data: record.type, encoding: .utf8) ?? ""
                
                if typeString == "text/vcard" || typeString == "text/x-vCard" {
                    if let vCardString = String(data: record.payload, encoding: .utf8) {
                        session.alertMessage = "✅ vCard lue avec succès!"
                        session.invalidate()
                        self.updateStatus("vCard lue:\n\(vCardString)", color: .green)
                        
                        DispatchQueue.main.async {
                            self.isScanning = false
                        }
                        return
                    }
                }
            }
            
            session.invalidate(errorMessage: "Aucune vCard trouvée")
            self.updateStatus("Aucune vCard trouvée", color: .orange)
            
            DispatchQueue.main.async {
                self.isScanning = false
            }
        }
    }
    
    func readerSession(_ session: NFCNDEFReaderSession, didInvalidateWithError error: Error) {
        DispatchQueue.main.async {
            self.isScanning = false
            
            if let readerError = error as? NFCReaderError {
                if readerError.code != .readerSessionInvalidationErrorUserCanceled {
                    self.updateStatus("Erreur: \(error.localizedDescription)", color: .red)
                } else {
                    self.updateStatus("Scan annulé", color: .orange)
                }
            }
        }
    }
    
    /// Met à jour le statut
    private func updateStatus(_ message: String, color: Color) {
        DispatchQueue.main.async {
            self.statusMessage = message
            self.statusColor = color
        }
    }
}
```

#### **ContentView.swift**
```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var nfcManager = NFCManager()
    @State private var vCard = VCardModel.demo
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // En-tête
                    Text("📇 Carte de Visite NFC")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    // Vérification NFC
                    if !NFCManager.isNFCAvailable {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                            Text("NFC non disponible sur cet appareil")
                        }
                        .foregroundColor(.red)
                        .padding()
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(8)
                    }
                    
                    // Formulaire
                    VStack(alignment: .leading, spacing: 16) {
                        // Nom complet (requis)
                        FormField(
                            label: "Nom complet *",
                            icon: "person.fill",
                            text: $vCard.fullName,
                            placeholder: "Mamadou Diop"
                        )
                        
                        // Prénom
                        FormField(
                            label: "Prénom",
                            icon: "person",
                            text: $vCard.firstName,
                            placeholder: "Mamadou"
                        )
                        
                        // Nom de famille
                        FormField(
                            label: "Nom de famille",
                            icon: "person",
                            text: $vCard.lastName,
                            placeholder: "Diop"
                        )
                        
                        // Téléphone mobile
                        FormField(
                            label: "Téléphone mobile",
                            icon: "phone.fill",
                            text: $vCard.mobilePhone,
                            placeholder: "+221771234567",
                            keyboardType: .phonePad
                        )
                        
                        // Téléphone bureau
                        FormField(
                            label: "Téléphone bureau",
                            icon: "phone",
                            text: $vCard.workPhone,
                            placeholder: "+221338765432",
                            keyboardType: .phonePad
                        )
                        
                        // Email
                        FormField(
                            label: "Email",
                            icon: "envelope.fill",
                            text: $vCard.email,
                            placeholder: "contact@exemple.com",
                            keyboardType: .emailAddress
                        )
                        
                        // Site web
                        FormField(
                            label: "Site web",
                            icon: "globe",
                            text: $vCard.url,
                            placeholder: "https://monsite.com",
                            keyboardType: .URL
                        )
                        
                        // Organisation
                        FormField(
                            label: "Organisation",
                            icon: "building.2",
                            text: $vCard.organization,
                            placeholder: "Nom de l'entreprise"
                        )
                        
                        // Poste
                        FormField(
                            label: "Poste",
                            icon: "briefcase.fill",
                            text: $vCard.title,
                            placeholder: "Gestionnaire"
                        )
                        
                        // Adresse
                        FormField(
                            label: "Adresse",
                            icon: "mappin.circle.fill",
                            text: $vCard.address,
                            placeholder: "Rue, avenue..."
                        )
                        
                        // Ville
                        FormField(
                            label: "Ville",
                            icon: "building.2.crop.circle",
                            text: $vCard.city,
                            placeholder: "Dakar"
                        )
                        
                        // Pays
                        FormField(
                            label: "Pays",
                            icon: "flag.fill",
                            text: $vCard.country,
                            placeholder: "Sénégal"
                        )
                        
                        // Note
                        VStack(alignment: .leading, spacing: 4) {
                            Label("Note", systemImage: "note.text")
                                .font(.subheadline)
                                .fontWeight(.medium)
                            
                            TextEditor(text: $vCard.note)
                                .frame(height: 80)
                                .padding(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                )
                        }
                        
                        // Taille estimée
                        HStack {
                            Image(systemName: "info.circle")
                            Text("Taille estimée: \(vCard.estimatedSize()) bytes / 137 bytes max")
                                .font(.caption)
                        }
                        .foregroundColor(vCard.estimatedSize() > 137 ? .red : .secondary)
                        .padding(.vertical, 8)
                    }
                    .padding()
                    .background(Color(UIColor.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 2)
                    
                    // Boutons d'action
                    HStack(spacing: 12) {
                        Button(action: {
                            nfcManager.writeVCard(vCard)
                        }) {
                            Label("Écrire", systemImage: "pencil")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }
                        .disabled(nfcManager.isScanning)
                        
                        Button(action: {
                            nfcManager.readVCard()
                        }) {
                            Label("Lire", systemImage: "book")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }
                        .disabled(nfcManager.isScanning)
                        
                        Button(action: {
                            clearForm()
                        }) {
                            Label("Effacer", systemImage: "trash")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.red)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }
                    }
                    .padding(.horizontal)
                    
                    // Statut
                    VStack(alignment: .leading, spacing: 8) {
                        Text(nfcManager.statusMessage)
                            .font(.body)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(nfcManager.statusColor.opacity(0.1))
                            .foregroundColor(nfcManager.statusColor)
                            .cornerRadius(8)
                        
                        if !nfcManager.tagInfo.isEmpty {
                            Text(nfcManager.tagInfo)
                                .font(.caption)
                                .monospaced()
                                .padding()
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(UIColor.systemGray6))
                                .cornerRadius(8)
                        }
                    }
                    .padding(.horizontal)
                    
                    Spacer()
                }
                .padding()
            }
            .navigationBarHidden(true)
        }
    }
    
    func clearForm() {
        vCard = VCardModel()
        nfcManager.statusMessage = "Formulaire effacé"
        nfcManager.statusColor = .orange
        nfcManager.tagInfo = ""
    }
}

// Composant de champ de formulaire réutilisable
struct FormField: View {
    let label: String
    let icon: String
    @Binding var text: String
    var placeholder: String
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Label(label, systemImage: icon)
                .font(.subheadline)
                .fontWeight(.medium)
            
            TextField(placeholder, text: $text)
                .keyboardType(keyboardType)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .autocapitalization(keyboardType == .emailAddress || keyboardType == .URL ? .none : .words)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

#### **Info.plist**
Ajoutez ces clés à votre `Info.plist` :

```xml
<key>NFCReaderUsageDescription</key>
<string>Nous avons besoin d'accéder au NFC pour lire et écrire vos cartes de visite</string>

<key>com.apple.developer.nfc.readersession.formats</key>
<array>
    <string>NDEF</string>
</array>
```

---

## 🚀 Compilation et Exécution

### **Android (Android Studio)**

1. **Créer un nouveau projet :**
   ```
   File → New → New Project → Empty Activity
   ```

2. **Copier les fichiers** dans la structure appropriée

3. **Synchroniser Gradle :**
   ```
   Tools → Sync Project with Gradle Files
   ```

4. **Lancer sur un appareil physique** (NFC ne fonctionne pas sur émulateur)
   ```
   Run → Run 'app'
   ```

### **iOS (Xcode)**

1. **Créer un nouveau projet :**
   ```
   File → New → Project → iOS → App
   Interface: SwiftUI
   ```

2. **Ajouter la capacité NFC :**
   - Sélectionnez le projet dans le navigateur
   - Target → Signing & Capabilities
   - Cliquez sur "+ Capability"
   - Ajoutez "Near Field Communication Tag Reading"

3. **Copier les fichiers Swift**

4. **Modifier Info.plist** avec les clés NFC

5. **Lancer sur iPhone physique** (iOS 13+ minimum, NFC pas sur simulateur)
   ```
   Product → Run
   ```

---

## 📝 Notes Importantes

### **Limitations NTAG213**
- **137 bytes utilisables**
- Si votre vCard dépasse cette taille, réduisez les informations
- Version minimaliste recommandée : Nom + Téléphone + Email + URL = ~80-100 bytes

### **Compatibilité**
- **Android** : API 19+ (Android 4.4+) avec NFC
- **iOS** : iOS 13+ sur iPhone 7 et ultérieurs

### **Test**
1. Programmez votre carte avec l'app
2. Testez avec n'importe quel smartphone NFC
3. Le contact s'affiche automatiquement (même sans internet)
4. Option "Ajouter aux contacts" disponible

---

## 🎯 Utilisation

1. **Ouvrir l'application**
2. **Remplir le formulaire** (minimum : nom complet)
3. **Appuyer sur "Écrire"**
4. **Approcher la carte NFC** du téléphone
5. **Succès !** La carte est programmée

**Pour tester :** Scannez avec n'importe quel smartphone compatible NFC 📱

---

Créé pour les cartes **NTAG213** | Fonctionne **100% hors ligne** ✅


