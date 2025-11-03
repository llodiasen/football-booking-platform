# 📊 Guide Complet - Dashboard Propriétaire

## 🎯 Vue d'ensemble

Le **Dashboard Propriétaire** est une interface complète qui permet aux propriétaires de terrains de gérer entièrement leurs installations sportives depuis une seule plateforme.

---

## ✅ Fonctionnalités Implémentées

### 1. **Statistiques en Temps Réel**
- 📍 **Total des terrains** (approuvés et en attente)
- 📅 **Nombre de réservations** (confirmées et en attente)
- 💰 **Revenus totaux et mensuels** (en FCFA)
- 👁️ **Vues totales** sur tous vos terrains

### 2. **Gestion des Terrains**

#### ➕ Ajouter un Terrain
- **Informations de base** :
  - Nom du terrain
  - Description détaillée (min 20 caractères)
  - Type (Synthétique, Naturel, Stabilisé)
  - Taille (5x5, 7x7, 11x11)

- **Localisation** :
  - Adresse complète
  - Ville et Région (dropdown avec villes du Sénégal)
  - Coordonnées GPS (Longitude/Latitude)
  - 💡 Astuce : utilisez Google Maps pour trouver les coordonnées

- **Tarification** :
  - Prix par heure en FCFA
  - Possibilité de créer des promotions (à venir)

- **Équipements** :
  - ✅ Vestiaires
  - ✅ Douches
  - ✅ Parking
  - ✅ Éclairage nocturne
  - ✅ Tribune/Gradins
  - ✅ Cafétéria
  - ✅ WiFi

- **Horaires d'ouverture** :
  - Configuration jour par jour
  - Heures d'ouverture et fermeture
  - Option "Fermé" pour chaque jour
  - Format 24h (HH:MM)

- **Photos** :
  - Ajout d'images par URL
  - Première image = image principale
  - Galerie photos du terrain

#### ✏️ Modifier un Terrain
- Modification de toutes les informations
- Mise à jour des photos
- Changement des horaires
- Ajustement des prix

#### 🗑️ Supprimer un Terrain
- Suppression avec confirmation
- Vérification automatique des réservations futures
- Impossible de supprimer si réservations actives

---

## 🚀 Comment Utiliser

### 1. **Accéder au Dashboard**

1. Connectez-vous avec un compte **Propriétaire**
2. Vous êtes automatiquement redirigé vers votre dashboard
3. URL : `http://localhost:5174/dashboard`

### 2. **Ajouter Votre Premier Terrain**

```
1. Cliquez sur "Ajouter un terrain" (bouton vert en haut à droite)
2. Remplissez le formulaire :
   - Nom : Ex: "Galaxy Arena"
   - Description : Minimum 20 caractères
   - Type : Synthétique
   - Taille : 7x7
   - Ville : Dakar
   - Région : Dakar
   - Prix : 30000 FCFA/h
3. Ajoutez les coordonnées GPS (Google Maps)
4. Cochez les équipements disponibles
5. Configurez les horaires d'ouverture
6. Ajoutez des photos (URLs)
7. Cliquez sur "Créer le terrain"
```

### 3. **Obtenir les Coordonnées GPS**

```
1. Allez sur Google Maps (maps.google.com)
2. Cherchez votre terrain
3. Clic droit sur l'emplacement exact
4. Cliquez sur les coordonnées qui apparaissent
5. Format : "14.7167, -17.4677"
   - Premier nombre = Latitude (14.7167)
   - Second nombre = Longitude (-17.4677)
```

### 4. **Statut d'Approbation**

Vos terrains passent par 2 états :
- ⏳ **En attente** : Terrain créé, en attente de validation admin
- ✅ **Approuvé** : Terrain visible publiquement

> 💡 **Note** : Seuls les terrains approuvés apparaissent dans les recherches publiques.

---

## 📊 Exemple de Configuration Complète

