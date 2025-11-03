# 📋 Guide - Règles de Réservation & Acomptes

## 🎯 Vue d'ensemble

Les propriétaires peuvent maintenant configurer des règles personnalisées pour leurs terrains afin de mieux gérer les réservations et protéger leurs revenus.

---

## ✅ Fonctionnalités Ajoutées

### 1. **💰 Acompte pour Valider la Réservation**

Les propriétaires peuvent exiger un paiement partiel ou total avant la confirmation de la réservation.

#### **Types d'acompte disponibles:**

**A. Pourcentage du montant total**
- Exemple : 50% du prix total
- Si réservation = 2h à 30,000 FCFA/h = 60,000 FCFA total
- Acompte requis = 30,000 FCFA (50%)

**B. Montant fixe**
- Exemple : 15,000 FCFA quel que soit la durée
- Si réservation = 2h à 30,000 FCFA/h = 60,000 FCFA total
- Acompte requis = 15,000 FCFA (fixe)

#### **Comment configurer:**

```
1. Dans le formulaire de terrain
2. Section "Règles de Réservation"
3. Cochez "Exiger un acompte pour valider la réservation"
4. Choisissez le type :
   - "Pourcentage (%)" → Entrez 50 pour 50%
   - "Montant fixe (FCFA)" → Entrez 15000
5. Un aperçu du calcul s'affiche automatiquement
```

---

### 2. **📋 Consignes pour les Clients**

Zone de texte libre (max 1000 caractères) pour communiquer les instructions importantes.

#### **Exemples de consignes:**

```
✅ Horaires
"Merci d'arriver 15 minutes avant l'heure de début pour récupérer 
les clés et accéder aux vestiaires."

✅ Équipement
"Pensez à apporter vos propres ballons et chasubles. 
Crampons interdits sur le gazon synthétique."

✅ Règles
"Le terrain doit être libéré à l'heure. Tout dépassement sera facturé.
Merci de laisser les vestiaires propres."

✅ Contact
"En cas de retard ou problème, contactez-nous au +221 77 123 45 67"

✅ Parking
"Parking gratuit disponible à l'entrée. Places limitées."
```

#### **Où apparaissent ces consignes :**
- ✅ Page de détails du terrain
- ✅ Page de réservation (avant paiement)
- ✅ Email de confirmation
- ✅ SMS de rappel

---

### 3. **⏱️ Durée de Réservation**

Contrôlez la durée minimum et maximum des réservations.

#### **Durée minimum:**
- Empêche les réservations trop courtes
- Exemple : Minimum 1 heure
- → Les clients ne peuvent pas réserver 30 minutes

#### **Durée maximum:**
- Empêche les réservations trop longues
- Exemple : Maximum 4 heures
- → Les clients ne peuvent pas réserver 8 heures d'affilée

#### **Configuration recommandée:**
```
Terrain 5x5 (Futsal):
- Minimum: 1 heure
- Maximum: 2 heures

Terrain 7x7:
- Minimum: 1 heure
- Maximum: 3 heures

Terrain 11x11:
- Minimum: 2 heures
- Maximum: 4 heures
```

---

### 4. **🚫 Politique d'Annulation**

Texte libre (max 500 caractères) pour définir les règles d'annulation.

#### **Exemples de politiques:**

**A. Flexible**
```
"Annulation gratuite jusqu'à 24h avant la réservation. 
L'acompte sera remboursé intégralement."
```

**B. Modérée**
```
"Annulation gratuite jusqu'à 48h avant la réservation.
Entre 24h et 48h : remboursement de 50% de l'acompte.
Moins de 24h : acompte non remboursable."
```

**C. Stricte**
```
"Annulation gratuite jusqu'à 7 jours avant la réservation.
Au-delà, l'acompte est non remboursable.
En cas de pluie, report possible sans frais."
```

---

## 💻 Structure des Données

### Backend (MongoDB Schema)

```javascript
bookingRules: {
  advancePayment: {
    required: Boolean,        // Acompte obligatoire ?
    amount: Number,           // Montant ou pourcentage
    type: String             // 'fixed' ou 'percentage'
  },
  instructions: String,       // Consignes (max 1000 caractères)
  minBookingDuration: Number, // Durée min en heures
  maxBookingDuration: Number, // Durée max en heures
  cancellationPolicy: String  // Politique (max 500 caractères)
}
```

### Exemple de Configuration Complète

```json
{
  "name": "Galaxy Arena",
  "pricePerHour": 32500,
  "bookingRules": {
    "advancePayment": {
      "required": true,
      "amount": 50,
      "type": "percentage"
    },
    "instructions": "Merci d'arriver 15 minutes avant l'heure de début pour récupérer les clés. Pensez à apporter vos ballons. Crampons interdits. Le terrain doit être libéré à l'heure exacte.",
    "minBookingDuration": 1,
    "maxBookingDuration": 3,
    "cancellationPolicy": "Annulation gratuite jusqu'à 48h avant. Entre 24h-48h : remboursement 50%. Moins de 24h : non remboursable."
  }
}
```

