# 🔧 Troubleshooting Déploiement Vercel

## ⚠️ Problème : Pas de changements visibles sur le site

### ✅ Solutions par ordre de priorité

---

## 1️⃣ **Vider le cache du navigateur**

Le navigateur peut avoir mis en cache l'ancienne version.

### 🔄 Windows (Chrome/Edge) :
```
Ctrl + Shift + R     (Hard Refresh)
ou
Ctrl + F5
```

### 🔄 Mac (Chrome/Safari) :
```
Cmd + Shift + R
```

### 🔄 Vider complètement le cache :
1. Ouvrez les **DevTools** (F12)
2. Clic droit sur le bouton **Actualiser** 🔄
3. Sélectionnez **"Vider le cache et actualiser de force"**

---

## 2️⃣ **Vérifier le déploiement Vercel**

### Frontend
1. Allez sur : https://vercel.com/dashboard
2. Projet : `football-booking-frontend`
3. Vérifiez que le dernier déploiement :
   - ✅ **Status** : Ready (vert)
   - ✅ **Commit** : `ca740d8` (dernier commit)
   - ✅ **Branch** : main

### Backend
1. Projet : `football-booking-backend`
2. Vérifiez que le dernier déploiement :
   - ✅ **Status** : Ready (vert)
   - ✅ **Commit** : `ca740d8`
   - ✅ **Branch** : main

### ⚠️ Si le backend n'est PAS déployé :
Le backend doit avoir un `vercel.json` dans le dossier `backend/` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/server.js"
    }
  ]
}
```

---

## 3️⃣ **Redéployer manuellement**

Si le déploiement automatique n'a pas fonctionné :

### Option A : Via Vercel Dashboard
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Onglet **"Deployments"**
4. Trouvez le dernier commit `ca740d8`
5. Cliquez sur **"..."** → **"Redeploy"**
6. Confirmez

### Option B : Via terminal
```bash
# Frontend
cd frontend
vercel --prod

# Backend
cd ../backend
vercel --prod
```

---

## 4️⃣ **Vérifier les nouvelles routes**

Testez que les nouvelles routes API fonctionnent :

```bash
# Messages
curl https://football-booking-backend.vercel.app/api/messages/conversations

# Notifications
curl https://football-booking-backend.vercel.app/api/notifications

# Compteur messages
curl https://football-booking-backend.vercel.app/api/messages/unread-count
```

Si ces routes retournent **404**, le backend n'est pas à jour.

---

## 5️⃣ **Vérifier les logs Vercel**

1. Dashboard Vercel → Projet → Onglet **"Functions"**
2. Cliquez sur une fonction
3. Vérifiez les **logs en temps réel**
4. Cherchez des erreurs éventuelles

---

## 6️⃣ **Mode Navigation Privée**

Testez dans une **fenêtre de navigation privée** pour éliminer tout cache :

```
Ctrl + Shift + N  (Chrome/Edge)
Ctrl + Shift + P  (Firefox)
```

---

## 🔍 **Checklist de Diagnostic**

- [ ] Cache navigateur vidé (Ctrl+Shift+R)
- [ ] Frontend déployé (Status: Ready)
- [ ] Backend déployé (Status: Ready)
- [ ] Dernier commit visible (`ca740d8`)
- [ ] Routes API accessibles
- [ ] Variables d'environnement configurées
- [ ] Navigation privée testée

---

## 💡 **Actions Immédiates**

### 🚀 Solution Rapide :
1. **Ctrl + Shift + R** sur votre site en production
2. Attendez **30 secondes**
3. Vérifiez si les changements apparaissent

### 🔧 Si ça ne marche pas :
1. Vérifiez que **backend ET frontend** sont déployés sur Vercel
2. Testez les **routes API** manuellement
3. Regardez les **logs Vercel** pour erreurs
4. Redéployez manuellement si nécessaire

---

## ✅ **Après déploiement réussi**

Vous devriez voir :
- ✅ Badge compteur sur Messages
- ✅ Menu "Créer" avec dropdown (Client)
- ✅ Bouton "Répondre" dans notifications
- ✅ Filtres de période (Propriétaire)
- ✅ Actions rapides dans notifications
- ✅ Sons de notification (après permission)

---

**Essayez d'abord : Ctrl + Shift + R sur votre site !** 🔄

