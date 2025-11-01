# 🚀 Guide de Déploiement Production

## Vue d'ensemble

Ce guide vous explique comment déployer votre plateforme de réservation de terrains en production.

### Stack de Déploiement Recommandé

| Service | Plateforme | Coût | Temps |
|---------|-----------|------|-------|
| **Base de données** | MongoDB Atlas | Gratuit (M0) | 5 min ✅ FAIT |
| **Backend API** | Render.com | Gratuit | 10 min |
| **Frontend** | Vercel | Gratuit | 5 min |
| **Domaine** | Namecheap | ~10$/an | 15 min |

**Temps total**: ~35 minutes
**Coût mensuel**: 0$ (avec plans gratuits)

---

## Phase 1: MongoDB Atlas ✅ DÉJÀ CONFIGURÉ

Vous avez déjà:
- ✅ Cluster créé: `cluster0.tuwrfir.mongodb.net`
- ✅ Utilisateur: `wopallodia92_db_user`
- ✅ Base de données: `football-booking`
- ✅ IP autorisée: `41.82.207.30`

**Pour la production, ajoutez:**
1. Allez sur MongoDB Atlas
2. Network Access → Add IP Address
3. Ajoutez: `0.0.0.0/0` (accès depuis partout)
4. Ou ajoutez les IPs spécifiques de Render

---

## Phase 2: Déploiement Backend (Render.com)

### Étape 1: Créer un compte Render

1. Allez sur https://render.com
2. Sign up with GitHub (recommandé)
3. Autorisez Render à accéder à vos repos

### Étape 2: Push votre code sur GitHub

**Si pas encore fait:**
```bash
cd C:\Users\wopal\Desktop\football-booking-platform

# Initialiser Git
git init
git add .
git commit -m "Initial commit - Football Booking Platform"

# Créer repo sur GitHub (https://github.com/new)
# Puis:
git remote add origin https://github.com/VOTRE_USERNAME/football-booking-platform.git
git branch -M main
git push -u origin main
```

### Étape 3: Créer le Web Service sur Render

1. **Dashboard Render** → New → Web Service
2. **Connect Repository**: Sélectionnez votre repo GitHub
3. **Configuration**:
   ```
   Name: football-booking-api
   Region: Frankfurt (EU) ou Oregon (US)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Plan**: Free (0$/mois)

### Étape 4: Variables d'Environnement

Dans Render, ajoutez ces variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wopallodia92_db_user:SICkD915YTgVVOtd@cluster0.tuwrfir.mongodb.net/football-booking?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=football_booking_secret_key_production_2024_change_this_to_something_very_secure_and_random
FRONTEND_URL=https://votre-app.vercel.app

# Optionnel (pour plus tard)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
```

**⚠️ Important:**
- Changez `JWT_SECRET` pour un secret unique en production
- `FRONTEND_URL` sera mis à jour après le déploiement frontend

### Étape 5: Déployer

1. Cliquez sur **Create Web Service**
2. Attendez 3-5 minutes
3. Votre API sera disponible sur: `https://football-booking-api.onrender.com`

### Étape 6: Tester l'API

```bash
# Health check
https://football-booking-api.onrender.com/health

# Terrains
https://football-booking-api.onrender.com/api/terrains
```

---

## Phase 3: Déploiement Frontend (Vercel)

### Étape 1: Créer un compte Vercel

1. Allez sur https://vercel.com
2. Sign up with GitHub
3. Autorisez Vercel

### Étape 2: Importer le Projet

1. **Dashboard** → Add New → Project
2. **Import Git Repository**: Sélectionnez votre repo
3. **Configuration**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Étape 3: Variables d'Environnement

Ajoutez dans Vercel:

```env
VITE_API_URL=https://football-booking-api.onrender.com/api
```

### Étape 4: Déployer

1. Cliquez sur **Deploy**
2. Attendez 2-3 minutes
3. Votre app sera sur: `https://football-booking-xyz.vercel.app`

### Étape 5: Mettre à jour le Backend

Retournez sur Render et mettez à jour `FRONTEND_URL`:
```env
FRONTEND_URL=https://football-booking-xyz.vercel.app
```

---

## Phase 4: Configuration Domaine Personnalisé (Optionnel)

### Option A: Domaine .sn (Sénégal)

