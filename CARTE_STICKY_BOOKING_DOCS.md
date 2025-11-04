# 🗺️ Carte Full-Width + Bouton Réserver Sticky - Documentation

**Features** : Carte pleine largeur style Airbnb + Bouton réserver sticky dans header  
**Date** : 4 Novembre 2025  

---

## 🎯 Objectifs

1. **Carte avec cercle rose translucide** → Style Google Maps / Airbnb
2. **Carte pleine largeur** → Occupe toute la largeur de l'écran
3. **Bouton "Réserver" sticky** → Apparaît dans le header au scroll

---

## 🗺️ 1. Carte Style Airbnb

### Améliorations Visuelles

#### Marqueur Rouge
```javascript
const redIcon = new L.Icon({
  iconUrl: 'marker-icon-2x-red.png',
  // ...
});
```

#### Cercle Rose Translucide
```jsx
<Circle
  center={center}
  radius={300}
  pathOptions={{
    color: '#FF385C',      // Rose Airbnb
    fillColor: '#FF385C',
    fillOpacity: 0.15,     // Très translucide
    weight: 1,
    opacity: 0.3
  }}
/>
```

**Résultat** : Un cercle rose pâle de 300m de rayon autour du marqueur

#### Badge "Emplacement vérifié"
```jsx
<div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg px-4 py-2.5">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-red-500 rounded-full">
      <CheckCircle className="text-white" />
    </div>
    <span>Emplacement vérifié</span>
  </div>
</div>
```

**Visuel** :
```
┌─────────────────────────┐
│    🔴 ✓                 │
│    Emplacement vérifié  │
└─────────────────────────┘
```

---

## 📐 2. Carte Pleine Largeur

### Stratégie de Layout

La carte doit **sortir** du layout 2 colonnes et occuper 100% de la largeur.

#### Technique des Marges Négatives

```jsx
<section className="mt-16 -mx-6 sm:-mx-10 lg:-mx-20">
  {/* Titre avec padding normal */}
  <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20">
    <h3>Où se situe le terrain</h3>
  </div>

  {/* Carte SANS padding → Pleine largeur */}
  <SingleTerrainMap terrain={terrain} />
</section>
```

**Explication** :
- `-mx-6 sm:-mx-10 lg:-mx-20` → Annule le padding du container parent
- Carte s'étend jusqu'aux bords de l'écran
- Titre et autres contenus gardent le padding normal

**Résultat** :
```
┌──────────────────────────────────────┐
│ [Container 1280px]                   │
│   Titre                               │
├──────────────────────────────────────┤
│ [CARTE PLEINE LARGEUR]                │
│ (pas de padding)                      │
├──────────────────────────────────────┤
│ [Container 1280px]                   │
│   Points forts quartier               │
└──────────────────────────────────────┘
```

---

## 📌 3. Bouton "Réserver" Sticky

### Composant StickyBookingBar

**Comportement** :
- Caché par défaut
- Apparaît après **400px de scroll**
- Fixed en haut de l'écran (`z-[100]`)
- Animation `translate-y`

#### Détection du Scroll

```javascript
useEffect(() => {
  const handleScroll = () => {
    setIsVisible(window.scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

#### Animation CSS

```jsx
<div className={`
  fixed top-0 left-0 right-0 
  transition-all duration-300 
  ${isVisible ? 'translate-y-0' : '-translate-y-full'}
`}>
```

**États** :
- `translate-y-0` → Visible (glisse vers le bas)
- `-translate-y-full` → Caché (au-dessus de l'écran)

---

### Layout du Bar Sticky

```
┌────────────────────────────────────────────────────┐
│ [IMG] Nom terrain         15 000 FCFA/h [RÉSERVER] │
│       ★ 4.9 (518 avis)                    [♡] [⚷]  │
└────────────────────────────────────────────────────┘
```

**Éléments** :
1. **Gauche** : Miniature + Nom + Note
2. **Droite** : Prix + Bouton "Réserver" + Actions (Partager, Favoris)

#### Responsive

```jsx
// Mobile
<div className="hidden sm:block">Prix</div>
<div className="hidden md:flex">Actions</div>

// Toujours visible
<button>Réserver</button>
```

**Priorités** :
- **Mobile** : Miniature + Note + Bouton Réserver
- **Tablette** : + Prix
- **Desktop** : + Actions (Partager, Favoris)

---

## 🎨 Styles et Couleurs

### Bouton "Réserver" (identique dans sticky et card)

```css
bg-gradient-to-r from-pink-500 to-red-500
hover:from-pink-600 hover:to-red-600
shadow-lg hover:shadow-xl
```

**Couleurs Airbnb** :
- Rose : `#FF385C` (`pink-500`)
- Rouge : `#E61E4D` (`red-500`)

### Bar Sticky

```css
bg-white
border-b border-gray-200
shadow-md
z-[100]
```

**Z-index** : `100` pour être au-dessus de tout (sauf modals)

---

## 📱 Responsive Breakpoints

