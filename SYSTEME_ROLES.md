# 🎯 SYSTÈME DE RÔLES - Football Booking Platform

## 📋 Vue d'ensemble

**Principe fondamental : 1 UTILISATEUR = 1 RÔLE UNIQUE**

Chaque utilisateur s'inscrit avec un rôle spécifique qui détermine ses fonctionnalités et son dashboard.

---

## 👥 Les 4 Rôles Principaux

### 1. 🏆 ÉQUIPE/CAPITAINE (`role='team'`)

**Inscription** : `/register/team`  
**Dashboard** : `/dashboard/team`

**Fonctionnalités** :
- ✅ Créer et gérer une équipe
- ✅ Inviter des joueurs à rejoindre l'équipe
- ✅ Organiser des matchs
- ✅ Recruter des joueurs depuis `/players`
- ✅ Réserver des terrains pour l'équipe
- ✅ Gérer les membres (ajouter/retirer)
- ✅ Envoyer des messages aux joueurs
- ✅ Consulter les statistiques de l'équipe

**Notes importantes** :
- Équipe = Capitaine (même personne, même compte)
- Lors de la création d'équipe, un compte User avec `role='team'` est automatiquement créé
- Le capitaine peut également être joueur dans sa propre équipe

---

### 2. ⚽ JOUEUR (`role='player'`)

**Inscription** : `/register/player`  
**Dashboard** : `/dashboard/player`

**Fonctionnalités** :
- ✅ Créer un profil joueur (position, statistiques, etc.)
- ✅ Chercher et rejoindre une équipe
- ✅ Recevoir des invitations de capitaines
- ✅ Participer à des matchs
- ✅ Consulter son historique de matchs
- ✅ Mettre à jour ses disponibilités
- ✅ Badge "Recherche équipe" si pas encore dans une équipe

**Profil visible** :
- Nom, prénom, photo
- Position (gardien, défenseur, milieu, attaquant)
- Statistiques (matchs joués, buts, passes décisives)
- Équipe actuelle (si applicable)
- Badge "Recherche équipe"

---

### 3. 📋 ABONNÉ/ENTREPRISE (`role='subscriber'`)

**Inscription** : `/register/subscriber`  
**Dashboard** : `/dashboard/subscriber`

**Fonctionnalités** :
- ✅ Louer des terrains par abonnement
- ✅ Réservations récurrentes (chaque semaine, chaque mois)
- ✅ Accès prioritaire aux terrains
- ✅ Tarifs préférentiels
- ✅ Gestion des employés/membres autorisés
- ✅ Facturation centralisée

**Cas d'usage** :
- Entreprises pour événements d'équipe
- Clubs sportifs
- Écoles/universités
- Centres de formation

---

### 4. 🏠 PROPRIÉTAIRE (`role='owner'`)

**Inscription** : Page principale → "Nous rejoindre"  
**Dashboard** : `/dashboard` (dashboard propriétaire/client)

**Fonctionnalités** :
- ✅ Ajouter et gérer ses terrains
- ✅ Définir les tarifs et disponibilités
- ✅ Recevoir et gérer les réservations
- ✅ Confirmer/refuser les demandes
- ✅ Consulter les statistiques de revenus
- ✅ Gérer les horaires d'ouverture
- ✅ Recevoir les paiements (Wave, Orange Money)

**Validation** :
- Les terrains doivent être approuvés par un admin
- Vérification des informations de paiement

---

## 🔄 Flux d'inscription

### Flow 1 : Création d'équipe (utilisateur existant)

1. Utilisateur déjà inscrit (ex: `client`)
2. Clique sur "Créer une équipe"
3. Remplit le formulaire d'équipe
4. **Le système convertit automatiquement** son rôle : `client` → `team`
5. Le compte User est mis à jour avec `teamProfile`
6. Redirection vers `/dashboard/team`

### Flow 2 : Création d'équipe (nouvel utilisateur)

1. Utilisateur clique sur "S'inscrire"
2. Choisit le rôle "Équipe"
3. Remplit le formulaire d'équipe + informations capitaine
4. **Le système crée automatiquement** :
   - Un document `Team` dans la collection Teams
   - Un document `User` avec `role='team'` dans la collection Users
5. Redirection vers `/dashboard/team`

---

## 🔐 Système d'authentification

### Collections MongoDB

1. **Users** : Tous les utilisateurs (owner, client, team, player, subscriber)
   - `role` : String (rôle actuel)
   - `roles` : Array (pour futurs rôles multiples)
   - `primaryRole` : String (rôle principal)
   - `teamProfile` : Object (si role='team')
   - `playerProfile` : Object (si role='player')
   - `ownerProfile` : Object (si role='owner')

