# 🎛️ Guide Complet : Gestion des Disponibilités Propriétaire

**Feature** : Système de blocage/déblocage de créneaux par le propriétaire  
**Date** : 3 Novembre 2025  
**Rôle** : Propriétaire de terrain / Admin

---

## 🎯 Objectif

Permettre aux **propriétaires de terrains** de :
- 🔒 **Bloquer** des créneaux horaires (maintenance, événement privé, etc.)
- 🔓 **Débloquer** des créneaux précédemment bloqués
- 📊 **Visualiser** en temps réel toutes les réservations ET blocages
- 📅 **Gérer** la disponibilité jour par jour

---

## 🎨 Interface Propriétaire

### Dashboard → Gestion des Disponibilités

```
┌─────────────────────────────────────────────────────────┐
│  Gestion des Disponibilités                            │
│  Bloquez ou débloquez des créneaux pour VDN Foot       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📅 Sélectionnez une date: [05/11/2025]                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Légende:                                              │
│  🟢 Disponible  🔵 Réservé  🟠 Bloqué manuellement     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 08:00    │ │ 09:00    │ │ 10:00    │ │ 11:00    │ │
│  │   à      │ │   à      │ │   à      │ │   à      │ │
│  │ 09:00    │ │ 10:00    │ │ 11:00    │ │ 12:00    │ │
│  │ ✅ Libre │ │👤Réservé │ │🔒Mainten.│ │ ✅ Libre │ │
│  │[Bloquer] │ │ Occupé   │ │[Débloquer│ │[Bloquer] │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│     VERT        BLEU        ORANGE       VERT        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  📊 Statistiques du jour:                              │
│  ✅ 12 Libres  |  👤 3 Réservés  |  🔒 2 Bloqués      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Fonctionnement Détaillé

### 1️⃣ Bloquer un Créneau

**Étapes** :

1. Propriétaire **sélectionne une date**
2. Grille de créneaux s'affiche
3. **Clique sur "Bloquer"** d'un créneau libre (vert)
4. Modal s'ouvre :
   ```
   ┌─────────────────────────────────────┐
   │  Bloquer un créneau                 │
   ├─────────────────────────────────────┤
   │  Créneau : 10:00 - 11:00           │
   │                                     │
   │  Raison du blocage :                │
   │  [🔧 Maintenance      ▼]           │
   │                                     │
   │  Note (optionnelle) :               │
   │  ┌─────────────────────────────┐   │
   │  │ Réparation du gazon         │   │
   │  └─────────────────────────────┘   │
   │                                     │
   │  [Annuler]  [🔒 Bloquer]           │
   └─────────────────────────────────────┘
   ```

5. Propriétaire choisit :
   - **Raison** : Maintenance / Événement privé / Fermé / Autre
   - **Note** : Description optionnelle (max 200 caractères)

6. Clique sur **"Bloquer"**

7. Créneau devient **ORANGE** avec mention "🔒 Maintenance"

8. Les clients **ne peuvent plus** réserver ce créneau

---

### 2️⃣ Débloquer un Créneau

**Étapes** :

1. Propriétaire voit un créneau **ORANGE** (bloqué)
2. Clique sur **"Débloquer"**
3. Confirmation : "Débloquer ce créneau ?"
4. Confirme
5. Créneau redevient **VERT** (disponible)
6. Les clients **peuvent à nouveau** réserver

---

## 📊 Types de Créneaux

| Statut | Couleur | Action Propriétaire | Visible Client |
|--------|---------|---------------------|----------------|
| **Libre** | 🟢 Vert | Peut bloquer | ✅ Peut réserver |
| **Réservé (client)** | 🔵 Bleu | Non modifiable | ❌ Occupé |
| **Bloqué (propriétaire)** | 🟠 Orange | Peut débloquer | ❌ Indisponible |

---

## 🎯 Cas d'Usage Réels

### Cas 1 : Maintenance du Terrain

**Scenario** : Le gazon synthétique sera réparé le 10 Nov de 08:00 à 14:00

**Actions** :
1. Propriétaire va sur "Gestion des Disponibilités"
2. Sélectionne **10 Nov 2025**
3. **Bloque** les créneaux :
   - 08:00 - 09:00 → Maintenance
   - 09:00 - 10:00 → Maintenance
   - 10:00 - 11:00 → Maintenance
   - 11:00 - 12:00 → Maintenance
   - 12:00 - 13:00 → Maintenance
   - 13:00 - 14:00 → Maintenance

4. Tous ces créneaux deviennent **ORANGE** avec "🔒 Maintenance"

**Résultat Côté Client** :
- Les clients voient ces créneaux **bloqués** (rouges)
- Mention : "Indisponible" ou "Maintenance"
- Impossible de réserver

---

### Cas 2 : Événement Privé (Tournoi d'Entreprise)

**Scenario** : Une entreprise a réservé tout l'après-midi du 15 Nov

**Actions** :
1. Bloquer 14:00 - 20:00
2. Raison : "Événement privé"
3. Note : "Tournoi inter-entreprises SONATEL"

**Résultat** :
- Créneaux orange avec "🎉 Événement privé"
- Clients ne peuvent pas réserver
- Propriétaire garde le contrôle

---

### Cas 3 : Fermeture Exceptionnelle

**Scenario** : Jour férié (14 Juillet)

**Actions** :
1. Bloquer TOUS les créneaux de la journée
2. Raison : "Fermé"
3. Note : "Fête nationale - Terrain fermé"

**Résultat** :
- Toute la journée bloquée
- Message clair pour les clients

---

## 🔐 Sécurité

### Autorisations

**Qui peut bloquer/débloquer ?**
- ✅ **Propriétaire** du terrain (owner)
- ✅ **Admin** de la plateforme
- ❌ Clients (pas d'accès)

### Validation Backend

```javascript
// Vérification avant blocage
if (terrain.owner !== user.id && user.role !== 'admin') {
  return error('Non autorisé');
}
```

---

## 📡 API Endpoints

### POST /api/terrains/:id/block-slot

**Body** :
```json
{
  "date": "2025-11-10",
  "startTime": "10:00",
  "endTime": "11:00",
  "reason": "maintenance",
  "note": "Réparation du gazon"
}
```

**Response** :
```json
{
  "success": true,
  "message": "Créneau bloqué avec succès",
  "data": [...]
}
```

---

### POST /api/terrains/:id/unblock-slot

**Body** :
```json
{
  "date": "2025-11-10",
  "startTime": "10:00"
}
```

**Response** :
```json
{
  "success": true,
  "message": "Créneau débloqué avec succès"
}
```

---

### GET /api/terrains/:id/availability?date=2025-11-10

**Response** (mise à jour) :
```json
{
  "success": true,
  "data": {
    "date": "2025-11-10",
    "terrain": {
      "id": "...",
      "name": "VDN Foot",
      "openingHours": {...}
    },
    "reservations": [
      { "startTime": "09:00", "endTime": "10:00", "status": "confirmed" }
    ],
    "blockedSlots": [
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "reason": "maintenance",
        "note": "Réparation du gazon"
      }
    ]
  }
}
```

---

## 🎨 UX Client vs Propriétaire

### Vue Client (TimeSlotPicker)

```
Créneau 10:00-11:00 bloqué par propriétaire :
┌──────────┐
│ ❌ 10:00 │
│    à     │
│  11:00   │
│ Mainten. │  ← Affiche la raison
└──────────┘
  NON CLIQUABLE
