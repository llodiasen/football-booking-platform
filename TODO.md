# 📋 TODO - Fonctionnalités à Implémenter

> **Dernière mise à jour :** 3 Novembre 2024  
> **Statut global :** En cours de développement

---

## ✅ TERMINÉ

### Phase 0 : Base du Projet
- [x] Backend API (Node.js/Express/MongoDB)
- [x] Frontend (React/Vite/Tailwind)
- [x] Authentification (JWT)
- [x] Dashboard Propriétaire
- [x] Gestion des terrains (CRUD)
- [x] Système de réservation de base
- [x] Recherche et filtres
- [x] Carte interactive (Leaflet)
- [x] 28 terrains importés
- [x] Règles de réservation (acompte, consignes)

---

## 🔥 EN COURS

### Étape 2 : Prix & Réductions (✅ TERMINÉ - À TESTER)
- [x] **Prix Variables par Jour**
  - [x] Backend : Modèle `pricing` avec weekday/weekend/timeSlots
  - [x] Backend : Calculateur de prix (`priceCalculator.js`)
  - [x] Frontend : Composant `PricingEditor.jsx`
  - [x] Frontend : Interface configuration complète
  
- [x] **Système de Réductions**
  - [x] Backend : Modèle `discounts` (4 types)
  - [x] Backend : Fonction `applyDiscounts()`
  - [x] Frontend : Composant `DiscountsEditor.jsx`
  - [x] Frontend : Gestion activation/désactivation

- [x] **Affichage Numéro Propriétaire**
  - [x] Backend : Route `/reveal-contact`
  - [x] Backend : Champs tracking dans Reservation
  - [x] Frontend : Composant `OwnerContact.jsx`
  - [x] Frontend : Boutons "Appeler" et "Email"

**📝 Documentation créée :**
- [x] `ETAPE2_PRIX_REDUCTIONS_COMPLETE.md` (500+ lignes)
- [x] `GUIDE_TEST_ETAPE2.md` (Guide de test détaillé)

---

## ⏳ À FAIRE

### Étape 3 : Upload Photos (PRIORITÉ HAUTE)
**Temps estimé :** 2 jours

- [ ] **Configuration Cloudinary**
  - [ ] Créer compte Cloudinary
  - [ ] Configurer dans `.env`
  - [ ] Installer packages (`cloudinary`, `multer`)

- [ ] **Backend**
  - [ ] Middleware upload
  - [ ] Route POST `/api/terrains/:id/images`
  - [ ] Route DELETE `/api/terrains/:id/images/:imageId`
  - [ ] Route PUT `/api/terrains/:id/images/:imageId/main`

- [ ] **Frontend**
  - [ ] Composant `ImageUploader.jsx`
  - [ ] Composant `ImageGallery.jsx`
  - [ ] Upload depuis appareil (file)
  - [ ] Upload par URL
  - [ ] Drag & drop
  - [ ] Prévisualisation
  - [ ] Réorganiser images
  - [ ] Définir image principale

**Résultat attendu :**
```
✅ Upload multiple images
✅ Galerie photos professionnelle
✅ Images optimisées (Cloudinary CDN)
```

---

### Étape 4 : Vérification KYC (PRIORITÉ HAUTE)
**Temps estimé :** 2 jours

- [ ] **Backend**
  - [ ] Modèle KYC dans `ownerProfile`
  - [ ] Route upload documents
  - [ ] Notification système (email J+1, J+5, J+7)
  - [ ] Route admin pour approuver/rejeter
  - [ ] Cron job vérification deadline

- [ ] **Frontend - Propriétaire**
  - [ ] Page "Vérifier mon compte"
  - [ ] Upload CNI recto/verso
  - [ ] Upload justificatif domicile
  - [ ] Upload photo terrain
  - [ ] Badge "Compte vérifié" sur dashboard
  - [ ] Notification persistante si non vérifié

- [ ] **Frontend - Admin**
  - [ ] Dashboard admin
  - [ ] Liste des demandes de vérification
  - [ ] Visualisation documents
  - [ ] Boutons Approuver/Rejeter
  - [ ] Historique vérifications

**Résultat attendu :**
```
✅ Système KYC complet
✅ Notifications automatiques
✅ Badge "Vérifié" visible
✅ Deadline 7 jours respectée
```

---

### Étape 5 : Chat Direct (PRIORITÉ MOYENNE)
**Temps estimé :** 3 jours

**Technologies possibles :**
- Option A : Socket.io (temps réel)
- Option B : Firebase Firestore (simple)
- Option C : Service tiers (Stream Chat)

**À faire :**
- [ ] Choisir technologie
- [ ] Backend : Modèle `Message` et `Conversation`
- [ ] Backend : API messages
- [ ] Backend : Socket.io ou Firebase config
- [ ] Frontend : Widget chat
- [ ] Frontend : Liste conversations
- [ ] Frontend : Notifications temps réel
- [ ] Frontend : Badge nombre messages non lus
- [ ] Frontend : Indicateur "en train d'écrire..."

**Règles métier :**
```
✅ Chat disponible UNIQUEMENT après réservation validée
✅ Conversation liée à une réservation spécifique
✅ Historique persistant
✅ Notifications email si message non lu > 24h
```

---

### Étape 6 : Authentification Avancée (PRIORITÉ BASSE)
**Temps estimé :** 3-4 jours

#### 6A. Connexion avec Google
- [ ] Configuration Google Cloud Console
- [ ] Obtenir Client ID et Secret
- [ ] Backend : Passport.js + Google Strategy
- [ ] Backend : Route `/api/auth/google`
- [ ] Backend : Route callback `/api/auth/google/callback`
- [ ] Frontend : Bouton "Continuer avec Google"
- [ ] Frontend : Gestion du token retourné

