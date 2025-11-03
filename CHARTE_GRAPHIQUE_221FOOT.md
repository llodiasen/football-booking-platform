# 🎨 Charte Graphique 221FOOT

## 📋 Guide Complet de Design System

Document de référence pour maintenir la cohérence visuelle et l'identité de marque de **221FOOT**.

---

## 🎯 Identité de Marque

### Nom
**221FOOT**
- Toujours en MAJUSCULES
- Pas d'espaces
- Indicatif téléphonique du Sénégal (221) + FOOT

### Baseline
"Réservez votre terrain de football au Sénégal"

### Valeurs
- ⚽ Passion du football
- 🇸🇳 Fierté sénégalaise
- 💚 Simplicité et accessibilité
- 🤝 Communauté et partage

---

## 🎨 Couleurs

### Couleur Principale : Vert

| Nom | Hex | Tailwind | Utilisation |
|-----|-----|----------|-------------|
| Vert Très Clair | `#f0fdf4` | `green-50` | Fonds légers, badges |
| Vert Clair | `#dcfce7` | `green-100` | Hover léger, backgrounds |
| Vert 200 | `#bbf7d0` | `green-200` | Lignes décoratives, borders |
| Vert 400 | `#4ade80` | `green-400` | Accents, lignes |
| Vert 500 | `#22c55e` | `green-500` | Badges, highlights |
| **Vert Primary** | `#16a34a` | `green-600` | **Boutons, logo, liens** |
| Vert Hover | `#15803d` | `green-700` | **Hover boutons** |
| Vert Foncé | `#166534` | `green-800` | Textes foncés, emphasis |

### Couleurs Neutres

| Nom | Hex | Tailwind | Utilisation |
|-----|-----|----------|-------------|
| Blanc | `#ffffff` | `white` | Backgrounds, cartes |
| Gris 50 | `#f9fafb` | `gray-50` | Background section |
| Gris 100 | `#f3f4f6` | `gray-100` | Borders légers |
| Gris 200 | `#e5e7eb` | `gray-200` | Borders, séparateurs |
| Gris 400 | `#9ca3af` | `gray-400` | Placeholder, disabled |
| Gris 600 | `#4b5563` | `gray-600` | Texte secondaire |
| Gris 700 | `#374151` | `gray-700` | **Texte principal** |
| Gris 800 | `#1f2937` | `gray-800` | Top bar, headers |
| Gris 900 | `#111827` | `gray-900` | Texte très foncé |

### Couleurs Sémantiques

| Type | Couleur | Tailwind | Utilisation |
|------|---------|----------|-------------|
| Succès | Vert | `green-600` | Confirmations, succès |
| Info | Bleu | `blue-600` | Informations |
| Attention | Jaune | `yellow-500` | Avertissements |
| Erreur | Rouge | `red-600` | Erreurs, annulations |

---

## 📝 Typographie

### Police Principale
**Inter**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Hiérarchie des Titres

| Élément | Taille | Weight | Line Height | Tailwind |
|---------|--------|--------|-------------|----------|
| **H1** | 48-60px | Bold (700) | 1.1 | `text-5xl/text-6xl font-bold` |
| **H2** | 36-48px | Bold (700) | 1.2 | `text-4xl font-bold` |
| **H3** | 24-30px | Bold (700) | 1.3 | `text-2xl/text-3xl font-bold` |
| **H4** | 20-24px | Semibold (600) | 1.4 | `text-xl font-semibold` |
| **H5** | 18px | Semibold (600) | 1.5 | `text-lg font-semibold` |
| **H6** | 16px | Semibold (600) | 1.5 | `text-base font-semibold` |

### Corps de Texte

| Type | Taille | Weight | Tailwind |
|------|--------|--------|----------|
| **Large** | 18px | Normal (400) | `text-lg` |
| **Normal** | 16px | Normal (400) | `text-base` |
| **Small** | 14px | Normal (400) | `text-sm` |
| **Tiny** | 12px | Normal (400) | `text-xs` |

### Letterspacing

```css
h1, h2, h3, h4, h5, h6 {
  letter-spacing: -0.02em; /* Tighter */
}

.uppercase {
  letter-spacing: 0.05em; /* Wider */
}
```

---

## 🔲 Espacements

### Système de Grille
Base : **4px** (Tailwind spacing scale)

| Nom | Valeur | Tailwind | Utilisation |
|-----|--------|----------|-------------|
| **xs** | 4px | `1` | Micro-spacing |
| **sm** | 8px | `2` | Spacing serré |
| **md** | 12px | `3` | Spacing standard |
| **base** | 16px | `4` | **Défaut** |
| **lg** | 24px | `6` | Spacing large |
| **xl** | 32px | `8` | Spacing XL |
| **2xl** | 48px | `12` | Spacing XXL |
| **3xl** | 64px | `16` | Spacing très large |

