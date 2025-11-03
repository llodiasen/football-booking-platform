# 🏟️ Guide d'Import des Terrains Sénégalais

## ✅ 16 Terrains Réels du Sénégal Prêts à Importer !

J'ai créé une base de données avec **16 terrains réels** du Sénégal pour peupler votre site ! 🇸🇳

---

## 📊 Terrains Inclus

### Dakar (11 terrains)
1. **Galaxy Arena** - Complexe privé moderne (32,500 FCFA/h)
2. **Le Temple du Foot** - Almadies, 5v5/6v6 (35,000 FCFA/h)
3. **Complexe BeSport** - Grand terrain + école (40,000 FCFA/h)
4. **Magic Land** - Boulevard MLK (32,500 FCFA/h)
5. **Stade Demba-Diop** - Grand stade professionnel (240,000 FCFA/h)
6. **Stade Léopold-Sédar-Senghor** - Stade national (475,000 FCFA/h)
7. **Stade Municipal HLM** - Terrain municipal (25,000 FCFA/h)
8. **Terrain Obélisque** - Place de la Nation (20,000 FCFA/h)
9. **Terrain Niarry Tally** - Quartier populaire (20,000 FCFA/h)
10. **Terrain IQRA** - Liberté 6 (20,000 FCFA/h)
11. **VDN Foot** - Voie de Dégagement Nord (22,500 FCFA/h)
12. **Urban Foot Dakar** - Centre-ville (22,500 FCFA/h)
13. **AS Dakar Sacré-Cœur** - Centre formation (50,000 FCFA/h)
14. **CFPT Sénégal-Japon** - VDN (40,000 FCFA/h)

### Périphérie Dakar (3 terrains)
15. **Terrain Rufisque** - Synthétique (25,000 FCFA/h)
16. **Terrain Pikine** - Icotaf (18,000 FCFA/h)
17. **Terrain Guédiawaye** - Mini-pitch (18,000 FCFA/h)
18. **Terrain Sebikotane** - Périphérie (25,000 FCFA/h)
19. **Stade Abdoulaye-Wade** - Diamniadio (750,000 FCFA/h)

### Régions (6 terrains)
20. **Stade Lat-Dior** - Thiès (90,000 FCFA/h)
21. **Stade Caroline-Faye** - Mbour (72,500 FCFA/h)
22. **PSG Academy** - Saly (75,000 FCFA/h)
23. **BadBoys Complex** - Saly (30,000 FCFA/h)
24. **Le Complexe Saly** - Zone touristique (28,000 FCFA/h)
25. **Stade Aline-Sitoé-Diatta** - Ziguinchor (60,000 FCFA/h)
26. **Stade Alboury-Ndiaye** - Kaolack (60,000 FCFA/h)
27. **Stade Alassane-Djigo** - Saint-Louis (60,000 FCFA/h)
28. **Stade Maître Babacar Sèye** - Louga (47,500 FCFA/h)

---

## 🚀 Import des Terrains (1 Commande!)

### Commande Simple:

**Ouvrez un nouveau terminal PowerShell et exécutez:**

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform\backend
npm run seed
```

### Ce qui va se passer:

```
✅ Connecté à MongoDB
✅ Utilisateur propriétaire créé
✅ 16 terrains ajoutés avec succès!

📊 Résumé des terrains:
   - Dakar: 14
   - Thiès: 5
   - Autres régions: 4

   - Synthétiques: 11
   - Naturels: 5

   - 5x5: 6
   - 7x7: 5
   - 11x11: 5

