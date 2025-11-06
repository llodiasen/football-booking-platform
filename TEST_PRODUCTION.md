# 🔍 Test de Production - Diagnostic

## ❌ **Erreur : "Erreur de connexion"**

Cela signifie que le **backend ne répond pas** ou que le **frontend ne peut pas l'atteindre**.

---

## 🧪 **TESTS À FAIRE**

### 1️⃣ **Tester le Backend directement**

Ouvrez ces URLs dans votre navigateur mobile :

#### Test 1 : Health Check
```
https://football-booking-backend.vercel.app/api/health
```
**Résultat attendu** : `{ "status": "OK", "message": "Backend is running" }`

#### Test 2 : API Terrains
```
https://football-booking-backend.vercel.app/api/terrains
```
**Résultat attendu** : Liste de terrains en JSON

#### Test 3 : Login (POST - plus complexe)
Utilisez cette URL pour voir si la route existe :
```
https://football-booking-backend.vercel.app/api/auth/login
```
**Résultat attendu** : Erreur 400 ou 404, mais **pas** "Cannot GET"

---

### 2️⃣ **Vérifier les Variables d'Environnement Vercel**

#### Backend Vercel :
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez **`football-booking-backend`**
3. **Settings** → **Environment Variables**
4. Vérifiez que ces variables existent :
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=votre-secret-jwt
   NODE_ENV=production
   ```

#### Frontend Vercel :
1. Projet **`football-booking-frontend`**
2. **Settings** → **Environment Variables**
3. Vérifiez :
   ```
   VITE_API_URL=https://football-booking-backend.vercel.app
   ```

---

### 3️⃣ **Vérifier les Logs Vercel**

#### Backend :
1. Dashboard Vercel → Projet Backend
2. **Deployments** → Dernier déploiement
3. **View Function Logs**
4. Cherchez des erreurs (MongoDB connection, CORS, etc.)

#### Frontend :
1. Sur votre mobile, ouvrez la **Console** :
   - Safari iOS : Réglages → Safari → Avancé → Web Inspector
   - Chrome Android : Menu → Plus d'outils → Outils développeur
2. Regardez les **erreurs réseau** (Network tab)
3. Essayez de vous connecter et regardez les erreurs

---

## 🔧 **SOLUTIONS POSSIBLES**

### Solution 1 : Backend pas déployé
Si le backend montre une erreur ou n'est pas accessible :

```bash
cd backend
vercel --prod
```

### Solution 2 : MONGODB_URI incorrecte
Le backend Vercel doit utiliser la **même** base de données que votre local.

Vérifiez dans Vercel Settings → Environment Variables.

### Solution 3 : CORS bloqué
Vérifiez dans `backend/src/server.js` que le CORS autorise votre domaine Vercel :

```javascript
app.use(cors({
  origin: [
    'https://football-booking-platform-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5175'
  ],
  credentials: true
}));
```

### Solution 4 : Route manquante
Si vous voyez "Cannot POST /api/auth/login", les routes ne sont pas correctement enregistrées.

---

## 🚨 **DIAGNOSTIC RAPIDE**

### Testez cette URL sur votre mobile :
```
https://football-booking-backend.vercel.app/api/health
```

**Si vous voyez** :
- ✅ `{"status":"OK"}` → Backend fonctionne, problème CORS ou frontend
- ❌ Erreur 404 → Backend pas déployé correctement
- ❌ Erreur 500 → Backend crash (problème MongoDB)
- ❌ Timeout → Backend ne démarre pas

---

## 📱 **TEST IMMÉDIAT**

1. **Ouvrez Safari sur votre mobile**
2. **Tapez** : `https://football-booking-backend.vercel.app/api/health`
3. **Prenez une capture** du résultat
4. **Envoyez-moi** la capture

Cela me dira exactement où est le problème ! 🎯

---

## 💡 **EN ATTENDANT**

Vous pouvez tester en **local** :
- Assurez-vous que backend et frontend tournent
- Connectez-vous sur `http://localhost:5175`
- Ça devrait marcher parfaitement !

**Testez l'URL du backend et dites-moi ce que vous voyez ! 🔍**

