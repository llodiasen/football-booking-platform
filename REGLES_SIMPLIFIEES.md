# 📋 Règles de Réservation Simplifiées

## 🎯 Règles Fixes (Non Modifiables)

### ⏱️ Durée de Réservation
- **Minimum : 1 heure** (fixe)
- Les clients ne peuvent pas réserver moins d'1 heure
- Pas de durée maximum définie

### ⏰ Consignes par Défaut
**Toujours affichée aux clients :**
```
"Merci d'arriver 15 minutes avant l'heure de réservation 
pour récupérer les clés et accéder aux vestiaires."
```

---

## ✅ Règles Personnalisables (Par le Propriétaire)

### 1. **💰 Acompte pour Valider la Réservation**

Vous pouvez exiger un paiement d'avance :

**Option A : Pourcentage**
```
Exemple : 50% du montant total
Réservation 2h à 30,000 FCFA/h = 60,000 FCFA
→ Acompte : 30,000 FCFA (50%)
→ Sur place : 30,000 FCFA
```

**Option B : Montant Fixe**
```
Exemple : 15,000 FCFA quel que soit la durée
Réservation 2h à 30,000 FCFA/h = 60,000 FCFA
→ Acompte : 15,000 FCFA (fixe)
→ Sur place : 45,000 FCFA
```

---

### 2. **📋 Consignes Supplémentaires**

Zone de texte (max 1000 caractères) pour ajouter d'autres instructions.

**Le texte par défaut est déjà inclus :**
> "Merci d'arriver 15 minutes avant l'heure de réservation..."

**Vous pouvez ajouter :**
- Équipement à apporter
- Règles spécifiques
- Contact d'urgence
- Info parking
- Etc.

**Exemple complet :**
```
Merci d'arriver 15 minutes avant l'heure de réservation 
pour récupérer les clés et accéder aux vestiaires.

Équipement :
• Pensez à apporter vos propres ballons
• Crampons moulés autorisés uniquement
• Chasubles disponibles à la demande

Règles :
• Le terrain doit être libéré à l'heure exacte
• Tout dépassement : 15,000 FCFA / 30min supplémentaires
• Merci de laisser les vestiaires propres

Contact : +221 XX XXX XX XX
Parking : Gratuit à l'entrée (places limitées)
```

---

### 3. **🚫 Politique d'Annulation**

Définissez vos règles de remboursement (max 500 caractères).

**Par défaut :**
```
"Annulation gratuite jusqu'à 24h avant la réservation."
```

**Exemples d'adaptation :**

**Flexible :**
```
Annulation gratuite jusqu'à 24h avant. 
Remboursement intégral de l'acompte.
```

**Modérée :**
```
Annulation gratuite jusqu'à 48h avant.
Entre 24h-48h : remboursement 50%.
Moins de 24h : non remboursable.
```

**Stricte :**
```
Annulation jusqu'à 7 jours avant uniquement.
Au-delà : acompte non remboursable.
Report possible en cas de pluie.
```

---

## 💻 Interface Propriétaire

### Dans le Formulaire de Terrain :

```
╔══════════════════════════════════════════╗
║ Règles de Réservation                    ║
╠══════════════════════════════════════════╣
║                                          ║
║ [✓] Exiger un acompte                    ║
║    Type: [Pourcentage ▼]                 ║
║    Montant: [50______]                   ║
║                                          ║
║ Consignes pour les clients 📋           ║
║ ┌────────────────────────────────────┐   ║
║ │ Merci d'arriver 15 minutes avant...│   ║
║ │                                    │   ║
║ │ [Ajoutez d'autres consignes ici]  │   ║
║ └────────────────────────────────────┘   ║
║ 112/1000 caractères                      ║
║                                          ║
║ 💡 Consigne par défaut : "Merci         ║
║    d'arriver 15 minutes avant..."       ║
║ ℹ️ Durée minimum : 1 heure              ║
║                                          ║
║ Politique d'annulation                   ║
║ ┌────────────────────────────────────┐   ║
║ │ Annulation gratuite jusqu'à 24h... │   ║
║ └────────────────────────────────────┘   ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

## 👥 Ce Que Voient les Clients

### Sur la Page du Terrain :

```
╔════════════════════════════════════════╗
║  Galaxy Arena                          ║
║  32,500 FCFA/h • Minimum 1 heure      ║
║                                        ║
║  ⚠️ Acompte requis : 50%              ║
║                                        ║
║  📋 Consignes Importantes :            ║
║  • Arriver 15min avant l'heure        ║
║  • Crampons interdits                 ║
║  • Apporter vos ballons               ║
║                                        ║
║  🚫 Annulation :                       ║
║  Gratuite jusqu'à 48h avant           ║
╚════════════════════════════════════════╝
```

### Lors de la Réservation :

```
Choisissez la durée
───────────────────────────
⏱️ Minimum : 1 heure

[1h] [2h] [3h] [4h] [+]

📋 Rappel Important :
Merci d'arriver 15 minutes avant 
l'heure de réservation.
```

---

## 🎯 Cas d'Usage

### Terrain Standard
```yaml
Prix: 25,000 FCFA/h
Durée minimum: 1h (fixe)
Acompte: Non requis
Consignes: Texte par défaut + "Parking gratuit"
Annulation: "Gratuite jusqu'à 24h avant"
```

### Terrain Premium
```yaml
Prix: 40,000 FCFA/h
Durée minimum: 1h (fixe)
Acompte: 100% (paiement complet)
Consignes: Texte par défaut + "Chasubles fournis"
Annulation: "Gratuite jusqu'à 48h avant"
```

### Terrain Communautaire
```yaml
Prix: 15,000 FCFA/h
Durée minimum: 1h (fixe)
Acompte: 30% (pourcentage)
Consignes: Texte par défaut + "Tarif réduit pour écoles"
Annulation: "Gratuite jusqu'à 24h avant"
```

---

## ✨ Avantages de cette Simplification

### ✅ Pour les Propriétaires :
- **Moins de champs à remplir**
- **Règles claires et uniformes**
- **Durée minimum standard (1h)**
- **Consignes 15min avant = déjà incluses**

### ✅ Pour les Clients :
- **Règles simples à comprendre**
- **Durée minimum connue : 1h partout**
- **Consigne claire : arriver 15min avant**
- **Moins de confusion**

---

## 📊 Résumé Technique

### Champs dans la Base de Données :

```javascript
bookingRules: {
  advancePayment: {
    required: Boolean,  // Acompte obligatoire ?
    amount: Number,     // 50 ou 15000
    type: String       // 'percentage' ou 'fixed'
  },
  instructions: String, // Texte par défaut + ajouts
  cancellationPolicy: String  // Politique d'annulation
}

// RETIRÉ : minBookingDuration
// RETIRÉ : maxBookingDuration
// → Durée minimum fixée à 1h en dur dans le code
```

---

## 🔧 Migration des Données Existantes

Si vous aviez déjà des terrains avec durées personnalisées :
- Elles sont ignorées
- La durée minimum est maintenant **1 heure** pour tous
- Aucune action requise de votre part

---

## 📞 Support

Questions sur les nouvelles règles ?
- 📧 Email : support@footballsn.com
- 📱 Téléphone : +221 XX XXX XX XX
- 💬 Chat en ligne sur le site

---

**🎉 Règles simplifiées = Moins de confusion, plus de réservations ! 🏟️**