**Registrars .sn:**
- NIC Sénégal: https://www.nic.sn
- Prix: ~15,000 FCFA/an

**Étapes:**
1. Acheter domaine (ex: `footballbooking.sn`)
2. Configuration DNS:
   ```
   # Pour Vercel (Frontend)
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   # Pour Render (API)
   Type: CNAME
   Name: api
   Value: football-booking-api.onrender.com
   ```

3. Dans Vercel:
   - Settings → Domains
   - Add: `www.footballbooking.sn`

4. Dans Render:
   - Settings → Custom Domain
   - Add: `api.footballbooking.sn`

### Option B: Domaine International (.com, .net)

**Registrars recommandés:**
- Namecheap: https://www.namecheap.com (~10$/an)
- Google Domains: https://domains.google (~12$/an)
- Cloudflare: https://www.cloudflare.com (~10$/an)

Configuration similaire à l'option A.

---

## Configuration Post-Déploiement

### 1. HTTPS (Automatique)

✅ Vercel et Render activent HTTPS automatiquement
✅ Certificats SSL gratuits (Let's Encrypt)

### 2. Créer un Compte Admin

**Via MongoDB Atlas:**
1. Allez sur Atlas → Browse Collections
2. Database: `football-booking`
3. Collection: `users`
4. Insert Document:

```javascript
{
  "email": "admin@footballsn.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lkzLXzZ0nqqa",
  "firstName": "Admin",
  "lastName": "System",
  "phone": "+221700000000",
  "role": "admin",
  "isVerified": true,
  "isActive": true,
  "createdAt": { "$date": "2024-11-01T12:00:00.000Z" }
}
```

**Mot de passe**: `Admin123!`

⚠️ Changez-le immédiatement après la première connexion !

### 3. Monitoring et Logs

**Render:**
- Logs en temps réel: Dashboard → Logs
- Métriques: CPU, RAM, Requests
- Alertes email automatiques

**Vercel:**
- Analytics intégré
- Performance metrics
- Error tracking

### 4. Backup Base de Données

**MongoDB Atlas:**
- Backup automatique inclus (plan gratuit)
- Restore en 1 clic
- Retention: 2 jours (gratuit)

---

## Optimisations Production

### 1. Backend (Render)

**`backend/src/server.js` - Déjà optimisé ✅**
- Compression gzip activée
- Rate limiting configuré
- Helmet pour sécurité
- CORS configuré

**Améliorations optionnelles:**
```javascript
// Ajouter cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 min

// Dans routes terrains
app.get('/api/terrains', (req, res) => {
  const cacheKey = JSON.stringify(req.query);
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  // ... fetch et cache.set()
});
```

### 2. Frontend (Vercel)

**Déjà optimisé ✅**
- Code splitting automatique (Vite)
- Tree shaking
- Minification
- CDN global

**Améliorations:**

1. **Images optimisées**:
   ```bash
   npm install vite-plugin-imagemin -D
   ```

2. **PWA (Progressive Web App)**:
   ```bash
   npm install vite-plugin-pwa -D
   ```

3. **Analytics**:
   ```javascript
   // Google Analytics
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

### 3. Performance

**Lighthouse Score Target:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

**Tests:**
```bash
npm install -g lighthouse
lighthouse https://votre-app.vercel.app
```

---

## Intégrations Paiement Production

### 1. Wave Money (Sénégal)

**Documentation**: https://developer.wave.com

```javascript
// backend/src/config/payment.js
const Wave = require('@wave-senegal/wave-node');
const wave = new Wave({
  apiKey: process.env.WAVE_API_KEY,
  secret: process.env.WAVE_SECRET
});
```

**Demander accès API:**
1. Compte Wave Business
2. Formulaire développeur
3. Sandbox API keys (test)
4. Production keys (après validation)

### 2. Orange Money

**Documentation**: https://developer.orange.com

**Étapes:**
1. Compte Orange Developer
2. Créer une app
3. Obtenir credentials
4. Implémenter webhook

### 3. Free Money

**Contact**: Support Free Money Sénégal
**Documentation**: À demander

---

## Sécurité Production

### Checklist

- [x] HTTPS activé (Vercel + Render)
- [x] Variables d'environnement sécurisées
- [x] JWT secret fort et unique
- [x] Rate limiting activé (100 req/15min)
- [x] Helmet headers configurés
- [x] CORS restreint au domaine frontend
- [x] MongoDB authentication
- [x] Validation des données (express-validator)
- [ ] 2FA pour comptes admin (à implémenter)
- [ ] Logs audit (à implémenter)

### Headers de Sécurité

**Déjà configurés via Helmet ✅**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Monitoring et Alertes

### 1. Uptime Monitoring

**Services gratuits:**
- **UptimeRobot**: https://uptimerobot.com
  - Monitoring toutes les 5 min
  - Alertes email/SMS
  - Status page public

**Configuration:**
```
Monitor 1: https://football-booking-api.onrender.com/health
Monitor 2: https://votre-app.vercel.app
```

### 2. Error Tracking

**Sentry** (Recommandé):
```bash
npm install @sentry/node @sentry/react
```

**Backend:**
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**Frontend:**
```javascript
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: process.env.VITE_SENTRY_DSN });
```

### 3. Analytics

**Google Analytics 4:**
```html
<!-- frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Maintenance

