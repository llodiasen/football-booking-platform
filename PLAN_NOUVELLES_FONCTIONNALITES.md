# 🚀 Plan des Nouvelles Fonctionnalités

## 📋 Liste des Fonctionnalités Demandées

### 1. 📸 **Upload Multi-Photos**
- Upload depuis l'appareil (fichier local)
- Upload par URL
- Galerie de photos avec gestion (supprimer, réorganiser)
- Définir une photo principale
- Prévisualisation avant upload

### 2. 🔐 **Authentification Améliorée**
- Connexion avec Google (OAuth)
- Connexion avec numéro de téléphone (SMS OTP)
- Login classique (email/mot de passe)

### 3. 💰 **Prix Variables par Jour**
- Prix différents selon jour de semaine
- Prix weekend différent
- Prix haute saison / basse saison
- Tarifs horaires personnalisés

### 4. 🎁 **Système de Réductions**
- Réductions en pourcentage ou montant fixe
- Réductions sur durée (ex: -20% si réservation > 3h)
- Codes promo
- Offres spéciales (happy hour, etc.)

### 5. ✅ **Vérification KYC Propriétaire**
- Obligation de vérifier le compte sous 7 jours
- Upload documents (CNI, justificatif domicile)
- Notification rappel (email + dashboard)
- Badge "Vérifié" sur les terrains

### 6. 💬 **Chat Direct Propriétaire-Client**
- Chat en temps réel après réservation validée
- Historique des messages
- Notifications de nouveaux messages
- Affichage du numéro de téléphone après validation

### 7. 📱 **Affichage Numéro Propriétaire**
- Masqué avant réservation
- Visible après validation du paiement
- Bouton "Appeler" direct

---

## 🎯 Priorisation (Ordre d'Implémentation)

### 🔥 **PRIORITÉ 1 - Fonctionnalités Critiques**

#### P1.1 - Upload Multi-Photos
**Temps estimé :** 4-6 heures
**Pourquoi :** Essentiel pour présenter les terrains
**Dépendances :** Cloudinary ou service similaire

#### P1.2 - Prix Variables par Jour
**Temps estimé :** 3-4 heures
**Pourquoi :** Impact direct sur les revenus
**Dépendances :** Aucune

#### P1.3 - Système de Réductions
**Temps estimé :** 2-3 heures
**Pourquoi :** Augmente les réservations
**Dépendances :** Prix variables

---

### ⚡ **PRIORITÉ 2 - Fonctionnalités Importantes**

#### P2.1 - Affichage Numéro après Validation
**Temps estimé :** 1-2 heures
**Pourquoi :** Améliore la communication
**Dépendances :** Système de réservation

#### P2.2 - Vérification KYC
**Temps estimé :** 4-5 heures
**Pourquoi :** Confiance et sécurité
**Dépendances :** Upload de fichiers

---

### 🌟 **PRIORITÉ 3 - Fonctionnalités Avancées**

#### P3.1 - Chat Direct
**Temps estimé :** 8-10 heures
**Pourquoi :** Excellent pour l'expérience utilisateur
**Dépendances :** Socket.io ou service de chat

#### P3.2 - Authentification Google
**Temps estimé :** 3-4 heures
**Pourquoi :** Simplifie l'inscription
**Dépendances :** Google Cloud Console

#### P3.3 - Authentification par SMS
**Temps estimé :** 4-5 heures
**Pourquoi :** Populaire au Sénégal
**Dépendances :** Service SMS (Twilio)

---

## 📊 Plan d'Implémentation Détaillé

### 📸 PHASE 1 : Upload Multi-Photos (4-6h)

#### Backend
```javascript
// 1. Installer Cloudinary ou Multer
npm install cloudinary multer

// 2. Configuration
- Setup Cloudinary account
- Configuration dans .env
- Middleware upload

// 3. Routes API
POST /api/terrains/:id/images    // Upload nouvelle image
DELETE /api/terrains/:id/images/:imageId  // Supprimer image
PUT /api/terrains/:id/images/:imageId/main  // Définir principale
```

#### Frontend
```javascript
// 1. Composant UploadImages
- Input file multiple
- Prévisualisation
- Drag & drop
- Barre de progression

// 2. Galerie d'images
- Grid responsive
- Boutons actions
- Réorganisation (drag & drop)
```