---

## 🎯 Workflow Complet (Côté Client)

### 1. **Client Sélectionne un Terrain**
- Voit le prix par heure : `32,500 FCFA/h`
- Voit les consignes dans l'encadré "Informations importantes"

### 2. **Client Choisit Date & Heure**
- Durée minimum : 1h
- Durée maximum : 3h
- → Ne peut réserver que entre 1h et 3h

### 3. **Page de Confirmation**
```
Résumé de la réservation
━━━━━━━━━━━━━━━━━━━━━━━━
Terrain: Galaxy Arena
Date: 15 Décembre 2024
Heure: 18:00 - 20:00 (2h)

Prix: 32,500 × 2h = 65,000 FCFA

⚠️ Acompte requis: 32,500 FCFA (50%)
   Solde à régler sur place: 32,500 FCFA

📋 Consignes:
Merci d'arriver 15 minutes avant l'heure...

🚫 Annulation:
Annulation gratuite jusqu'à 48h avant...
```

### 4. **Client Paie l'Acompte**
- Via Wave, Orange Money, ou Free Money
- Reçoit confirmation par email + SMS

### 5. **Jour de la Réservation**
- Client arrive 15 minutes avant (selon consignes)
- Paie le solde sur place
- Accède au terrain

---

## 📊 Avantages pour les Propriétaires

### ✅ Protection Financière
- Acompte réduit les no-shows (absences)
- Garantit un revenu minimum
- Dissuade les réservations non sérieuses

### ✅ Communication Claire
- Consignes visibles dès la réservation
- Évite les malentendus
- Réduit les litiges

### ✅ Gestion Optimisée
- Durées contrôlées = meilleure rotation
- Politique d'annulation claire
- Moins de temps perdu

---

## 🔧 Cas d'Usage Pratiques

### Cas 1: Terrain Premium (Galaxy Arena)
```
Prix: 35,000 FCFA/h
Acompte: 100% (paiement total d'avance)
Durée: 1-2h
Consignes: "Terrain indoor climatisé. Crampons interdits."
Annulation: "Remboursement 100% si annulation 72h avant"
```

### Cas 2: Terrain Quartier (Local)
```
Prix: 15,000 FCFA/h
Acompte: 30% (acompte partiel)
Durée: 1-4h
Consignes: "Paiement en espèces accepté sur place"
Annulation: "Annulation gratuite 24h avant"
```

### Cas 3: Terrain École de Football
```
Prix: 25,000 FCFA/h
Acompte: 10,000 FCFA (montant fixe)
Durée: 2-4h
Consignes: "Abonnements disponibles. Contactez-nous pour tarifs groupe."
Annulation: "Report gratuit en cas de pluie"
```

---

## ⚙️ Configuration Recommandée par Type

### 🥅 Terrain 5x5 (Futsal)
```yaml
Acompte: 50% (pourcentage)
Durée min: 1h
Durée max: 2h
Consignes: "Arriver 10min avant. Ballons fournis."
```

### ⚽ Terrain 7x7
```yaml
Acompte: 40% (pourcentage)
Durée min: 1h
Durée max: 3h
Consignes: "Arriver 15min avant. Chasubles disponibles."
```

### 🏟️ Terrain 11x11
```yaml
Acompte: 15,000 FCFA (fixe)
Durée min: 2h
Durée max: 4h
Consignes: "Match officiel: arriver 30min avant. Arbitre facultatif."
```

---

## 🐛 FAQ

**Q: Que se passe-t-il si un client ne paie pas l'acompte ?**
R: La réservation reste en statut "pending" et est automatiquement annulée après 1h si non payée.

**Q: Peut-on modifier les consignes après création ?**
R: Oui, via le bouton "Modifier" sur votre terrain dans le dashboard.

**Q: L'acompte est-il remboursable ?**
R: Selon votre politique d'annulation définie. Par défaut : remboursable si annulation 24h avant.

**Q: Les consignes sont-elles obligatoires ?**
R: Non, c'est facultatif. Mais fortement recommandé pour une communication claire.

**Q: Peut-on avoir différentes règles pour différents jours ?**
R: Pas encore. C'est prévu dans une prochaine version (ex: tarifs weekend différents).

---

## 🚀 Prochaines Améliorations

- [ ] Règles différentes selon les jours/horaires
- [ ] Acomptes automatiques (prélèvement après confirmation)
- [ ] Remboursements automatiques
- [ ] Modèles de consignes pré-remplis
- [ ] Traduction automatique (Français/Wolof/Anglais)
- [ ] Notifications SMS automatiques des consignes
- [ ] QR Code pour accès automatique

---

## 📞 Support

Pour toute question sur les règles de réservation :
- 📧 Email : support@footballsn.com
- 📱 WhatsApp : +221 XX XXX XX XX
- 💬 Chat en ligne sur le site

---

**🎉 Gérez vos réservations comme un pro ! 🏟️**

