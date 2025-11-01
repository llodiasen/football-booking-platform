# 🚀 Guide de Démarrage Rapide

## Installation et lancement en 5 minutes

### 1. Installer les dépendances

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### 2. Configuration

**Backend** - Vérifier `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/football-booking
JWT_SECRET=football_booking_secret_key_development_2024_minimum_32_characters_required
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Vérifier `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Lancer MongoDB

**Option A - MongoDB Local:**
```bash
mongod
```

**Option B - MongoDB Atlas (Recommandé):**
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Mettre à jour `MONGODB_URI` dans `backend/.env`

### 4. Démarrer les serveurs

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:5173

## 🎮 Tester l'application

### 1. S'inscrire
- Aller sur http://localhost:5173/register
- Créer un compte (client, owner, ou team)

### 2. Se connecter
- Email: votre email
- Password: votre mot de passe

### 3. Explorer
- **Client**: Rechercher des terrains, faire des réservations
- **Owner**: Créer des terrains (nécessite approbation admin)
- **Team**: Créer une équipe, inviter des membres

## 👨‍💼 Créer un compte admin (via MongoDB)

```javascript
// Dans MongoDB Compass ou mongo shell
db.users.insertOne({
  email: "admin@footballsn.com",
  // Hash de "Admin123!" - à générer avec bcrypt
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lkzLXzZ0nqqa",
  firstName: "Admin",
  lastName: "System",
  phone: "+221700000000",
  role: "admin",
  isVerified: true,
  isActive: true,
  createdAt: new Date()
})
```

Ou utiliser le script:
```bash
cd backend
node scripts/createAdmin.js  # À créer si besoin
```

## 📱 Pages disponibles

| URL | Description | Accès |
|-----|-------------|-------|
| `/` | Accueil | Public |
| `/terrains` | Liste des terrains | Public |
| `/terrains/:id` | Détail terrain | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/dashboard` | Dashboard | Protégé |
| `/profile` | Profil | Protégé |
| `/reservations` | Mes réservations | Protégé |
| `/booking/:id` | Réserver | Protégé |
| `/terrains/new` | Créer terrain | Owner/Admin |
| `/teams` | Équipes | Public |

## 🔧 Problèmes courants

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### MongoDB connexion error
- Vérifier que MongoDB est lancé
- Vérifier `MONGODB_URI` dans `.env`
- Tester la connexion: `mongosh` (ou `mongo`)

### CORS error
- Vérifier `FRONTEND_URL` dans `backend/.env`
- Redémarrer le backend

### Module not found
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## 📊 API Endpoints principaux

```
POST   /api/auth/register      - Inscription
POST   /api/auth/login         - Connexion
GET    /api/auth/me            - Profil (auth)

GET    /api/terrains           - Liste terrains
GET    /api/terrains/:id       - Détail terrain
POST   /api/terrains           - Créer terrain (owner/admin)
GET    /api/terrains/:id/availability - Disponibilités

GET    /api/reservations       - Mes réservations (auth)
POST   /api/reservations       - Créer réservation (auth)
PUT    /api/reservations/:id/cancel - Annuler (auth)

POST   /api/payments/initiate  - Initier paiement (auth)
GET    /api/payments/verify/:id - Vérifier paiement (auth)

GET    /api/teams              - Liste équipes
POST   /api/teams              - Créer équipe (auth)
POST   /api/teams/:id/members  - Ajouter membre (captain)
```

## 🎨 Stack technique

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Nodemailer

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- Axios
- Context API

## 📞 Besoin d'aide?

1. Vérifier les logs dans les terminaux
2. Consulter le README.md complet
3. Vérifier les fichiers .env
4. Redémarrer les serveurs

---

**Bon développement ! ⚽**

