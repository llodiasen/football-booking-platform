# 📸 Guide - Images Section 2 (3 Colonnes)

## 🎯 Images à Utiliser

### Image 1 : Terrain À 5 (Filet de but)
**Nom du fichier :** `terrain-5x5.jpg`  
**Description :** Filet de but blanc avec terrain vert en arrière-plan  
**Position :** Colonne de gauche  
**Badge :** Vert avec "5x5"

### Image 2 : Terrain À 7 (Vue large jour)
**Nom du fichier :** `terrain-7x7.jpg`  
**Description :** Vue panoramique du complexe sportif de jour  
**Position :** Colonne du milieu  
**Badge :** Bleu avec "7x7"

### Image 3 : Terrain À 11 (Nuit avec joueurs)
**Nom du fichier :** `terrain-11x11.jpg`  
**Description :** Terrain éclairé la nuit avec joueurs  
**Position :** Colonne de droite  
**Badge :** Jaune avec "11x11"

---

## 📂 Emplacement des Fichiers

```
C:\Users\wopal\Desktop\football-booking-platform\
└── frontend\
    └── public\
        └── images\
            ├── terrain-5x5.jpg    ← Image 1 (Filet)
            ├── terrain-7x7.jpg    ← Image 2 (Vue large)
            └── terrain-11x11.jpg  ← Image 3 (Nuit)
```

---

## 🚀 Méthode 1 : Glisser-Déposer (Le Plus Simple)

1. **Ouvrez l'Explorateur Windows**
2. **Naviguez vers :**
   ```
   C:\Users\wopal\Desktop\football-booking-platform\frontend\public\images
   ```
3. **Renommez vos 3 images :**
   - Image filet → `terrain-5x5.jpg`
   - Image vue large → `terrain-7x7.jpg`
   - Image nuit → `terrain-11x11.jpg`
4. **Glissez-déposez** les 3 fichiers dans le dossier `images`
5. **Rafraîchissez** votre navigateur (`Ctrl + Shift + R`)

---

## 💻 Méthode 2 : PowerShell

```powershell
# 1. Allez dans le dossier images
cd C:\Users\wopal\Desktop\football-booking-platform\frontend\public\images

# 2. Copiez vos images (ajustez les chemins source)
Copy-Item "C:\Téléchargements\image-filet.jpg" "terrain-5x5.jpg"
Copy-Item "C:\Téléchargements\image-vue-large.jpg" "terrain-7x7.jpg"
Copy-Item "C:\Téléchargements\image-nuit.jpg" "terrain-11x11.jpg"

# 3. Vérifiez que les fichiers sont là
dir terrain-*.jpg
```

---

## ✅ Vérification

Après avoir copié les images, vérifiez que vous avez :

```
frontend/public/images/
├── football-hero.webp     (déjà existant)
├── basketball-hero.webp   (déjà existant)
├── Tennis-hero.webp       (déjà existant)
├── terrain-5x5.jpg        ← NOUVEAU
├── terrain-7x7.jpg        ← NOUVEAU
└── terrain-11x11.jpg      ← NOUVEAU
```

---

## 🎨 Résultat Attendu

Une fois les images copiées, la section 2 affichera :

```
┌─────────────────┬─────────────────┬─────────────────┐
│                 │                 │                 │
│  [Image Filet]  │ [Image Vue     │ [Image Nuit]    │
│                 │  Large Jour]   │                 │
│                 │                 │                 │
│  FOOTBALLSN     │  FOOTBALLSN    │  FOOTBALLSN     │
│  Terrain À 5    │  Terrain À 7   │  Terrain À 11   │
│  Description... │  Description...│  Description... │
│  [ligne verte]  │  [ligne bleue] │  [ligne jaune]  │
│  [Badge 5x5]    │  [Badge 7x7]   │  [Badge 11x11]  │
│                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
     480px              480px             480px
```

---

## 🔍 Si les Images ne S'affichent Pas

### 1. Vérifiez les noms EXACTEMENT :
```
✅ terrain-5x5.jpg   (tout en minuscules)
❌ Terrain-5x5.jpg   (majuscule)
❌ terrain-5x5.JPG   (extension majuscule)
❌ terrain 5x5.jpg   (espace)
```

### 2. Vérifiez l'emplacement :
```
✅ frontend/public/images/terrain-5x5.jpg
❌ frontend/src/images/terrain-5x5.jpg
❌ backend/images/terrain-5x5.jpg
```

### 3. Rafraîchissez la page :
```
Ctrl + Shift + R  (hard refresh)
```

### 4. Vérifiez la console (F12) :
Cherchez les erreurs 404 pour les images

---

## 📊 Récapitulatif

| Étape | Action | Statut |
|-------|--------|--------|
| 1 | Code mis à jour | ✅ Terminé |
| 2 | Renommer Image 1 → `terrain-5x5.jpg` | ⏳ À faire |
| 3 | Renommer Image 2 → `terrain-7x7.jpg` | ⏳ À faire |
| 4 | Renommer Image 3 → `terrain-11x11.jpg` | ⏳ À faire |
| 5 | Copier dans `frontend/public/images/` | ⏳ À faire |
| 6 | Rafraîchir navigateur | ⏳ À faire |

---

## 🎯 Après avoir copié les images :

**Rafraîchissez :** `http://localhost:5174`

**Vous verrez :**
- ✅ Image 1 (filet) dans colonne gauche
- ✅ Image 2 (vue large) dans colonne milieu
- ✅ Image 3 (nuit) dans colonne droite

**Chaque image avec :**
- ✅ Overlay sombre pour lisibilité
- ✅ Texte blanc bien visible
- ✅ Effet zoom au hover
- ✅ Badge coloré

---

**🏟️ Copiez les 3 images maintenant et dites-moi quand c'est fait ! Je vérifierai avec vous ! 😊**