```

### Vue Propriétaire (AvailabilityManager)

```
Même créneau :
┌──────────────┐
│   10:00      │
│     à        │
│   11:00      │
│ 🔒 Mainten.  │
│ [Débloquer]  │  ← Bouton de contrôle
└──────────────┘
  PEUT DÉBLOQUER
```

---

## 🔄 Workflow Complet

### Propriétaire Bloque

```
1. Dashboard propriétaire
   ↓
2. "Gestion des Disponibilités"
   ↓
3. Sélectionne date
   ↓
4. Clique "Bloquer" sur créneau
   ↓
5. Choisit raison + note
   ↓
6. Confirme
   ↓
7. POST /api/terrains/:id/block-slot
   ↓
8. MongoDB : terrain.customAvailability mis à jour
   ↓
9. Créneau marqué comme bloqué ✅
```

### Client Essaie de Réserver

```
1. Page terrain
   ↓
2. Clique "Réserver"
   ↓
3. Sélectionne date
   ↓
4. GET /api/terrains/:id/availability
   ↓
5. Reçoit reservations + blockedSlots
   ↓
6. TimeSlotPicker génère grille
   ↓
7. Créneau bloqué = ROUGE, non cliquable ❌
   ↓
8. Client voit "Maintenance" ou raison
   ↓