2. **Teams** : Informations détaillées des équipes
   - Référencées depuis `User.teamProfile.teamId`

3. **Players** : Informations détaillées des joueurs
   - Référencées depuis `User.playerProfile.playerId`

4. **Subscribers** : Informations détaillées des abonnés
   - Référencées depuis `User.subscriberProfile.subscriberId`

### JWT Token

Le token contient :
```json
{
  "id": "userId",
  "email": "user@example.com",
  "role": "team" // ou "player", "owner", etc.
}
```

### Endpoints API

#### POST `/api/auth/register/team`
Créer une équipe + compte capitaine

**Body** :
```json
{
  "name": "FC Médina",
  "logo": "data:image/png;base64,...",
  "captain": {
    "firstName": "Moussa",
    "lastName": "Diallo",
    "email": "moussa@example.com",
    "phone": "+221771234567",
    "password": "password123"
  },
  "city": "Dakar",
  // ... autres champs
}
```

**Comportement** :
1. Vérifie si l'email existe déjà
2. Crée le document `Team`
3. Crée ou met à jour le document `User` avec `role='team'`
4. Génère un JWT
5. Retourne le token + données user

#### POST `/api/auth/register/player`
Créer un compte joueur

#### POST `/api/auth/register/subscriber`
Créer un compte abonné/entreprise

#### GET `/api/auth/me`
Récupérer le profil de l'utilisateur connecté

**Retourne** :
```json
{
  "success": true,
  "data": {
    "id": "userId",
    "email": "user@example.com",
    "role": "team",
    "roles": ["team", "team-captain"],
    "primaryRole": "team",
    "teamProfile": {
      "teamId": "teamId",
      "teamName": "FC Médina"
    }
  }
}
```

---

## 🛠️ Scripts de maintenance

### Fixer un compte capitaine
```bash
cd backend
npm run fix-captains
```
Convertit tous les comptes capitaines avec `role='team'`

### Trouver une équipe spécifique
```bash
cd backend
node src/scripts/findScatCity.js
```
Cherche une équipe par nom et affiche les informations

### Convertir un compte client en team
```bash
cd backend
node src/scripts/convertScatToTeam.js
```
Convertit un compte client spécifique en capitaine d'équipe

---

## 🐛 Troubleshooting

### Problème : "Vous devez créer une équipe" alors que j'en ai une

**Cause** : Votre compte User a `role='client'` au lieu de `role='team'`

**Solution** :
```bash
cd backend
node src/scripts/convertScatToTeam.js
# Ou modifier pour votre email spécifique
```

### Problème : Redirection vers /login après connexion

**Cause** : Token JWT invalide ou user non trouvé

**Diagnostic** :
1. Console (F12) → `localStorage.getItem('token')`
2. Network → Chercher `GET /api/auth/me` → Vérifier la réponse
3. Vérifier les logs backend

**Solution** :
1. Déconnexion complète
2. Vider le localStorage
3. Reconnexion

---

## ✅ Tests de validation

### Test 1 : Inscription équipe (nouveau user)
1. Aller sur `/register/team`
2. Remplir le formulaire
3. Vérifier redirection vers `/dashboard/team`
4. Vérifier que `role='team'` dans la console

### Test 2 : Invitation de joueurs
1. Se connecter avec un compte `team`
2. Aller sur `/players`
3. Cliquer sur un joueur
4. Cliquer "Envoyer une invitation"
5. Vérifier que l'invitation est envoyée

### Test 3 : Joueur reçoit invitation
1. Se connecter avec un compte `player`
2. Aller sur `/dashboard/player?section=messages`
3. Vérifier la présence de l'invitation

---

## 📊 Comptes de test

### Capitaines d'équipe
```
captain.team1@221football.sn / password123 → FC Médina
captain.team2@221football.sn / password123 → AS Pikine
captain.team3@221football.sn / password123 → US Ouakam
captain.team4@221football.sn / password123 → Diambars FC
captain.team5@221football.sn / password123 → ASEC Ndiambour
```

### Joueurs
Voir `CAPITAINES_CONNEXION.md` section "JOUEURS"

### Propriétaires
```
owner1@test.com / password123
owner2@test.com / password123
```

---

## 🚀 Prochaines étapes

- [ ] Système de notifications push pour les invitations
- [ ] Chat temps réel entre capitaines et joueurs
- [ ] Système de matchmaking automatique
- [ ] Calendrier d'équipe avec Google Calendar sync
- [ ] Statistiques avancées de performance joueurs
- [ ] Badges et récompenses
- [ ] Système de classement des équipes

---

**Dernière mise à jour** : 2025-01-07
**Version** : 2.0.0

