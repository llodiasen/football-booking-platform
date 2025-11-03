# 🚀 Guide de Déploiement sur Vercel

**Projet** : Football Booking Platform - 221FOOT  
**Frontend** : React + Vite  
**Backend** : Node.js + Express + MongoDB Atlas  
**Date** : 3 Novembre 2025

---

## 📋 Prérequis

✅ Compte GitHub (vous avez déjà)  
✅ Projet sur GitHub : https://github.com/llodiasen/football-booking-platform  
✅ MongoDB Atlas configuré  
✅ Compte Vercel (gratuit)

---

## 🎯 Plan de Déploiement

Nous allons déployer :
1. **Frontend** sur Vercel (React/Vite)
2. **Backend** sur Vercel (API Node.js)

---

## 🔐 ÉTAPE 0 : Créer un Compte Vercel

### Si vous n'avez pas encore de compte :

1. Allez sur : **https://vercel.com/signup**
2. Cliquez sur **"Continue with GitHub"**
3. Autorisez Vercel à accéder à votre GitHub
4. Vous êtes maintenant connecté ! ✅

---

## 🎨 PARTIE 1 : Déployer le Frontend

### Étape 1 : Connecter Vercel à votre GitHub

1. Allez sur : **https://vercel.com/new**
2. Cliquez sur **"Add GitHub Account"** (si pas déjà fait)
3. Autorisez Vercel à accéder à vos dépôts

### Étape 2 : Importer le Projet Frontend

1. Sur **https://vercel.com/new**, vous verrez vos dépôts GitHub
2. Trouvez **"llodiasen/football-booking-platform"**
3. Cliquez sur **"Import"**

### Étape 3 : Configurer le Frontend

**Sur la page de configuration :**

| Champ | Valeur |
|-------|--------|
| **Project Name** | `football-booking-frontend` |
| **Framework Preset** | **Vite** (détecté automatiquement) |
| **Root Directory** | `frontend` ← **IMPORTANT !** |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Étape 4 : Variables d'Environnement Frontend

Cliquez sur **"Environment Variables"** et ajoutez :

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://votre-backend.vercel.app` (on l'aura après) |

**⚠️ Pour l'instant, laissez vide ou mettez** : `http://localhost:5000`

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"** 🚀
2. Attendez 2-3 minutes (build en cours)
3. Vous verrez : **"Congratulations! Your project has been deployed"** 🎉
4. Notez l'URL : **`https://football-booking-frontend.vercel.app`**

---

## 🖥️ PARTIE 2 : Déployer le Backend

### Étape 1 : Nouveau Projet Backend

1. Retournez sur **https://vercel.com/new**
2. Cliquez à nouveau sur **"llodiasen/football-booking-platform"**
3. Cliquez sur **"Import"**

### Étape 2 : Configurer le Backend

| Champ | Valeur |
|-------|--------|
| **Project Name** | `football-booking-backend` |
| **Framework Preset** | **Other** |
| **Root Directory** | `backend` ← **IMPORTANT !** |
| **Build Command** | `npm install` (laisser par défaut) |
| **Output Directory** | (laisser vide) |
| **Install Command** | `npm install` |

### Étape 3 : Variables d'Environnement Backend ⚠️ CRUCIAL

Cliquez sur **"Environment Variables"** et ajoutez **TOUTES** ces variables :

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://wopallodia92_db_user:lGchu6iXKe416SWa@cluster0.tuwrfir.mongodb.net/football-booking?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `football_booking_secret_key_development_2024_minimum_32_characters_required` |
| `FRONTEND_URL` | `https://football-booking-frontend.vercel.app` |

**⚠️ Attention** : Copiez EXACTEMENT vos valeurs depuis votre fichier `.env` local !

### Étape 4 : Déployer le Backend

1. Cliquez sur **"Deploy"** 🚀
2. Attendez 2-3 minutes
3. Vous verrez l'URL : **`https://football-booking-backend.vercel.app`**

---

## 🔄 PARTIE 3 : Connecter Frontend et Backend

### Étape 1 : Mettre à Jour Frontend

1. Allez sur votre projet frontend : **https://vercel.com/llodiasen/football-booking-frontend**
2. Cliquez sur **"Settings"** (en haut)
3. Cliquez sur **"Environment Variables"** (menu gauche)
4. Modifiez `VITE_API_URL` :
   - **Value** : `https://football-booking-backend.vercel.app`
5. Cliquez sur **"Save"**

### Étape 2 : Redéployer le Frontend

1. Allez sur l'onglet **"Deployments"**
2. Cliquez sur les 3 points **"..."** du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Attendez 2 minutes

---

## 🔧 PARTIE 4 : Configurer CORS Backend

Le backend doit autoriser les requêtes depuis le frontend Vercel.

**Dans votre `.env` local, ajoutez** :
```env
FRONTEND_URL=https://football-booking-frontend.vercel.app
```

