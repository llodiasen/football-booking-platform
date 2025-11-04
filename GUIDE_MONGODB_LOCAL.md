# 🔧 Guide MongoDB Local

## ❌ Problème Détecté

```
Erreur: connect ECONNREFUSED ::1:27017
MongoDB n'est pas démarré sur votre machine locale
```

---

## ⚡ Solution 1 : Utiliser MongoDB Atlas (RECOMMANDÉ)

**Avantages** : Rapide, pas d'installation, même DB qu'en production

### Étapes :

1. **Créer le fichier `.env` dans `backend/`** :

```bash
cd backend
echo > .env
```

2. **Copier cette configuration dans `backend/.env`** :

```env
# Environnement
NODE_ENV=development
PORT=5000

# MongoDB Atlas (même base qu'en production)
MONGODB_URI=votre_url_mongodb_atlas_ici

# JWT Secret (générer une clé aléatoire)
JWT_SECRET=votre_secret_jwt_super_securise_ici

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Wave Payment (optionnel en dev)
WAVE_API_KEY=
WAVE_API_SECRET=
```

3. **Récupérer votre URL MongoDB Atlas** :
   - Allez sur https://cloud.mongodb.com
   - Cliquez sur "Connect" sur votre cluster
   - Choisissez "Connect your application"
   - Copiez l'URL (format : `mongodb+srv://username:password@cluster.mongodb.net/football-booking`)

4. **Remplacer dans le `.env`** :
   ```env
   MONGODB_URI=mongodb+srv://votre_url_complete_ici
   ```

5. **Redémarrer le backend** :
   ```bash
   npm run dev
   ```

---

## 🖥️ Solution 2 : Installer MongoDB Localement

**Avantages** : Données en local, pas besoin d'internet

### Sur Windows :

1. **Télécharger MongoDB Community Server** :
   - https://www.mongodb.com/try/download/community
   - Choisir "Windows" et "MSI"

2. **Installer** :
   - Exécuter le fichier `.msi`
   - Choisir "Complete"
   - Cocher "Install MongoDB as a Service"
   - Laisser les options par défaut

3. **Vérifier l'installation** :
   ```bash
   mongod --version
   ```

4. **Créer le fichier `.env` dans `backend/`** :
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/football-booking
   JWT_SECRET=votre_secret_jwt_ici
   FRONTEND_URL=http://localhost:5173
   ```

5. **Démarrer MongoDB** :
   - Ouvrir "Services" Windows (Win + R → `services.msc`)
   - Chercher "MongoDB"
   - Clic droit → "Démarrer"

6. **Redémarrer le backend** :
   ```bash
   cd backend
   npm run dev
   ```

---

## 🔄 Peupler la Base de Données Locale

Si vous utilisez MongoDB local (vide), vous devez ajouter des données :

```bash
cd backend

# Créer un compte admin
node src/scripts/createAdmin.js

# Ajouter les terrains de test (si script existe)
node src/scripts/seedTerrains.js

# Ajouter des avis
node src/scripts/addReviewsToTerrains.js
```

---

## ✅ Vérification

Une fois MongoDB démarré :

1. **Backend doit afficher** :
   ```
   ✅ MongoDB connecté avec succès
   🚀 Serveur démarré sur le port 5000
   ```

2. **Tester l'API** :
   ```bash
   curl http://localhost:5000/api/terrains
   ```

3. **Frontend doit charger les terrains**

---

## 📊 Optimisations Appliquées Aujourd'hui

Pendant que MongoDB se connecte, voici ce qui a été optimisé :

### 🚀 Backend
- ✅ Pagination (12 terrains/page au lieu de 100)
- ✅ API `/availability` avec plage de dates (1 appel au lieu de 30)
- ✅ Exclusion des reviews/customAvailability de la liste des terrains
- ✅ Script d'ajout d'indexes MongoDB (`addIndexes.js`)

### ⚡ Frontend
- ✅ Calendrier optimisé (1 seul appel API)
- ✅ Bouton "Charger plus" (pagination infinie)
- ✅ Skeleton loaders professionnels
- ✅ Images avec lazy loading

### 📈 Résultats Attendus
- **Chargement initial** : 3-5x plus rapide
- **Calendrier** : 30x plus rapide (30 appels → 1 appel)
- **Terrains** : 8x moins de données chargées

---

## 🆘 Besoin d'Aide ?

Si vous avez des difficultés :
1. Vérifiez que le fichier `backend/.env` existe
2. Vérifiez que `MONGODB_URI` est correct
3. Redémarrez le backend (`Ctrl+C` puis `npm run dev`)