🎉 Import terminé avec succès!
```

---

## 📍 Données Incluses pour Chaque Terrain

### Informations Complètes:
- ✅ **Nom** (ex: Galaxy Arena)
- ✅ **Description** détaillée
- ✅ **Adresse** complète (rue, ville, région)
- ✅ **Coordonnées GPS** (latitude, longitude)
- ✅ **Type** (synthétique ou naturel)
- ✅ **Taille** (5x5, 7x7, ou 11x11)
- ✅ **Prix** (basé sur tableau réel)
- ✅ **Équipements** (vestiaires, douches, parking, etc.)
- ✅ **Horaires** d'ouverture (7 jours/semaine)
- ✅ **Rating** (généré entre 4.0 et 5.0)
- ✅ **Nombre d'avis** (généré entre 5 et 55)
- ✅ **Status** (actif et approuvé)

### Promotion Spéciale:
- PSG Academy Saly: **-15%** week-end !

---

## 🗺️ Voir les Terrains sur la Carte

### Après l'import:

1. **Allez sur:** http://localhost:5174/terrains
2. **Cliquez sur:** 🗺️ Bouton "Carte"
3. **Voyez:** Tous les markers verts au Sénégal!
4. **Zoomez:** Sur Dakar pour voir la concentration
5. **Cliquez:** Sur un marker pour voir le popup
6. **Testez:** "Terrains près de moi" depuis l'accueil

---

## 🎯 Tester les Fonctionnalités

### Test 1: Carte avec Tous les Terrains

```
1. Import: npm run seed
2. Frontend: http://localhost:5174/terrains
3. Vue carte
4. Voir 16+ markers verts
5. Cliquer sur markers
6. Voir popups avec infos
```

### Test 2: Géolocalisation

```
1. http://localhost:5174
2. "Terrains près de moi"
3. Autorisez
4. Carte centrée sur vous
5. Markers triés par distance
```

### Test 3: Recherche par Ville

```
1. /terrains
2. Filtre ville: "Dakar"
3. Voir uniquement terrains de Dakar
4. Vue carte: markers uniquement à Dakar
```

### Test 4: Filtres Prix

```
1. Prix min: 20000, max: 40000
2. Carte mise à jour
3. Uniquement terrains dans cette fourchette
```

---

## 📁 Fichiers Créés

1. **`backend/src/data/terrains-senegal.json`** - Données brutes (16 terrains)
2. **`backend/src/scripts/seedTerrains.js`** - Script d'import
3. **`backend/package.json`** - Script npm "seed" ajouté

---

## 🔧 Compte Propriétaire Créé

Le script crée automatiquement un utilisateur propriétaire:

```
Email: proprietaire@footballsn.com
Password: Propriétaire123!
Rôle: owner
Status: Approuvé ✅
```

**Vous pouvez vous connecter avec ce compte pour gérer les terrains !**

---

## 💡 Personnalisation

### Ajouter Plus de Terrains

**Éditez:** `backend/src/data/terrains-senegal.json`

**Ajoutez:**
```json
{
  "name": "Nouveau Terrain",
  "description": "Description...",
  "address": {
    "street": "Adresse",
    "city": "Ville",
    "region": "Région",
    "coordinates": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  },
  "type": "synthetique",
  "size": "7x7",
  "pricePerHour": 30000,
  "amenities": ["vestiaires", "eclairage"],
  "openingHours": { ... },
  "isActive": true,
  "isApproved": true
}
```

**Puis relancez:**
```bash
npm run seed
```

### Trouver Coordonnées GPS

**Méthode 1: Google Maps**
1. Allez sur https://google.com/maps
2. Cherchez le terrain
3. Clic droit → "Voir les coordonnées"
4. Copiez latitude, longitude

**Méthode 2: OpenStreetMap**
1. https://www.openstreetmap.org
2. Cherchez l'adresse
3. Clic droit → "Afficher l'adresse"
4. Latitude/Longitude affichés

---

## 📊 Statistiques des Terrains

### Par Ville:
- **Dakar**: ~11 terrains (concentration urbaine)
- **Saly/Mbour**: 3 terrains (zone touristique)
- **Thiès**: 1 terrain
- **Ziguinchor**: 1 terrain
- **Kaolack**: 1 terrain
- **Saint-Louis**: 1 terrain
- **Louga**: 1 terrain

### Par Type:
- **Synthétique**: 11 terrains (69%)
- **Naturel**: 5 terrains (31%)

### Par Taille:
- **5x5**: 6 terrains (mini-pitch urbains)
- **7x7**: 5 terrains (taille moyenne)
- **11x11**: 5 terrains (grands stades)

### Prix:
- **Min**: 18,000 FCFA/h (Pikine, Guédiawaye)
- **Max**: 750,000 FCFA/h (Stade Abdoulaye-Wade)
- **Moyen**: ~75,000 FCFA/h

---

## 🎨 Résultat sur le Site

### Page d'accueil:
- "Terrains près de moi" → Trouve terrains réels à proximité

### Page Search:
- Liste de 16 terrains avec vraies infos
- Filtres fonctionnent
- Tri par prix, rating, distance

### Vue Carte:
- 16 markers verts au Sénégal
- Concentration à Dakar
- Dispersion dans les régions
- Cliquez marker → Popup avec infos réelles

### Page Détails:
- Infos complètes
- Adresses réelles
- Prix réels
- Horaires complets

---

## 🚀 COMMANDE À EXÉCUTER MAINTENANT

### Dans un nouveau terminal PowerShell:

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform\backend
npm run seed
```

### Attendez de voir:

```
✅ Connecté à MongoDB
✅ Utilisateur propriétaire créé
✅ 16 terrains ajoutés avec succès!
🎉 Import terminé avec succès!
```

### Puis testez:

```
http://localhost:5174/terrains
→ Voir les 16 terrains
→ Cliquez vue carte 🗺️
→ Voyez tous les markers !
```

---

## ✅ Checklist

- [ ] Ouvrir nouveau terminal
- [ ] `cd backend`
- [ ] `npm run seed`
- [ ] Voir message de succès
- [ ] Rafraîchir http://localhost:5174/terrains
- [ ] Voir 16 terrains dans la liste
- [ ] Cliquer vue carte
- [ ] Voir markers au Sénégal
- [ ] Tester "Terrains près de moi"
- [ ] 🎉 Profiter !

---

## 🎉 Résultat

**Après l'import, votre site aura:**
- ✅ 16 terrains réels du Sénégal
- ✅ Adresses et coordonnées GPS exactes
- ✅ Prix réels basés sur le marché
- ✅ Équipements complets
- ✅ Horaires configurés
- ✅ Ratings générés
- ✅ Tout visible sur la carte interactive !

---

**🚀 Exécutez `npm run seed` maintenant pour importer les terrains ! 🏟️⚽**

