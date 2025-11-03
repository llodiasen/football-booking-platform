# 📊 Données des Terrains de Football

## 🏟️ Terrains de Dakar

Ce dossier contient les données de **50 terrains de football à Dakar** prêts à être importés dans la base de données MongoDB.

### 📁 Fichier : `terrains-dakar.json`

Liste complète des terrains avec :
- **Nom du terrain**
- **Localisation** (ville, quartier, adresse)
- **Contact** (téléphone, email)
- **Tarifs** (prix par heure)
- **Horaires** d'ouverture (pour chaque jour de la semaine)
- **Équipements** (vestiaires, éclairage, parking, etc.)
- **Type de surface** (Gazon synthétique, gazon naturel, stabilisé, sable)
- **Capacité** (nombre de joueurs)
- **Géolocalisation** (coordonnées GPS)
- **Description** et avis

---

## 🚀 Comment Importer les Terrains

### Méthode 1 : Script Automatique (Recommandé)

```bash
# Depuis le dossier backend
cd C:\Users\wopal\Desktop\football-booking-platform\backend

# Exécuter le script d'import
node src/scripts/seedTerrainsDakar.js
```

**Ce que fait le script** :
- ✅ Se connecte à MongoDB Atlas
- ✅ Vérifie si chaque terrain existe déjà (par nom)
- ✅ N'ajoute que les **nouveaux terrains**
- ✅ Affiche un résumé détaillé
- ✅ Compte le nombre total de terrains dans la base

**Résultat attendu** :
```
╔═══════════════════════════════════════════════════════════╗
║                    RÉSUMÉ DE L'IMPORT                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ✅ Terrains ajoutés       :  50                        ║
║   ⚠️  Terrains existants     :   0                        ║
║   ❌ Erreurs                :   0                        ║
║   📊 Total traité           :  50                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📦 Total de terrains dans la base de données : 50
```

---

### Méthode 2 : Via l'API (Manuel)

```bash
# Démarrer le serveur backend
npm run dev

# Dans un autre terminal ou avec Postman
POST http://localhost:5000/api/terrains

# Body (JSON) : Copier-coller un terrain du fichier terrains-dakar.json
```

---

## 📊 Liste des 50 Terrains

| # | Nom | Quartier | Prix/h | Surface | Téléphone |
|---|-----|----------|---------|---------|-----------|
| 1 | Complexe Be Sport | Dakar | 20,000 | Gazon synthétique | 77 572 77 77 |
| 2 | Terrain ASC Liberté 6 | Liberté 6 | 15,000 | Gazon naturel | 77 120 08 30 |
| 3 | Land Scat Urbam | Dakar | 12,000 | Stabilisé | - |
| 4 | Terrain de foot Centre Aéré BCEAO | Dakar | 18,000 | Gazon naturel | 77 155 30 33 |
| 5 | Terrain de Foot Liberté 5 ASC Yego | Liberté 5 | 12,000 | Stabilisé | - |
| 6 | Terrain Football Castors | Castors | 16,000 | Gazon synthétique | 77 194 58 76 |
| 7 | Terrain Niary Tally | Niary Tally | 10,000 | Stabilisé | 77 609 17 52 |
| 8 | Terrain ASC Ceely | Mboupy POB | 10,000 | Stabilisé | 77 907 31 92 |
| 9 | Terrain de Football U25 ASC Yengouleen | Parcelles Assainies | 12,000 | Stabilisé | - |
| 10 | Terrain Sud Foire | Sud Foire | 15,000 | Stabilisé | - |
| 11 | Terrain Doudou | Parcelles Assainies | 10,000 | Stabilisé | - |
| 12 | Terrain de foot Sacré Cœur V3 | Sacré-Cœur 3 | 18,000 | Gazon synthétique | - |
| 13 | Terrain de football de la Base Aérienne | Base Aérienne | 20,000 | Gazon naturel | - |
| 14 | Terrain ACAPES | Dakar | 12,000 | Stabilisé | 77 163 83 93 |
| 15 | Dioulikaye Ouakam | Ouakam | 8,000 | Sable | - |
| 16 | Terrain de Foot ASC Nord Foire | Nord Foire | 12,000 | Stabilisé | - |
| 17 | VDN Foot | VDN | 18,000 | Gazon synthétique | - |
| 18 | Terrain Nord Foire | Nord Foire | 12,000 | Stabilisé | 77 526 96 15 |
| 19 | Terrain Nguélaw | Nguélaw | 8,000 | Sable | 77 344 05 14 |
| 20 | Stade Deggo | Dakar | 20,000 | Gazon naturel | 77 347 53 59 |
| 21 | Soprim Football Field | Dakar | 15,000 | Gazon synthétique | - |
| 22 | Terrain Yoonou Ndam | Dakar | 10,000 | Stabilisé | - |
| 23 | Terrain Liberté 4 | Liberté 4 | 15,000 | Gazon synthétique | 77 667 91 96 |
| 24 | Terrain de football École Police Dakar | École de Police | 25,000 | Gazon naturel | 78 455 75 75 |
| 25 | Terrain de football Captage | Captage | 12,000 | Stabilisé | - |
| 26 | Terrain de foot Unité 18 | Parcelles Assainies | 10,000 | Stabilisé | - |
| 27 | Terrain de foot Sacat Urbam | Sacat Urbam | 12,000 | Stabilisé | - |
| 28 | Terrain Foot HLM Patte d'Oie | HLM Patte d'Oie | 12,000 | Stabilisé | - |
| 29 | DSC (Dakar Sacré Cœur) | Sacré-Cœur | 30,000 | Gazon naturel | 33 825 64 04 |
| 30 | Municipal Land Ouakam | Ouakam | 8,000 | Sable | 70 807 34 73 |
| 31 | Terrain Naria | Dakar | 12,000 | Stabilisé | - |
| 32 | Terrain de foot Soowu Jant | Nord Foire | 12,000 | Stabilisé | 77 021 82 82 |
| 33 | Temple Football | Dakar | 18,000 | Gazon synthétique | 77 323 87 87 |
| 34 | Terrain ASFA | Nord | 12,000 | Stabilisé | - |
| 35 | Terrain de Foot Ball (Diankalar) | Diankalar | 12,000 | Stabilisé | - |
| 36 | Terrain Talibou Dabo | Grand Dakar | 10,000 | Stabilisé | - |
| 37 | Terrain Football Camberene | Camberene | 10,000 | Stabilisé | - |
| 38 | Terrain Football Hamo 2 | Hamo 2 | 10,000 | Stabilisé | - |
| 39 | Terrain JA | Dakar | 12,000 | Stabilisé | - |
| 40 | Terrain ODB | Dakar | 12,000 | Stabilisé | - |
| 41 | Terrain de foot Sacré Cœur 3 extension | Sacré-Cœur 3 | 16,000 | Gazon synthétique | - |
| 42 | TERRAIN PEPS Point E | Point E | 18,000 | Gazon synthétique | - |
| 43 | Terrain Football travaux | Nord Foire | 12,000 | Stabilisé | - |
| 44 | Terrain Polyvalent Sicap Baobab | Sicap Baobab | 10,000 | Stabilisé | 77 676 95 05 |
| 45 | Land Soccer Solarcom | Dakar | 15,000 | Gazon synthétique | 77 536 60 39 |
| 46 | SowFoot | Central Park | 22,000 | Gazon synthétique | 77 226 08 47 |
| 47 | Terrain Thiossane de Pikine | Thiossane | 10,000 | Stabilisé | - |

