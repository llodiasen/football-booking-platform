# 📅 Calendrier Interactif Style Airbnb - Documentation

**Feature** : Calendrier de sélection de dates avec dates réservées barrées  
**Date** : 4 Novembre 2025  
**Inspiration** : Calendrier Airbnb  

---

## 🎯 Objectif

Créer un **calendrier interactif style Airbnb** qui :
- Affiche **2 mois côte à côte**
- Permet la **sélection d'une plage de dates** (arrivée → départ)
- **Barre visuellement** les dates déjà réservées
- Se ferme automatiquement après sélection complète
- Calcule automatiquement le nombre de nuits et le prix total

---

## 🎨 Design Visuel

### Layout Calendrier

```
┌─────────────────────────────────────────────────┐
│  2 nuits                      [Effacer dates]   │
│  19 déc. 2025 - 21 déc. 2025                   │
├─────────────────────────────────────────────────┤
│  [<]                                       [>]  │
├──────────────────────┬──────────────────────────┤
│   Décembre 2025      │    Janvier 2026          │
│  L M M J V S D       │   L M M J V S D          │
│     1  2  3  4  5    │            1  2          │
│  6  7  8  9 10 11 12 │   3  4  5  6  7  8  9    │
│ 13 14 15 16 17 18 ⚫ │  10 11 12 13 14 15 16    │
│ 20 ⚫ 22 23 24 25 26 │  17 18 19 20 21 22 23    │
│ 27 28 29 30 31      │  24 25 26 27 28 29 30    │
│                      │  31                      │
└──────────────────────┴──────────────────────────┘
  ⚫ = Sélectionné (noir)
  ⚪ = Plage (gris clair)
  ❌ = Déjà pris (barré rouge)
  ✗ = Passé (grisé)
```

---

## 🏗️ Architecture

### Composants Créés

#### 1. `DateRangePicker.jsx`

**Responsabilités** :
- Afficher 2 calendriers mensuels côte à côte
- Gérer la sélection de plage de dates
- Récupérer les disponibilités via API
- Barrer les dates réservées
- Navigation entre mois (← →)

**Props** :
```jsx
<DateRangePicker 
  terrainId={terrain._id}                    // ID du terrain
  onDateSelect={(start, end) => {...}}       // Callback sélection
  selectedStartDate={startDate}              // Date début (contrôlé)
  selectedEndDate={endDate}                  // Date fin (contrôlé)
/>
```

**États internes** :
```javascript
const [currentMonth, setCurrentMonth] = useState(new Date());
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [bookedDates, setBookedDates] = useState(new Set());
const [loading, setLoading] = useState(true);
```

---

#### 2. `BookingCard.jsx` (mis à jour)

**Ajouts** :
- Champs **ARRIVÉE** / **DÉPART** style Airbnb
- Dropdown calendrier au clic
- Calcul automatique du nombre de nuits
- Mise à jour du prix total

**Interface** :
```
┌──────────────────────────────┐
│  15 000 FCFA  / heure        │
│  ★ 4.9  ·  518 avis          │
├──────────────────────────────┤
│  ARRIVÉE    │  DÉPART         │
│  19/12/2025 │  21/12/2025  [X]│
│  (clic ouvre le calendrier)  │
├──────────────────────────────┤
│  [RÉSERVER]                  │
├──────────────────────────────┤
│  15 000 FCFA x 2 nuits       │
│  = 30 000 FCFA               │
└──────────────────────────────┘
```

---

## 🔄 Workflow Utilisateur

### Sélection de Dates

```
1. Utilisateur clique sur "ARRIVÉE" ou "DÉPART"
   ↓
2. Calendrier s'ouvre (dropdown)
   ↓
3. Utilisateur clique sur une date → Date de début
   ↓
4. Utilisateur clique sur une autre date → Date de fin
   ↓
5. Calendrier se ferme automatiquement (300ms)
   ↓
6. Calcul automatique : nuits + prix total
   ↓
7. Bouton "RÉSERVER" activé
```

---

## 🎨 États Visuels des Dates

### Codes Couleurs