### Padding Sections
```css
/* Mobile */
py-8 px-4  /* 32px vertical, 16px horizontal */

/* Desktop */
py-16 px-12  /* 64px vertical, 48px horizontal */

/* Hero */
py-20  /* 80px vertical */
```

### Gaps (Grids)
```css
gap-4   /* 16px - Serré */
gap-6   /* 24px - Standard */
gap-8   /* 32px - Large */
```

---

## 🔘 Boutons

### Types de Boutons

#### Primary
```jsx
<button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md">
  Réserver
</button>
```

#### Secondary
```jsx
<button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-lg transition-all">
  En savoir plus
</button>
```

#### Outline
```jsx
<button className="border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 font-medium px-6 py-3 rounded-lg transition-all">
  Annuler
</button>
```

#### Ghost
```jsx
<button className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-4 py-2 rounded-lg transition-all">
  Lien
</button>
```

### Tailles de Boutons

| Taille | Padding | Height | Tailwind |
|--------|---------|--------|----------|
| **sm** | `px-4 py-2` | 36px | `size="sm"` |
| **md** | `px-6 py-3` | 44px | (défaut) |
| **lg** | `px-8 py-4` | 52px | `size="lg"` |

### États

```css
/* Hover */
hover:bg-green-700
hover:shadow-md
transform hover:scale-105

/* Active */
active:scale-95

/* Disabled */
disabled:opacity-50
disabled:cursor-not-allowed

/* Focus */
focus:ring-2
focus:ring-green-500
focus:ring-offset-2
```

---

## 📦 Cartes (Cards)

### Card Standard
```jsx
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 p-6">
  {/* Contenu */}
</div>
```

### Card avec Image
```jsx
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
  <img src="..." className="w-full h-48 object-cover" />
  <div className="p-6">
    {/* Contenu */}
  </div>
</div>
```

### Borders Radius

| Type | Valeur | Tailwind |
|------|--------|----------|
| **Petit** | 6px | `rounded-md` |
| **Standard** | 8px | `rounded-lg` |
| **Large** | 12px | `rounded-xl` |
| **Très large** | 16px | `rounded-2xl` |
| **Full** | 9999px | `rounded-full` |

---

## 🖼️ Images

### Ratio d'Aspect

| Type | Ratio | Tailwind |
|------|-------|----------|
| **Paysage** | 16:9 | `aspect-video` |
| **Portrait** | 3:4 | `aspect-[3/4]` |
| **Carré** | 1:1 | `aspect-square` |
| **Terrain** | 4:3 | `aspect-[4/3]` |

### Effets

```css
/* Hover Zoom */
.group:hover img {
  transform: scale(1.1);
  transition: transform 0.7s ease;
}

/* Overlay */
.relative::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8));
}
```

---

## 🎯 Icônes

### Bibliothèque
**Lucide React**
```bash
npm install lucide-react
```

### Tailles

| Contexte | Taille | Props |
|----------|--------|-------|
| **Inline text** | 16px | `size={16}` |
| **Navigation** | 20px | `size={20}` |
| **Features** | 24px | `size={24}` |
| **Hero** | 32px | `size={32}` |
| **Decorative** | 48px+ | `size={48}` |

### Couleurs

```jsx
// Primary
<MapPin className="text-green-600" size={20} />

// Secondary
<Clock className="text-gray-600" size={20} />

// Success
<CheckCircle className="text-green-500" size={20} />

// Error
<XCircle className="text-red-500" size={20} />
```

---

## 🎭 Ombres (Shadows)

| Type | Tailwind | Utilisation |
|------|----------|-------------|
| **Subtle** | `shadow-sm` | Borders subtiles |
| **Standard** | `shadow-md` | Cartes, boutons |
| **Large** | `shadow-lg` | Modals, dropdowns |
| **XL** | `shadow-xl` | Hover states |
| **2XL** | `shadow-2xl` | Hero, emphasis |

---

## ⚡ Transitions & Animations

### Durées

| Type | Durée | Tailwind |
|------|-------|----------|
| **Rapide** | 150ms | `duration-150` |
| **Standard** | 300ms | `duration-300` |
| **Lent** | 500ms | `duration-500` |
| **Très lent** | 700ms | `duration-700` |

### Types de Transitions

```css
/* All */
transition-all

/* Colors */
transition-colors

/* Transform */
transition-transform

/* Shadow */
transition-shadow

/* Opacity */
transition-opacity
```

### Easing

```css
/* Standard */
ease-in-out  /* Défaut */

/* Smooth */
ease-out

/* Bounce */
ease-in
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Taille | Tailwind | Appareil |
|------------|--------|----------|----------|
| **xs** | < 640px | (défaut) | Mobile portrait |
| **sm** | ≥ 640px | `sm:` | Mobile paysage |
| **md** | ≥ 768px | `md:` | Tablette |
| **lg** | ≥ 1024px | `lg:` | Desktop |
| **xl** | ≥ 1280px | `xl:` | Large desktop |
| **2xl** | ≥ 1536px | `2xl:` | Très large |

### Approche Mobile-First

```jsx
// Mobile par défaut
<div className="px-4 py-8">