9. Ne peut PAS réserver ce créneau ✅
```

---

## 📁 Fichiers Créés/Modifiés

| Fichier | Action | Description |
|---------|--------|-------------|
| `Terrain.js` (model) | ✅ Modifié | Ajout champ `customAvailability` |
| `terrainController.js` | ✅ Modifié | Ajout `blockTimeSlot`, `unblockTimeSlot` |
| `terrains.js` (routes) | ✅ Modifié | Ajout routes block/unblock |
| `AvailabilityManager.jsx` | ✅ Créé | Interface propriétaire |
| `TimeSlotPicker.jsx` | ✅ Modifié | Affichage blocages manuels |
| `api.js` | ✅ Modifié | Méthodes block/unblock |

---

## ✅ Checklist Fonctionnalités

### Backend
- ✅ Modèle Terrain avec `customAvailability`
- ✅ API `POST /block-slot`
- ✅ API `POST /unblock-slot`
- ✅ API `GET /availability` inclut blocages
- ✅ Validation propriétaire/admin
- ✅ Sécurité (authentification requise)

### Frontend
- ✅ Composant `AvailabilityManager` (propriétaire)
- ✅ Composant `TimeSlotPicker` mis à jour (client)
- ✅ Méthodes API ajoutées
- ✅ Interface visuelle intuitive
- ✅ Modal de blocage
- ✅ Statistiques temps réel

---

## 🧪 Comment Tester

### Étape 1 : Se Connecter en Propriétaire

**Utilisez** :
- Email : `admin@football-booking.sn`
- Mot de passe : `Admin2024!`

### Étape 2 : Accéder au Dashboard

1. Cliquez sur votre profil (top right)
2. "Dashboard"
3. "Gérer mes terrains"
4. Sélectionnez un terrain
5. Onglet "Disponibilités"

### Étape 3 : Bloquer un Créneau

1. Sélectionnez une date future
2. Cliquez sur "Bloquer" d'un créneau vert
3. Choisissez "Maintenance"
4. Ajoutez une note
5. Confirmez

### Étape 4 : Vérifier Côté Client

1. **Déconnectez-vous**
2. Allez sur le terrain
3. Cliquez "Réserver"
4. Sélectionnez la même date
5. Le créneau bloqué doit être **ROUGE** avec "Maintenance" ✅

---

## 💡 Cas d'Usage Avancés

### Bloquer Plusieurs Créneaux

**Pour bloquer une plage entière** (ex: 08:00 - 14:00) :

Bloquer **un par un** :
- 08:00 - 09:00
- 09:00 - 10:00
- 10:00 - 11:00
- 11:00 - 12:00
- 12:00 - 13:00
- 13:00 - 14:00

**Raison** : Même raison pour tous (ex: "Maintenance")

---

### Débloquer en Cas d'Annulation

Si la maintenance est annulée :
1. Retourner sur "Gestion des Disponibilités"
2. Même date
3. Cliquer "Débloquer" sur chaque créneau orange
4. Créneaux redeviennent verts ✅
5. Clients peuvent à nouveau réserver

---

## 🎨 Design

### Couleurs des États

```css
Libre (vert):
  bg-white border-gray-200
  hover:border-green-500

Réservé client (bleu):
  bg-blue-50 border-blue-300
  Non modifiable par propriétaire

Bloqué propriétaire (orange):
  bg-orange-50 border-orange-300
  Peut débloquer
```

### Boutons d'Action

```css
Bloquer:
  bg-orange-600 hover:bg-orange-700
  Icône: 🔒 Lock

Débloquer:
  bg-green-600 hover:bg-green-700
  Icône: 🔓 Unlock
```

---

## 📊 Statistiques Temps Réel

En bas de la grille, le propriétaire voit :

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│     12      │ │      3      │ │      2      │
│   Libres    │ │  Réservés   │ │   Bloqués   │
└─────────────┘ └─────────────┘ └─────────────┘
   bg-green-50     bg-blue-50      bg-orange-50
```

**Permet de** :
- Voir d'un coup d'œil le taux d'occupation
- Identifier les jours creux
- Optimiser les blocages

---

## 🔔 Notifications & Retours

### Succès
```
✅ Créneau bloqué avec succès
✅ Créneau débloqué avec succès
```

### Erreurs
```
❌ Erreur lors du blocage du créneau
❌ Ce créneau est déjà réservé par un client
❌ Non autorisé (pas le propriétaire)
```

---

## 🚀 Prochaines Améliorations Possibles

1. **Blocage en Masse**
   - Bloquer toute une journée d'un coup
   - Bloquer un créneau récurrent (tous les lundis 10:00-11:00)

2. **Historique des Blocages**
   - Voir tous les blocages passés
   - Statistiques de fermeture

3. **Notifications Automatiques**
   - Email aux clients si créneau réservé est bloqué après
   - SMS d'alerte maintenance

4. **Calendrier Mensuel**
   - Vue mois entier
   - Blocages et réservations en un coup d'œil

---

## ✨ Résultat

Avec ce système, le propriétaire a **un contrôle total** sur son terrain :

- 📅 Gestion par jour
- 🕒 Gestion par créneau horaire
- 🔒 Blocage flexible
- 📊 Visibilité complète
- 👥 Coordination avec réservations clients
- 🎯 Optimisation de l'occupation

**Le client a une expérience claire** :
- Voit seulement ce qui est vraiment disponible
- Raisons affichées (Maintenance, etc.)
- Pas de frustration (pas de réservation refusée après)

---

**🎊 Système de gestion des disponibilités complet et professionnel !**