#### Fichiers à Créer/Modifier
- `backend/src/middleware/upload.js`
- `backend/src/config/cloudinary.js`
- `backend/src/controllers/imageController.js`
- `frontend/src/components/owner/ImageUploader.jsx`
- `frontend/src/components/owner/ImageGallery.jsx`

---

### 💰 PHASE 2 : Prix Variables (3-4h)

#### Modèle de Données
```javascript
priceRules: {
  default: 30000,  // Prix par défaut
  weekdays: {
    monday: 25000,
    tuesday: 25000,
    wednesday: 25000,
    thursday: 30000,
    friday: 35000
  },
  weekend: {
    saturday: 40000,
    sunday: 40000
  },
  timeSlots: [
    {
      start: '18:00',
      end: '22:00',
      price: 45000,  // Happy hour inversé (peak hours)
      days: ['friday', 'saturday']
    }
  ]
}
```

#### Interface Propriétaire
- Tableau de configuration des prix
- Vue calendrier
- Prévisualisation des prix

#### Fichiers à Créer/Modifier
- `backend/src/models/Terrain.js` (+ priceRules)
- `backend/src/utils/priceCalculator.js`
- `frontend/src/components/owner/PriceRulesEditor.jsx`

---

### 🎁 PHASE 3 : Système de Réductions (2-3h)

#### Types de Réductions
```javascript
discounts: [
  {
    type: 'duration',  // Réduction sur durée
    condition: { hours: 3 },
    value: 20,  // 20%
    valueType: 'percentage'
  },
  {
    type: 'promo_code',
    code: 'WELCOME10',
    value: 5000,
    valueType: 'fixed',
    validUntil: '2024-12-31'
  },
  {
    type: 'happy_hour',
    timeSlot: { start: '14:00', end: '17:00' },
    value: 30,
    days: ['monday', 'tuesday']
  }
]
```

#### Interface
- Créateur de réductions
- Liste des réductions actives
- Statistiques d'utilisation

---

### ✅ PHASE 4 : Vérification KYC (4-5h)

#### Flux KYC
```
1. Inscription Propriétaire
   ↓
2. Notification : "Vérifiez votre compte sous 7 jours"
   ↓
3. Upload Documents :
   - Photo CNI recto
   - Photo CNI verso
   - Justificatif de domicile
   - Photo du terrain
   ↓
4. Révision Admin
   ↓
5. Compte vérifié ✓
```

#### Modèle
```javascript
ownerProfile: {
  verified: false,
  verificationStatus: 'pending', // pending, approved, rejected
  verificationDocuments: {
    idCardFront: { url: '', status: 'pending' },
    idCardBack: { url: '', status: 'pending' },
    proofOfAddress: { url: '', status: 'pending' }
  },
  verificationDeadline: Date,
  verificationSubmittedAt: Date,
  verificationCompletedAt: Date
}
```

#### Notifications
- Email J+1 : "N'oubliez pas de vérifier votre compte"
- Email J+5 : "Plus que 2 jours !"
- Email J+7 : "Dernier jour !"
- Dashboard : Badge rouge persistant

---

### 💬 PHASE 5 : Chat Direct (8-10h)

#### Architecture
```
Option A : Socket.io (temps réel)
Option B : Firebase Firestore (simple)
Option C : Service tiers (Stream Chat, SendBird)
```

#### Modèle
```javascript
Message: {
  conversation: ObjectId,  // Lien vers Conversation
  sender: ObjectId,
  receiver: ObjectId,
  content: String,
  read: Boolean,
  sentAt: Date
}

Conversation: {
  reservation: ObjectId,  // Lié à une réservation
  participants: [ObjectId, ObjectId],  // client + owner
  lastMessage: String,
  lastMessageAt: Date,
  unreadCount: { owner: 0, client: 0 }
}
```

#### Interface
- Widget chat en bas à droite
- Liste des conversations
- Notifications temps réel
- Indicateur "en train d'écrire..."

---

### 🔐 PHASE 6 : Auth Google & SMS (7-9h)

#### Google OAuth
```javascript
// 1. Configuration Google Cloud
- Créer projet
- Activer Google+ API
- Obtenir Client ID

// 2. Backend
npm install passport passport-google-oauth20

// 3. Routes
GET /api/auth/google         // Redirection Google
GET /api/auth/google/callback  // Retour Google
```