| État | Visuel | CSS | Description |
|------|--------|-----|-------------|
| **Disponible** | Blanc avec hover gris | `bg-white hover:bg-gray-100` | Date libre, cliquable |
| **Sélectionnée (Début/Fin)** | Noir | `bg-gray-900 text-white` | Date de début ou fin |
| **Plage sélectionnée** | Gris clair | `bg-gray-100 text-gray-900` | Dates entre début et fin |
| **Déjà réservée** | Barré rouge | `line-through text-gray-300` + barre diagonale rouge | Tous créneaux pris |
| **Date passée** | Grisé | `text-gray-300 cursor-not-allowed` | Avant aujourd'hui |
| **Terrain fermé** | Grisé barré | `text-gray-300 line-through` | Jour de fermeture |

### Barre Diagonale (Dates Prises)

```jsx
{isBooked && (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[1px] h-12 bg-red-400 rotate-45 absolute" />
  </div>
)}
```

Résultat : Une fine ligne **rouge** diagonale traverse la date

---

## 🔌 Intégration API

### Récupération des Disponibilités

**Endpoint** : `GET /api/terrains/:id/availability?date=YYYY-MM-DD`

**Logique de Marquage** :

```javascript
// Pour chaque jour des 60 prochains jours :
1. Récupérer availability
2. Compter créneaux totaux (ouverture → fermeture, par heures)
3. Compter créneaux pris (réservations + blocages manuels)
4. Si créneaux pris >= créneaux totaux → Marquer date comme complète
5. Si terrain fermé ce jour → Marquer comme non disponible
```

**Code clé** :
```javascript
const totalSlots = Math.floor((closeMinutes - openMinutes) / 60);
const takenSlots = reservations.length + blockedSlots.length;

if (takenSlots >= totalSlots) {
  bookedSet.add(dateString); // Date complète
}
```

---

## 📱 Responsive Design

### Desktop (> 768px)

```
┌────────────────────────────────────┐
│  Calendrier dropdown               │
│  [Mois 1]    [Mois 2]              │
│  (2 colonnes côte à côte)          │
└────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────┐
│ Calendrier   │
│ [Mois 1]     │
│ scroll →     │
│ [Mois 2]     │
└──────────────┘
```

**Adaptations** :
- Calendriers en scroll horizontal (`overflow-x-auto`)
- Taille minimale : `min-w-[280px]`
- Légende en `flex-wrap`

---

## 🎯 Fonctionnalités Avancées

### 1. Fermeture Automatique

```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  if (showCalendar) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [showCalendar]);
```

**Comportement** :
- Clic en dehors du calendrier → Fermeture
- Sélection complète (début + fin) → Fermeture après 300ms

---

### 2. Calcul Dynamique du Prix

```javascript
const calculateNights = () => {
  if (!selectedStartDate || !selectedEndDate) return 0;
  const start = new Date(selectedStartDate);
  const end = new Date(selectedEndDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const calculateTotal = () => {
  const nights = calculateNights();
  return nights > 0 ? terrain.pricePerHour * nights : terrain.pricePerHour;
};
```

**Affichage** :
```jsx
{selectedStartDate && selectedEndDate && (
  <div>
    {formatPrice(terrain.pricePerHour)} FCFA x {calculateNights()} nuits
    = {formatPrice(calculateTotal())} FCFA
  </div>
)}
```

---

### 3. Navigation Mois

```javascript
const prevMonth = () => {
  const newMonth = new Date(currentMonth);
  newMonth.setMonth(currentMonth.getMonth() - 1);
  setCurrentMonth(newMonth);
};

const nextMonth = () => {
  const newMonth = new Date(currentMonth);
  newMonth.setMonth(currentMonth.getMonth() + 1);
  setCurrentMonth(newMonth);
};
```

**Boutons** :
- `<` Mois précédent
- `>` Mois suivant
- Affichage toujours de 2 mois consécutifs

---

### 4. Bouton "Effacer les dates"

```jsx
<button onClick={handleClearDates}>
  <X size={14} /> Effacer les dates
</button>
```

**Action** :
- Réinitialise `startDate` et `endDate`
- Appelle `onDateSelect(null, null)`
- Masque l'estimation de prix

---

## 🎨 Légende du Calendrier

