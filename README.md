# ⚽ Plateforme de Réservation de Terrains de Football - Sénégal

Une plateforme web moderne pour la réservation de terrains de football au Sénégal, avec gestion des paiements mobiles (Wave, Orange Money, Free Money).

## 🚀 Technologies Utilisées

### Backend
- **Node.js** & **Express.js** - Serveur API REST
- **MongoDB Atlas** - Base de données NoSQL
- **JWT** - Authentification sécurisée
- **Mongoose** - ODM pour MongoDB

### Frontend
- **React** & **Vite** - Interface utilisateur moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation côté client

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Compte MongoDB Atlas
- Git

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/football-booking-platform.git
cd football-booking-platform
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Configurez vos variables d'environnement dans `.env` :
- `MONGODB_URI` : Votre chaîne de connexion MongoDB Atlas
- `JWT_SECRET` : Clé secrète pour JWT (minimum 32 caractères)
- Autres configurations selon vos besoins

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
```

### 4. Démarrer le projet

**Backend** (Terminal 1) :
```bash
cd backend
npm run dev
```
Le backend démarre sur `http://localhost:5000`

**Frontend** (Terminal 2) :
```bash
cd frontend
npm run dev
```
Le frontend démarre sur `http://localhost:5173`

## 📁 Structure du Projet

```
football-booking-platform/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration (database, etc.)
│   │   ├── models/       # Modèles Mongoose
│   │   ├── routes/       # Routes API
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Middlewares personnalisés
│   │   └── server.js     # Point d'entrée
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   ├── hooks/        # Hooks personnalisés
│   │   └── App.jsx       # Composant principal
│   └── package.json
│
└── README.md
```

## 🔐 Configuration MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster
3. Configurez **Database Access** :
   - Créez un utilisateur avec les droits `readWriteAnyDatabase`
4. Configurez **Network Access** :
   - Ajoutez `0.0.0.0/0` pour le développement
   - Configurez des IP spécifiques pour la production
5. Copiez la chaîne de connexion et ajoutez-la dans `.env`

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Terrains
- `GET /api/terrains` - Liste des terrains
- `GET /api/terrains/:id` - Détails d'un terrain
- `POST /api/terrains` - Créer un terrain (admin)

### Réservations
- `GET /api/reservations` - Mes réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation

### Paiements
- `POST /api/payments/initiate` - Initier un paiement
- `POST /api/payments/verify` - Vérifier un paiement

## 👥 Auteur

Amadou Wopa

## 📄 Licence

MIT