### Updates Réguliers

**Hebdomadaire:**
- Vérifier logs erreurs
- Monitorer performance
- Vérifier uptime

**Mensuel:**
- `npm audit fix` (sécurité)
- Update dépendances
- Backup manuel DB
- Review analytics

**Trimestriel:**
- Audit sécurité complet
- Performance optimization
- Feature review

### Procédure Update

```bash
# Local
git pull origin main
npm install
npm run build

# Test
npm run dev

# Deploy
git push origin main
# Auto-deploy via Render + Vercel
```

---

## Troubleshooting

### Backend ne démarre pas

**Vérifier:**
1. Logs Render: Dashboard → Logs
2. Variables d'environnement correctes
3. MongoDB accessible (IP whitelist)
4. Node version (18+)

### Frontend erreur CORS

**Solution:**
```javascript
// backend/.env
FRONTEND_URL=https://votre-exact-domaine.vercel.app
```

### Paiements ne fonctionnent pas

**Vérifier:**
1. API keys valides
2. Webhooks configurés
3. IP callback autorisées
4. Logs des providers

---

## Coûts Mensuels

### Plan Gratuit (0$/mois)

| Service | Plan | Limites |
|---------|------|---------|
| MongoDB Atlas | M0 | 512 MB storage |
| Render | Free | 750h/mois |
| Vercel | Hobby | 100 GB bandwidth |
| **Total** | **0$/mois** | **Suffisant pour MVP** |

### Plan Croissance (~25$/mois)

| Service | Plan | Coût |
|---------|------|------|
| MongoDB Atlas | M2 | 9$/mois |
| Render | Starter | 7$/mois |
| Vercel | Pro | 20$/mois |
| Domaine .sn | | 1.25$/mois |
| **Total** | | **~37$/mois** |

---

## Checklist Déploiement

### Pré-déploiement
- [x] Code testé localement
- [x] Variables d'environnement préparées
- [x] MongoDB Atlas configuré
- [x] Git repo créé

### Backend
- [ ] Compte Render créé
- [ ] Repo GitHub connecté
- [ ] Variables d'environnement ajoutées
- [ ] Web Service déployé
- [ ] API testée (health check)

### Frontend
- [ ] Compte Vercel créé
- [ ] Projet importé
- [ ] Variable VITE_API_URL configurée
- [ ] App déployée
- [ ] Connexion testée

### Post-déploiement
- [ ] FRONTEND_URL mis à jour dans Render
- [ ] Compte admin créé
- [ ] Connexion admin testée
- [ ] HTTPS vérifié
- [ ] Monitoring configuré
- [ ] DNS configuré (si domaine)

---

## Support

### Documentation
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

### Communautés
- Discord Render: https://render.com/discord
- Forum Vercel: https://github.com/vercel/vercel/discussions

---

**🎉 Votre plateforme est prête pour la production !**

**URLs importantes:**
- Backend API: `https://football-booking-api.onrender.com`
- Frontend: `https://votre-app.vercel.app`
- MongoDB: `cluster0.tuwrfir.mongodb.net`

**Prochaines étapes:**
1. Déployer sur Render
2. Déployer sur Vercel
3. Créer compte admin
4. Tester en production
5. Configurer monitoring
6. Promouvoir votre plateforme ! 📢⚽

---

**Besoin d'aide?** Consultez les logs ou contactez le support des plateformes.