```jsx
<div className="flex gap-4 text-xs text-gray-600">
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full bg-gray-900"></div>
    <span>Dates sélectionnées</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full bg-gray-100"></div>
    <span>Plage sélectionnée</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1px] h-5 bg-red-400 rotate-45"></div>
      </div>
    </div>
    <span>Dates déjà prises</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full text-gray-300">✗</div>
    <span>Dates passées</span>
  </div>
</div>
```

---

## 🧪 Cas d'Usage

### Cas 1 : Terrain Complètement Réservé un Jour

**Scenario** : Le 20 décembre, tous les créneaux (8h→22h) sont pris

**Résultat** :
- Date "20" affichée avec barre rouge diagonale
- Tooltip : "Déjà réservé"
- Non cliquable
- `cursor-not-allowed`

---

### Cas 2 : Terrain Fermé le Lundi

**Scenario** : Le terrain est fermé tous les lundis

**Résultat** :
- Tous les lundis affichés en gris clair
- Texte barré (`line-through`)
- Tooltip : "Terrain fermé"
- Ajoutés au `bookedDates` Set

---

### Cas 3 : Sélection Plage 3 Nuits

**Actions** :
1. Utilisateur clique "19 déc" → Date début
2. Utilisateur clique "22 déc" → Date fin
3. Dates 19, 20, 21, 22 surlignées
4. Calcul : 3 nuits
5. Prix : 15 000 × 3 = 45 000 FCFA

**Affichage** :
```
15 000 FCFA x 3 nuits
= 45 000 FCFA
```

---

## ⚠️ Gestion des Erreurs

### API Indisponible

```javascript
.catch(err => {
  console.error(`Erreur date ${dateString}:`, err);
  return dateString; // Continue avec les autres dates
});
```

**Comportement** : Si une requête échoue, les autres dates sont quand même chargées.

---

### Pas de Disponibilités

```javascript
if (loading) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
```

**Affichage** : Spinner pendant le chargement des 60 jours.

---

## 🚀 Déploiement

### Fichiers Modifiés

| Fichier | Action | Description |
|---------|--------|-------------|
| `DateRangePicker.jsx` | ✅ Créé | Calendrier 2 mois avec dates barrées |
| `BookingCard.jsx` | ✅ Modifié | Intégration calendrier dropdown |

### Commandes

```bash
git add -A
git commit -m "feat: Calendrier interactif Airbnb avec dates réservées barrées"
git push
```

---

## 📊 Résultat Final

### Avant

```
┌──────────────────┐
│ Date: [input]    │
│ [Réserver]       │
└──────────────────┘
```

### Après (Style Airbnb)

```
┌────────────────────────────────┐
│ ARRIVÉE    │  DÉPART            │
│ 19/12/2025 │  21/12/2025     [X]│
│ (clic → calendrier dropdown)   │
├────────────────────────────────┤
│  2 nuits                       │
│  19 déc. 2025 - 21 déc. 2025  │
│  [Effacer dates]               │
├────────────────────────────────┤
│  [Dec 2025]    [Jan 2026]      │
│   L M M J V S D                │
│   ... avec dates barrées ...   │
├────────────────────────────────┤
│  ⚫ Sélectionnées               │
│  ❌ Déjà prises                │
│  ✗ Passées                     │
├────────────────────────────────┤
│  15 000 FCFA x 2 nuits         │
│  = 30 000 FCFA                 │
│  [RÉSERVER]                    │
└────────────────────────────────┘
```

---

## ✨ Avantages UX

✅ **Visibilité instantanée** des dates disponibles/prises  
✅ **Sélection intuitive** (clic → clic)  
✅ **Calcul automatique** du prix  
✅ **Design familier** (identique à Airbnb)  
✅ **Responsive** mobile/desktop  
✅ **Feedback visuel clair** (couleurs + barres)  
✅ **Fermeture intelligente** (auto + clic dehors)  

---

## 🎊 Succès !

Le calendrier est maintenant **100% fonctionnel** avec :
- ✅ Dates réservées **barrées en rouge**
- ✅ Intégration API réelle
- ✅ Design identique à Airbnb
- ✅ Calcul prix automatique
- ✅ UX fluide et intuitive

**Les utilisateurs peuvent maintenant voir immédiatement quelles dates sont disponibles ou prises ! 📅⚽🇸🇳**

