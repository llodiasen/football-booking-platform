# 🔍 Guide de Debug - Console Chrome/Edge

## 🎯 Objectif

Capturer les logs de connexion pour identifier pourquoi le système déconnecte.

---

## 📋 Étape par Étape

### 1️⃣ Ouvrir la Console

1. Allez sur **http://localhost:5174/**
2. Appuyez sur **F12** (ou Ctrl+Shift+I)
3. Cliquez sur l'onglet **"Console"**

---

### 2️⃣ Activer "Preserve log" (IMPORTANT !)

**Sans cette option, les logs disparaissent lors des redirections !**

#### Option A : Via les paramètres
1. Dans la Console, cherchez l'icône **⚙️ (roue dentée)** en haut à droite
2. Cliquez dessus
3. ✅ **Cochez "Preserve log"** (ou "Conserver les journaux" en français)

#### Option B : Via le clic droit
1. **Clic droit** dans la zone de logs de la Console
2. Dans le menu contextuel, cherchez **"Preserve log"**
3. ✅ **Cochez-le**

#### Option C : Via les paramètres DevTools
1. Cliquez sur les **3 points verticaux** (⋮) en haut à droite de DevTools
2. Allez dans **Settings** (Paramètres)
3. Dans **Console**, ✅ **cochez "Preserve log"**

---

### 3️⃣ Vider la Console (optionnel mais recommandé)

1. Clic droit dans la Console
2. Cliquez sur **"Clear console"** (ou icône 🚫)
3. OU tapez : `console.clear()`

---

### 4️⃣ Se connecter et capturer les logs

1. **Rechargez la page** (Ctrl+R ou F5)
2. **Connectez-vous** :
   ```
   📧 Email: fc-medina@221football.sn
   🔑 Password: password123
   ```
3. Les logs vont s'afficher dans la Console

---

## 🔍 Logs à chercher

Vous devriez voir des logs avec des **émojis** :

### ✅ Si tout fonctionne :
```
🔐 login: Tentative de connexion avec: fc-medina@221football.sn
✅ login: Connexion réussie !
👤 User: { ... }
🔑 Token: eyJhbGc...
🎭 Role: team
🎭 Roles: ['team', 'team-captain']
🎯 Primary: team
💾 Token sauvegardé dans localStorage
🔍 loadUser: Tentative de chargement du profil...
🔑 Token présent: true
✅ loadUser: Profil chargé avec succès: { ... }
```

### ❌ Si ça échoue :
```
🔐 login: Tentative de connexion avec: fc-medina@221football.sn
✅ login: Connexion réussie !
💾 Token sauvegardé dans localStorage
🔍 loadUser: Tentative de chargement du profil...
🔑 Token présent: true
❌ Error loading user: [détails de l'erreur]
❌ Error response: { message: "..." }
❌ Error status: 401 (ou 404, 500)
🚪 Déconnexion forcée...
```

---

## 📋 Filtrer les logs

Si vous avez beaucoup de logs :

1. Dans la Console, cherchez la **barre de filtre** (🔍)
2. Tapez : `login` ou `loadUser` ou `Error`
3. Seuls les logs contenant ces mots s'afficheront

---

## 📸 Capturer les logs

### Méthode 1 : Screenshot
1. **Win + Shift + S** (Windows)
2. **Cmd + Shift + 4** (Mac)
3. Capturez toute la zone de la Console
4. Collez avec **Ctrl+V** dans un chat ou un document

### Méthode 2 : Copier le texte
1. **Cliquez sur un log** dans la Console
2. **Ctrl+A** (tout sélectionner)
3. **Ctrl+C** (copier)
4. **Ctrl+V** (coller)

### Méthode 3 : Sauvegarder les logs
1. Clic droit dans la Console
2. Cliquez sur **"Save as..."** (Enregistrer sous)
3. Sauvegardez le fichier `.log`

---

## 🔍 Vérifier le Network (onglet Réseau)

1. Allez dans l'onglet **"Network"** (Réseau)
2. ✅ **Cochez "Preserve log"** ici aussi !
3. Rechargez et connectez-vous
4. Cherchez la requête : **GET /api/auth/me**
5. Cliquez dessus
6. Regardez :
   - **Status** : 200 ✅ ou 401/404 ❌
   - **Response** (onglet Response) : Le contenu de la réponse
   - **Headers** (onglet Headers) : Vérifiez que `Authorization: Bearer ...` est présent

---

## 💾 Vérifier le localStorage

Dans la **Console**, tapez :

```javascript
localStorage.getItem('token')
```

**Résultat attendu** :
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGU1MW..."
```

**Si vous obtenez `null`** :
- Le token n'a pas été sauvegardé
- Ou il a été supprimé lors du logout

---

## 🚨 Erreurs courantes

### Erreur 401 Unauthorized
```
❌ Error status: 401
```
- Le token est invalide ou expiré
- L'utilisateur n'existe pas
- Le mot de passe est incorrect

### Erreur 404 Not Found
```
❌ Error status: 404
```
- L'endpoint `/api/auth/me` n'existe pas
- Le backend n'est pas démarré
- Mauvaise URL d'API

### Erreur CORS
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/me' from origin 
'http://localhost:5174' has been blocked by CORS policy
```
- Le backend n'autorise pas les requêtes depuis le port 5174
- Vérifier la configuration CORS dans le backend

### Token null
```
localStorage.getItem('token') → null
```
- Le token n'a pas été sauvegardé après le login
- Vérifier que la ligne `localStorage.setItem('token', token)` est bien exécutée

---

## ✅ Checklist de debug

- [ ] Console ouverte (F12)
- [ ] "Preserve log" activé dans Console
- [ ] "Preserve log" activé dans Network
- [ ] Page rechargée (Ctrl+R)
- [ ] Connexion testée avec `fc-medina@221football.sn` / `password123`
- [ ] Logs capturés (screenshot ou copie)
- [ ] Requête GET /api/auth/me vérifiée dans Network
- [ ] Token vérifié dans localStorage

---

## 📤 Envoyer les informations

Une fois les logs capturés, envoyez :

1. **Screenshot de la Console** avec tous les logs visibles
2. **Status de GET /api/auth/me** (200, 401, 404, etc.)
3. **Résultat de `localStorage.getItem('token')`**
4. **Message d'erreur exact** si présent

---

**Avec ces informations, nous pourrons identifier précisément le problème ! 🎯**

