# 🏆 COMPTES ÉQUIPES - Football Booking Platform

## 📋 Vue d'ensemble

**30 équipes disponibles** avec des comptes simplifiés pour faciliter les tests et la connexion.

---

## 🔐 Format de connexion

**Email** : `nom-equipe@221football.sn`  
**Mot de passe** : `password123` (pour toutes les équipes)

---

## 📊 Liste complète des équipes

### Zone : Dakar

| # | Email | Équipe | Ville |
|---|-------|--------|-------|
| 1 | `fc-medina@221football.sn` | FC Médina | Dakar |
| 2 | `as-pikine@221football.sn` | AS Pikine | Dakar |
| 3 | `fc-guediawaye@221football.sn` | FC Guédiawaye | Dakar |
| 4 | `union-de-yoff@221football.sn` | Union de Yoff | Dakar |
| 5 | `espoir-liberte-6@221football.sn` | Espoir Liberté 6 | Dakar |
| 6 | `asc-ouakam@221football.sn` | ASC Ouakam | Dakar |
| 7 | `les-etoiles-de-ngor@221football.sn` | Les Étoiles de Ngor | Dakar |
| 8 | `fc-parcelles@221football.sn` | FC Parcelles | Dakar |
| 9 | `almadies-fc@221football.sn` | Almadies FC | Dakar |
| 10 | `mermoz-united@221football.sn` | Mermoz United | Dakar |
| 11 | `hlm-stars@221football.sn` | HLM Stars | Dakar |
| 12 | `fass-football-club@221football.sn` | Fass Football Club | Dakar |
| 13 | `grand-dakar-fc@221football.sn` | Grand Dakar FC | Dakar |
| 14 | `plateau-athletic@221football.sn` | Plateau Athletic | Dakar |
| 15 | `sacrecur-sc@221football.sn` | Sacré-Cœur SC | Dakar |
| 16 | `camberene-fc@221football.sn` | Cambérène FC | Dakar |
| 17 | `dieuppeul-united@221football.sn` | Dieuppeul United | Dakar |
| 18 | `sicap-fc@221football.sn` | Sicap FC | Dakar |
| 19 | `castors-football@221football.sn` | Castors Football | Dakar |
| 20 | `nord-foire-fc@221football.sn` | Nord Foire FC | Dakar |
| 21 | `point-e-athletic@221football.sn` | Point E Athletic | Dakar |
| 22 | `mamelles-fc@221football.sn` | Mamelles FC | Dakar |
| 23 | `amitie-fc@221football.sn` | Amitié FC | Dakar |
| 24 | `golf-sud-united@221football.sn` | Golf Sud United | Dakar |
| 25 | `keur-gorgui-fc@221football.sn` | Keur Gorgui FC | Dakar |
| 26 | `bopp-stars@221football.sn` | Bopp Stars | Dakar |
| 27 | `fann-fc@221football.sn` | Fann FC | Dakar |
| 28 | `soumbedioune-united@221football.sn` | Soumbédioune United | Dakar |
| 29 | `gueule-tapee-fc@221football.sn` | Gueule Tapée FC | Dakar |
| 30 | `fenetre-mermoz-sc@221football.sn` | Fenêtre Mermoz SC | Dakar |

---

## 🎯 Exemples d'utilisation

### Test rapide
```
📧 Email: fc-medina@221football.sn
🔑 Password: password123
```

### Votre équipe personnelle
```
📧 Email: scatcity@gmail.com
🔑 Password: password123
```

---

## 🔧 Fonctionnalités par équipe

Chaque équipe a accès à :

- ✅ **Dashboard Team** (`/dashboard/team`)
- ✅ **Gestion des membres**
- ✅ **Invitations de joueurs**
- ✅ **Réservation de terrains**
- ✅ **Organisation de matchs**
- ✅ **Messagerie**
- ✅ **Statistiques**

---

## 📝 Notes importantes

1. **Mot de passe unique** : Toutes les équipes utilisent `password123`
2. **Format email** : Le nom de l'équipe est converti en slug (minuscules, sans accents, avec tirets)
3. **Rôles** : Tous les comptes ont `role='team'` et `roles=['team', 'team-captain']`
4. **Activation** : Tous les comptes sont actifs par défaut

---

## 🛠️ Gestion des comptes

### Réinitialiser un compte spécifique
```bash
cd backend
node src/scripts/testScatLogin.js
```

### Recréer tous les comptes
```bash
cd backend
node src/scripts/cleanupAndSimplifyAccounts.js
```

### Vérifier un compte
```bash
cd backend
node src/scripts/findScatCity.js
```

---

## 🔄 Conversion nom → email

| Nom d'équipe | Email généré |
|--------------|--------------|
| FC Médina | `fc-medina@221football.sn` |
| AS Pikine | `as-pikine@221football.sn` |
| Sacré-Cœur SC | `sacrecur-sc@221football.sn` |
| Les Étoiles de Ngor | `les-etoiles-de-ngor@221football.sn` |

**Règles** :
- Tout en minuscules
- Suppression des accents
- Suppression des caractères spéciaux
- Espaces remplacés par des tirets (`-`)
- Limité à 30 caractères

---

## 🎮 Scénarios de test

### Scénario 1 : Invitation de joueur
1. Connectez-vous avec `fc-medina@221football.sn`
2. Allez sur `/players`
3. Cliquez sur un joueur
4. Cliquez "Envoyer une invitation"

### Scénario 2 : Réservation de terrain
1. Connectez-vous avec `as-pikine@221football.sn`
2. Cliquez "Réserver un terrain"
3. Choisissez un terrain et un créneau
4. Validez la réservation

### Scénario 3 : Ajout de membres
1. Connectez-vous avec `asc-ouakam@221football.sn`
2. Allez dans "Membres"
3. Cliquez "Ajouter un membre"
4. Remplissez le formulaire

---

## ⚠️ Troubleshooting

### "Email ou mot de passe incorrect"
- Vérifiez que vous utilisez bien `password123` (tout en minuscules)
- Essayez de fermer et rouvrir le navigateur
- Videz le cache : `localStorage.clear()` dans la console

### "Vous devez créer une équipe"
- Déconnectez-vous complètement
- Reconnectez-vous
- Le rôle devrait être correctement détecté

### Compte bloqué ou erreur
Utilisez le script de diagnostic :
```bash
cd backend
node src/scripts/testScatLogin.js
```

---

**Dernière mise à jour** : 2025-01-07  
**Total équipes** : 30  
**Mot de passe universel** : `password123`