#### 6B. Connexion par SMS (Twilio)
- [ ] Configuration Twilio
- [ ] Acheter numéro +221
- [ ] Backend : Route `/api/auth/sms/send`
- [ ] Backend : Route `/api/auth/sms/verify`
- [ ] Backend : Génération code OTP
- [ ] Frontend : Formulaire numéro téléphone
- [ ] Frontend : Formulaire code OTP
- [ ] Frontend : Timer countdown (5 min)

**Coûts :**
```
Google OAuth : GRATUIT ✅
Twilio SMS  : ~0.05$/SMS (~50$/mois pour 1000 SMS)
```

---

## 🎯 FONCTIONNALITÉS BONUS (À DÉCIDER)

### 📊 Statistiques Avancées
- [ ] Graphiques revenus (Chart.js)
- [ ] Taux d'occupation par terrain
- [ ] Heures les plus réservées
- [ ] Rapport mensuel PDF

### 📧 Emails Automatiques
- [ ] Email confirmation réservation
- [ ] Email rappel 24h avant
- [ ] Email remerciement après
- [ ] Newsletter mensuelle

### 🔔 Notifications Push
- [ ] Service Worker
- [ ] Notifications navigateur
- [ ] Notifications app mobile

### 🌍 Multilingue
- [ ] Français ✅ (défaut)
- [ ] Wolof
- [ ] Anglais
- [ ] Bibliothèque i18n

### 💳 Paiements Avancés
- [ ] Wave API
- [ ] Orange Money API
- [ ] Free Money API
- [ ] Paiement par carte (Stripe)

---

## 📅 PLANNING

### Semaine 1 (En cours)
```
Lundi-Mardi    : Prix Variables
Mercredi       : Système Réductions
Jeudi matin    : Affichage Numéro
Jeudi PM       : Tests
Vendredi       : Documentation
```

### Semaine 2
```
Lundi-Mercredi : Upload Photos (Cloudinary)
Jeudi-Vendredi : Vérification KYC
```

### Semaine 3
```
Lundi-Mercredi : Chat Direct
Jeudi-Vendredi : Tests & Debugging
```

### Semaine 4 (Optionnel)
```
Lundi-Mardi    : Auth Google
Mercredi-Jeudi : Auth SMS
Vendredi       : Tests finaux
```

---

## 💰 BUDGET REQUIS

| Service | Coût Mensuel | Statut |
|---------|--------------|--------|
| **MongoDB Atlas** | GRATUIT (512MB) | ✅ Actif |
| **Cloudinary** | GRATUIT (10GB, 25k transformations) | ⏳ À configurer |
| **Firebase** | GRATUIT (50K lectures/jour) | ⏳ Optionnel |
| **Google OAuth** | GRATUIT | ⏳ Optionnel |
| **Twilio SMS** | ~50$/mois (1000 SMS) | ⏳ Optionnel |
| **Hosting Frontend** | ~10$/mois (Vercel Pro) | ⏳ Plus tard |
| **Hosting Backend** | ~7$/mois (Railway/Render) | ⏳ Plus tard |

**TOTAL ACTUEL : 0 FCFA** ✅  
**TOTAL AVEC SMS : ~57$/mois** (~34,200 FCFA)

---

## 🎯 OBJECTIFS

### Court Terme (2 semaines)
- ✅ Prix Variables + Réductions
- ✅ Upload Photos professionnel
- ✅ Vérification KYC

### Moyen Terme (1 mois)
- ✅ Chat Direct
- ✅ Auth Google
- ✅ 100+ terrains dans la base

### Long Terme (3 mois)
- ✅ 1000+ utilisateurs
- ✅ 500+ réservations/mois
- ✅ App mobile (React Native)
- ✅ Expansion vers autres sports

---

## 📝 NOTES IMPORTANTES

### Sécurité
- [ ] Validation fichiers uploadés (type, taille)
- [ ] Rate limiting sur upload
- [ ] Scan antivirus fichiers (optionnel)
- [ ] Watermark automatique sur photos

### Performance
- [ ] Cache Redis (optionnel)
- [ ] CDN Cloudflare (gratuit)
- [ ] Compression images automatique
- [ ] Lazy loading images

### SEO
- [ ] Meta tags dynamiques
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Schema.org markup

---

## 🐛 BUGS CONNUS

### À Corriger
- [ ] Erreur géolocalisation `$geoNear` (en cours)
- [ ] Backend redémarre trop souvent (nodemon)
- [ ] Port 5000 parfois occupé

### Corrections Appliquées
- [x] CORS bloquait frontend (corrigé)
- [x] Durée minimum fixée à 1h
- [x] Consignes pré-remplies avec "15min avant"

---

## 📞 CONTACTS UTILES

- **Support MongoDB :** https://cloud.mongodb.com
- **Cloudinary Docs :** https://cloudinary.com/documentation
- **Twilio Console :** https://console.twilio.com
- **Google Cloud :** https://console.cloud.google.com

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

### Backend
- [ ] Variables d'environnement en production
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Base de données backupée
- [ ] Tests API complets

### Frontend
- [ ] Build production testé
- [ ] Images optimisées
- [ ] Analytics configuré
- [ ] Erreurs 404 gérées
- [ ] SEO vérifié

### Général
- [ ] Domaine acheté
- [ ] SSL/HTTPS configuré
- [ ] CGU & Mentions légales
- [ ] RGPD compliance
- [ ] Contact support opérationnel

---

**📌 RAPPEL :** Ce fichier est un aide-mémoire. Mettez-le à jour régulièrement !

**🚀 NEXT STEP :** Étape 2 - Prix Variables + Réductions (EN COURS)