| Écran | Carte | Bar Sticky |
|-------|-------|-----------|
| **Mobile < 640px** | Pleine largeur, 450px hauteur | Miniature + Bouton |
| **Tablette 640-1024px** | Pleine largeur, 450px hauteur | + Prix affiché |
| **Desktop > 1024px** | Pleine largeur, 450px hauteur | + Actions (♡, ⚷) |

---

## 🔄 Workflow Utilisateur

### Arrivée sur la Page

```
1. Page charge
   ↓
2. Bar sticky CACHÉ (translate-y-full)
   ↓
3. Utilisateur scrolle
   ↓
4. Scroll > 400px → Bar sticky APPARAÎT
   ↓
5. Utilisateur voit : Nom + Prix + [RÉSERVER]
   ↓
6. Clic sur "Réserver" → Redirection /booking/:id
```

### Scroll Inverse

```
Utilisateur remonte
   ↓
Scroll < 400px
   ↓
Bar sticky DISPARAÎT (translate-y-full)
   ↓
Retour à l'affichage normal
```

---

## 🗺️ Comparaison Avant/Après Carte

| **Avant** | **Après (Airbnb)** |
|-----------|-------------------|
| Carte 350px hauteur | Carte 450px hauteur |
| Marqueur vert | Marqueur **rouge** |
| Pas de cercle | **Cercle rose translucide** |
| Carte dans colonne 2/3 | Carte **pleine largeur** |
| Badge simple | Badge "**Emplacement vérifié**" |

---

## 📌 Comparaison Avant/Après Bouton

| **Avant** | **Après (Airbnb)** |
|-----------|-------------------|
| Bouton uniquement dans BookingCard | Bouton **aussi dans sticky bar** |
| Toujours visible (sidebar sticky) | **Apparaît au scroll** |
| Pas d'info dans header | **Nom + Prix + Bouton visible** |

---

## 📦 Fichiers Modifiés/Créés

| Fichier | Action | Description |
|---------|--------|-------------|
| `SingleTerrainMap.jsx` | ✅ Modifié | + Cercle rose, marqueur rouge, badge vérifié |
| `TerrainDetails.jsx` | ✅ Modifié | Carte full-width, intégration sticky bar |
| `StickyBookingBar.jsx` | ✅ Créé | Bar sticky avec bouton réserver |

---

## 🧪 Tests

### Test 1 : Carte Pleine Largeur

✅ **Vérifier** : La carte touche les bords gauche et droite de l'écran  
✅ **Vérifier** : Le titre "Où se situe le terrain" a un padding normal  
✅ **Vérifier** : Le cercle rose est visible autour du marqueur  
✅ **Vérifier** : Le badge "Emplacement vérifié" est en bas à gauche  

### Test 2 : Sticky Bar au Scroll

✅ **Vérifier** : Bar caché au chargement  
✅ **Vérifier** : Bar apparaît après 400px de scroll  
✅ **Vérifier** : Animation fluide (translate-y)  
✅ **Vérifier** : Bouton "Réserver" fonctionne  
✅ **Vérifier** : Responsive (éléments cachés sur mobile)  

---

## 🎊 Résultat Final

### Carte Style Airbnb

```
┌─────────────────────────────────────┐
│                                     │
│         🔴 (Marqueur rouge)         │
│        ⭕ (Cercle rose)             │
│                                     │
│  [🔴✓ Emplacement vérifié]         │
│                      [📍 Itinéraire]│
└─────────────────────────────────────┘
```

### Sticky Bar (Au Scroll)

```
┌────────────────────────────────────────┐
│ 🖼️ VDN Foot  15K FCFA/h  [RÉSERVER] ♡ │
│    ★ 4.9                                │
└────────────────────────────────────────┘
```

---

## ✨ Avantages UX

✅ **Carte immersive** → Pleine largeur = plus d'espace pour explorer  
✅ **Visibilité du lieu** → Cercle rose = zone approximative claire  
✅ **Confiance** → Badge "Emplacement vérifié"  
✅ **Booking toujours accessible** → Sticky bar au scroll  
✅ **Design familier** → Identique à Airbnb  
✅ **Performance** → 1 seul event listener scroll  

---

## 🚀 Déploiement

```bash
git add -A
git commit -m "feat: Carte pleine largeur + Bouton réserver sticky style Airbnb"
git push
```

Vercel déploiera automatiquement :
- ✅ Carte avec cercle rose
- ✅ Carte pleine largeur
- ✅ Sticky booking bar

---

## 🎉 C'est Prêt !

La page de détails terrain offre maintenant :
- 🗺️ **Carte immersive** pleine largeur avec cercle rose Airbnb
- 📌 **Bouton "Réserver" sticky** toujours accessible au scroll
- ✅ **Badge "Emplacement vérifié"** rassurant
- 🎨 **Design 100% Airbnb** professionnel

**L'utilisateur peut explorer la carte en grand ET réserver facilement à tout moment ! ⚽🗺️🇸🇳**