#### Auth SMS (Twilio)
```javascript
// 1. Configuration Twilio
- Créer compte
- Obtenir Account SID + Auth Token
- Acheter numéro (+221)

// 2. Flow
POST /api/auth/sms/send       // Envoie code
POST /api/auth/sms/verify     // Vérifie code
```

---

## 🛠️ Technologies Requises

### Services Externes

| Service | Usage | Coût | Nécessaire |
|---------|-------|------|------------|
| **Cloudinary** | Upload images | Gratuit (10GB) | ⭐⭐⭐ |
| **Twilio** | SMS OTP | ~0.05$/SMS | ⭐⭐ |
| **Firebase** | Chat temps réel | Gratuit (50K lectures/jour) | ⭐⭐⭐ |
| **Google Cloud** | OAuth | Gratuit | ⭐ |

### Packages NPM

#### Backend
```bash
npm install cloudinary multer
npm install socket.io
npm install passport passport-google-oauth20
npm install twilio
npm install node-cron  # Pour notifications KYC
```

#### Frontend
```bash
npm install socket.io-client
npm install react-dropzone
npm install react-image-gallery
npm install @react-oauth/google
```

---

## 📅 Timeline Estimé

### Sprint 1 (Semaine 1)
- ✅ Upload Multi-Photos : 2 jours
- ✅ Prix Variables : 1.5 jours
- ✅ Système Réductions : 1 jour

### Sprint 2 (Semaine 2)
- ✅ Affichage Numéro : 0.5 jour
- ✅ Vérification KYC : 2 jours
- ✅ Tests & Debugging : 1.5 jours

### Sprint 3 (Semaine 3)
- ✅ Chat Direct : 3 jours
- ✅ Tests & Intégration : 1 jour

### Sprint 4 (Semaine 4)
- ✅ Auth Google : 1.5 jours
- ✅ Auth SMS : 2 jours
- ✅ Tests Finaux : 0.5 jour

**TOTAL : ~4 semaines pour tout implémenter**

---

## 🎯 Par Où Commencer ?

### Option 1 : Quick Wins (Recommandé)
```
1. Prix Variables (1 jour)
2. Réductions (1 jour)
3. Affichage Numéro (0.5 jour)
→ Impact immédiat, peu de complexité
```

### Option 2 : User Experience
```
1. Upload Photos (2 jours)
2. Chat Direct (3 jours)
→ Meilleure expérience utilisateur
```

### Option 3 : Sécurité & Confiance
```
1. Vérification KYC (2 jours)
2. Auth Google (1.5 jours)
→ Renforce la confiance
```

---

## 💡 Recommandations

### À Faire Maintenant (Cette Semaine)
1. ✅ **Upload Photos** - Cloudinary gratuit, facile
2. ✅ **Prix Variables** - Impact business immédiat
3. ✅ **Affichage Numéro** - Simple et utile

### À Faire Prochainement (Semaine 2-3)
4. ✅ **Vérification KYC** - Crucial pour la crédibilité
5. ✅ **Réductions** - Boost les réservations

### À Faire Plus Tard (Semaine 4+)
6. ✅ **Chat** - Nice to have, complexe
7. ✅ **Auth Google/SMS** - Améliore conversion

---

## 📞 Questions Importantes

### Pour Upload Photos
**Q:** Voulez-vous stocker sur votre serveur ou cloud (Cloudinary) ?
**Recommandation :** Cloudinary (gratuit, optimisation auto, CDN)

### Pour Chat
**Q:** Temps réel nécessaire ou messages classiques suffisants ?
**Recommandation :** Messages classiques d'abord, temps réel plus tard

### Pour SMS
**Q:** Budget SMS disponible ? (~0.05$/SMS)
**Recommandation :** Commencer avec email/Google, SMS plus tard

---

## 🚀 Action Immédiate

**Voulez-vous que je commence par :**

**A.** 📸 Upload Multi-Photos (impact visuel immédiat)
**B.** 💰 Prix Variables + Réductions (impact business)
**C.** ✅ Vérification KYC (crédibilité)
**D.** 💬 Chat Direct (expérience utilisateur)

**Ou un mix : A + B ensemble ?**

Dites-moi votre choix et je commence l'implémentation ! 🔥