```json
{
  "name": "Galaxy Arena",
  "description": "Complexe moderne avec terrain synthétique de qualité, éclairage nocturne, vestiaires spacieux et cafétéria. Idéal pour matchs entre amis ou tournois d'entreprise.",
  "type": "synthetique",
  "size": "7x7",
  "address": {
    "street": "Boulevard Habib Bourguiba, Ouakam",
    "city": "Dakar",
    "region": "Dakar",
    "coordinates": {
      "type": "Point",
      "coordinates": [-17.4677, 14.7167]
    }
  },
  "pricePerHour": 32500,
  "amenities": ["vestiaires", "douches", "parking", "eclairage", "cafeteria"],
  "openingHours": {
    "monday": { "open": "08:00", "close": "23:00", "closed": false },
    "tuesday": { "open": "08:00", "close": "23:00", "closed": false },
    "wednesday": { "open": "08:00", "close": "23:00", "closed": false },
    "thursday": { "open": "08:00", "close": "23:00", "closed": false },
    "friday": { "open": "08:00", "close": "23:00", "closed": false },
    "saturday": { "open": "08:00", "close": "23:00", "closed": false },
    "sunday": { "open": "09:00", "close": "22:00", "closed": false }
  }
}
```

---

## 🔐 Routes API Backend

### GET `/api/terrains/my-terrains`
**Authentification requise** : Oui (Token JWT)  
**Rôle** : Owner, Admin  
**Description** : Récupère tous les terrains du propriétaire connecté

**Réponse** :
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### POST `/api/terrains`
**Authentification requise** : Oui  
**Rôle** : Owner, Admin  
**Description** : Crée un nouveau terrain

### PUT `/api/terrains/:id`
**Authentification requise** : Oui  
**Rôle** : Owner (propriétaire du terrain), Admin  
**Description** : Modifie un terrain

### DELETE `/api/terrains/:id`
**Authentification requise** : Oui  
**Rôle** : Owner (propriétaire du terrain), Admin  
**Description** : Supprime un terrain

---

## 🎨 Composants Créés

### 1. **OwnerDashboard.jsx**
`frontend/src/pages/owner/OwnerDashboard.jsx`

Dashboard principal pour les propriétaires :
- Cartes de statistiques
- Liste des terrains
- Gestion complète (ajout, modification, suppression)

### 2. **TerrainFormModal.jsx**
`frontend/src/components/owner/TerrainFormModal.jsx`

Formulaire modal complet :
- Tous les champs nécessaires
- Validation frontend
- Upload d'images
- Configuration des horaires

---

## 🔄 Workflow Complet

```
1. Propriétaire s'inscrit
   ↓
2. Sélectionne "Propriétaire de terrain"
   ↓
3. Renseigne le nom de l'entreprise
   ↓
4. Compte créé → Dashboard propriétaire
   ↓
5. Clique "Ajouter un terrain"
   ↓
6. Remplit le formulaire complet
   ↓
7. Soumet → Terrain en attente d'approbation
   ↓
8. Admin approuve le terrain
   ↓
9. Terrain visible publiquement
   ↓
10. Clients peuvent réserver
```

---

## ⚡ Prochaines Améliorations

### À venir :
- [ ] Upload direct d'images (actuellement URL seulement)
- [ ] Gestion des indisponibilités (congés, maintenance)
- [ ] Tableau de bord des réservations en temps réel
- [ ] Statistiques avancées (graphiques)
- [ ] Notifications en temps réel
- [ ] Gestion des promotions/réductions
- [ ] Messagerie avec les clients
- [ ] Calendrier interactif des réservations
- [ ] Export des données (PDF, Excel)
- [ ] Gestion du personnel (employés)

---

## 🐛 Dépannage

### Problème : "Nom de l'entreprise requis"
**Solution** : Le champ "Nom de l'entreprise" apparaît seulement si vous sélectionnez "Propriétaire de terrain" lors de l'inscription.

### Problème : "Non autorisé à modifier ce terrain"
**Solution** : Vous ne pouvez modifier que VOS terrains. Vérifiez que vous êtes bien le propriétaire.

### Problème : "Terrain en attente d'approbation"
**Solution** : Normal ! Un administrateur doit approuver votre terrain avant qu'il soit visible publiquement.

### Problème : Images ne s'affichent pas
**Solution** : Vérifiez que l'URL de l'image est accessible et valide (doit commencer par `http://` ou `https://`).

---

## 📞 Support

Pour toute question :
- 📧 Email : support@footballsn.com
- 📱 Téléphone : +221 XX XXX XX XX
- 💬 Chat : Disponible sur le site

---

**🎉 Félicitations ! Votre dashboard propriétaire est maintenant opérationnel ! 🏟️**