---

## 📈 Statistiques

### Par Type de Surface
- 🟢 **Gazon synthétique** : 12 terrains (24%)
- 🌱 **Gazon naturel** : 6 terrains (12%)
- 🏗️ **Stabilisé** : 28 terrains (56%)
- 🏖️ **Sable** : 4 terrains (8%)

### Par Gamme de Prix (FCFA/heure)
- 💰 **Économique** (8,000 - 12,000) : 32 terrains (64%)
- 💵 **Moyen** (15,000 - 20,000) : 14 terrains (28%)
- 💎 **Premium** (22,000 - 30,000) : 4 terrains (8%)

### Par Capacité
- 👥 **Football 5-7** (14 joueurs) : 44 terrains (88%)
- ⚽ **Football 11** (22 joueurs) : 6 terrains (12%)

---

## 🔄 Mise à Jour des Données

Si vous voulez ajouter de nouveaux terrains ou modifier les existants :

1. **Modifier le fichier** `terrains-dakar.json`
2. **Relancer le script** `seedTerrainsDakar.js`
3. Le script n'ajoutera que les **nouveaux terrains**

---

## ⚙️ Structure d'un Terrain

```json
{
  "nom": "Nom du terrain",
  "ville": "Dakar",
  "quartier": "Nom du quartier",
  "adresse": "Adresse complète",
  "telephone": "77 XXX XX XX",
  "email": "contact@terrain.sn",
  "description": "Description du terrain",
  "type": "Football",
  "surface": "Gazon synthétique",
  "capacite": 14,
  "equipements": ["Vestiaires", "Éclairage nocturne", "Parking"],
  "prixHeure": 15000,
  "horaires": {
    "lundi": { "ouverture": "08:00", "fermeture": "22:00" },
    "mardi": { "ouverture": "08:00", "fermeture": "22:00" },
    ...
  },
  "images": [],
  "geolocalisation": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}
```

---

## 🆘 Problèmes Courants

### Erreur : "Terrain existant"
**Cause** : Le terrain est déjà dans la base de données  
**Solution** : C'est normal ! Le script évite les doublons

### Erreur : "Validation failed"
**Cause** : Champ obligatoire manquant  
**Solution** : Vérifiez la structure du terrain dans le JSON

### Erreur : "Cannot connect to MongoDB"
**Cause** : Problème de connexion MongoDB  
**Solution** : Vérifiez que le serveur backend est arrêté et que `.env` est correct

---

## 📝 Notes

- Les prix sont en **Francs CFA (FCFA)**
- Les horaires sont au format 24h (HH:MM)
- Les coordonnées GPS sont au format [longitude, latitude]
- Les terrains sans numéro de téléphone ont le champ vide `""`

---

**Dernière mise à jour** : 3 Novembre 2025  
**Source** : Google Maps - Terrains de football à Dakar