// Tablette (md)
<div className="px-4 md:px-8 py-8 md:py-12">

// Desktop (lg)
<div className="px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-20">
```

---

## 📐 Layouts

### Container

```css
.container-custom {
  width: 100%;
  margin: 0 auto;
  padding-left: 1rem;   /* 16px mobile */
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container-custom {
    padding-left: 1.5rem;  /* 24px tablette */
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 3rem;  /* 48px desktop */
    padding-right: 3rem;
  }
}

@media (min-width: 1280px) {
  .container-custom {
    padding-left: 4rem;  /* 64px large */
    padding-right: 4rem;
  }
}
```

### Grids

```css
/* 2 colonnes */
.grid-cols-2

/* 3 colonnes desktop, 1 mobile */
.grid md:grid-cols-3 gap-6

/* 4 colonnes */
.grid md:grid-cols-2 lg:grid-cols-4 gap-8
```

---

## 🎨 Composants Spécifiques

### Logo
- Hexagone vert avec ballon
- Texte "221FOOT" en vert-600
- Sous-titre "Sénégal" en gris-600
- Taille : 40px de hauteur

### Header
- **Top Bar** : Gris-800, hauteur 40px
- **Main Bar** : Blanc, hauteur 64px
- **Sticky** : `position: sticky; top: 0; z-index: 50`

### Footer
- Fond : Gris-900
- Texte : Blanc/Gris-300
- 4 colonnes sur desktop
- Liens : hover vert-400

### Badges
```jsx
// Taille terrain
<span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
  5x5
</span>

// Nouveau
<span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
  <Sparkles size={12} /> Nouveau
</span>

// Promo
<span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
  -20%
</span>
```

---

## ✅ Checklist de Conformité

### Pour Chaque Page

- [ ] Utilise la palette de couleurs verte
- [ ] Police Inter appliquée
- [ ] Espacements cohérents (multiple de 4px)
- [ ] Boutons avec transitions
- [ ] Hover states définis
- [ ] Responsive mobile-first
- [ ] Container full-width avec padding adaptatif
- [ ] Ombres subtiles sur les cartes
- [ ] Icônes Lucide React
- [ ] Border-radius cohérents (8px, 12px, 16px)

### Pour Chaque Composant

- [ ] Couleur primaire : green-600
- [ ] Hover : green-700
- [ ] Texte : gray-700
- [ ] Background : white ou gray-50
- [ ] Transitions : 300ms
- [ ] Focus visible
- [ ] States accessibles (hover, active, disabled)

---

## 🚀 Utilisation

### Import CSS Global

```css
/* Dans index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
    font-family: 'Inter', sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
    letter-spacing: -0.02em;
  }
}
```

### Classes Utilitaires Custom

```css
@layer utilities {
  .container-custom {
    @apply w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16;
  }
  
  .btn-primary {
    @apply bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 p-6;
  }
}
```

---

## 📊 Exemples de Code

### Section Hero
```jsx
<div className="bg-gradient-to-br from-green-600 to-green-800 py-20">
  <div className="container-custom text-center">
    <h1 className="text-5xl font-bold text-white mb-4">
      Réservez Votre Terrain
    </h1>
    <p className="text-xl text-white/90 mb-8">
      Des terrains de football partout au Sénégal 🇸🇳
    </p>
    <button className="btn-primary">
      Rechercher un terrain
    </button>
  </div>
</div>
```

### Card Terrain
```jsx
<div className="card group cursor-pointer">
  <div className="relative h-56 -m-6 mb-4 overflow-hidden">
    <img 
      src={terrain.image} 
      alt={terrain.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
      {terrain.size}
    </div>
  </div>
  
  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
    {terrain.name}
  </h3>
  
  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
    <MapPin size={16} />
    <span>{terrain.city}</span>
  </div>
  
  <div className="flex items-center justify-between">
    <div className="text-2xl font-bold text-green-600">
      {terrain.price.toLocaleString()} FCFA
      <span className="text-sm text-gray-500 font-normal">/h</span>
    </div>
    <Star className="text-yellow-500 fill-yellow-500" size={20} />
  </div>
</div>
```

---

## 🎊 Résultat Final

Votre charte graphique **221FOOT** est maintenant complète et cohérente :

- ✅ **Identité forte** : Vert et football sénégalais
- ✅ **Cohérence visuelle** : Composants standardisés
- ✅ **Design moderne** : Minimaliste et professionnel
- ✅ **Accessibilité** : Contrastes et tailles appropriés
- ✅ **Responsive** : Mobile-first approach
- ✅ **Performance** : Transitions optimisées

---

📝 **Maintenu par** : Équipe 221FOOT  
📅 **Dernière mise à jour** : Novembre 2024  
📄 **Version** : 1.0