Puis sur Vercel Backend :
1. Settings → Environment Variables
2. Modifiez `FRONTEND_URL` :
   - Value : `https://football-booking-frontend.vercel.app`
3. Redéployez le backend

---

## ✅ PARTIE 5 : Vérification

### URLs Finales

- **Frontend** : `https://football-booking-frontend.vercel.app`
- **Backend API** : `https://football-booking-backend.vercel.app`
- **Test API** : `https://football-booking-backend.vercel.app/health`

### Tests à Faire

1. **Frontend** :
   - Ouvrir l'URL frontend
   - La page d'accueil s'affiche ✅
   - Les terrains s'affichent ✅

2. **Backend** :
   - Ouvrir `https://football-booking-backend.vercel.app`
   - Vous devriez voir un JSON avec le message de bienvenue ✅
   - Ouvrir `https://football-booking-backend.vercel.app/api/terrains`
   - Vous devriez voir les 73 terrains ✅

3. **Connexion** :
   - Testez la connexion sur le frontend
   - Testez une réservation

---

## 🚨 Problèmes Courants et Solutions

### Problème 1 : "Application Error"

**Cause** : Variables d'environnement manquantes

**Solution** :
1. Vérifiez toutes les variables dans Settings → Environment Variables
2. Redéployez

### Problème 2 : CORS Error

**Cause** : FRONTEND_URL mal configuré

**Solution** :
1. Backend → Settings → Environment Variables
2. `FRONTEND_URL` = URL exacte du frontend
3. Redéployez le backend

### Problème 3 : MongoDB Connection Failed

**Cause** : MONGODB_URI incorrect

**Solution** :
1. Vérifiez l'URL MongoDB dans Settings
2. Vérifiez que MongoDB Atlas autorise les connexions depuis `0.0.0.0/0`

### Problème 4 : Build Failed

**Cause** : Erreur dans le code

**Solution** :
1. Cliquez sur "View Build Logs"
2. Lisez l'erreur
3. Corrigez localement
4. Push sur GitHub
5. Vercel redéploie automatiquement

---

## 🔄 Déploiements Automatiques

### Configuration Actuelle

✅ **Chaque fois que vous faites `git push`** :
- Vercel détecte le changement
- Rebuild automatique
- Déploiement automatique
- Nouveau lien de preview

### Branches

- **main** → Déploiement en Production
- **autres branches** → Preview URLs

---

## 💡 Commandes Utiles

### Après Modifications Locales

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform

git add .
git commit -m "Description des changements"
git push
```

**→ Vercel redéploie automatiquement en 2-3 min ! 🚀**

---

## 📊 Monitoring

### Dashboard Vercel

Accès : **https://vercel.com/llodiasen**

**Vous pouvez voir** :
- 📈 Nombre de visites
- ⚡ Performance
- ❌ Erreurs
- 📊 Analytics
- 🔍 Logs en temps réel

---

## 🎯 Optimisations Recommandées

### Avant Production

1. **Changer les Secrets** :
   - Nouveau `JWT_SECRET` (plus fort)
   - Nouveau mot de passe MongoDB (si nécessaire)

2. **Configurer le Domaine** (optionnel) :
   - Acheter un domaine (ex: 221foot.sn)
   - Le connecter sur Vercel
   - Settings → Domains → Add

3. **Activer HTTPS** :
   - Automatique sur Vercel ✅
   - Certificat SSL gratuit

---

## 📝 Checklist de Déploiement

### Avant de Déployer

- ✅ Code testé localement
- ✅ Pas d'erreurs console
- ✅ MongoDB Atlas configuré
- ✅ Variables `.env` prêtes
- ✅ GitHub à jour

### Pendant le Déploiement

- ⏳ Créer compte Vercel
- ⏳ Importer projet GitHub
- ⏳ Configurer variables d'environnement
- ⏳ Déployer frontend
- ⏳ Déployer backend
- ⏳ Connecter frontend ↔ backend

### Après le Déploiement

- ⏳ Tester l'URL frontend
- ⏳ Tester l'API backend
- ⏳ Vérifier connexion MongoDB
- ⏳ Tester une réservation

---

## 🎊 Résultat Final

Vous aurez :
- 🌐 **Site Web en Ligne** : Accessible partout dans le monde
- ⚡ **CDN Rapide** : Vercel Edge Network
- 🔒 **HTTPS Gratuit** : Sécurité SSL automatique
- 🔄 **Auto-Deploy** : Chaque push = nouveau déploiement
- 📊 **Analytics** : Statistiques de visites

---

## 🚀 COMMENÇONS !

**Êtes-vous prêt à déployer ?**

1. **Créez votre compte Vercel** : https://vercel.com/signup
2. **Connectez GitHub**
3. **Dites-moi quand c'est fait**, je vous guiderai étape par étape ! 

Ou voulez-vous que je vous crée un guide encore plus détaillé avec captures d'écran ?

