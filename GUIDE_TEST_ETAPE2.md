# 🧪 Guide de Test - Étape 2

## ✅ Identifiants de Connexion

```
📧 Email : llodiasen92@gmail.com
🔑 Mot de passe : Amadou123!
👤 Rôle : Propriétaire
```

---

## 🚀 TEST 1 : Créer un Terrain avec Prix Variables

### Étapes :

1. **Connectez-vous** : `http://localhost:5174/login`

2. **Allez au Dashboard** (automatique)

3. **Cliquez "Ajouter un terrain"**

4. **Remplissez les infos de base :**
   ```
   Nom : Mon Terrain Test
   Description : Terrain de test pour vérifier les prix variables et réductions
   Type : Synthétique
   Taille : 7x7
   Ville : Dakar
   Région : Dakar
   ```

5. **Section Tarification :**
   ```
   Prix de base : 30000 FCFA/h
   
   [x] Activer Tarification Avancée
   
   Prix Semaine : 25000 FCFA/h
   Prix Weekend : 40000 FCFA/h
   ```

6. **Ajouter un Créneau "Happy Hour" :**
   ```
   Cliquez "Ajouter"
   
   Nom : Happy Hour
   Jours : Lun, Mar, Mer, Jeu (cliquez sur chaque bouton)
   Heure début : 14:00
   Heure fin : 18:00
   Prix : 20000 FCFA/h
   
   Cliquez "Ajouter ce créneau"
   ```

7. **Ajouter un Créneau "Peak Hours" :**
   ```
   Cliquez "Ajouter" à nouveau
   
   Nom : Peak Hours
   Jours : Ven, Sam
   Heure début : 18:00
   Heure fin : 23:00
   Prix : 50000 FCFA/h
   
   Cliquez "Ajouter ce créneau"
   ```

8. **Vérifiez l'Aperçu :**
   ```
   📊 Aperçu de vos tarifs
   • Lundi-Vendredi : 25,000 FCFA/h
   • Weekend (Sam-Dim) : 40,000 FCFA/h
   • Happy Hour (14:00-18:00) : 20,000 FCFA/h
   • Peak Hours (18:00-23:00) : 50,000 FCFA/h
   ```

9. **Scrollez vers le bas, cliquez "Créer le terrain"**

**✅ RÉSULTAT ATTENDU :**  
Message "Terrain créé avec succès! 🎉"

---

## 🎁 TEST 2 : Ajouter des Réductions

### Étapes :

1. **Dans le même formulaire** (ou modifiez le terrain créé)

2. **Section "Réductions & Promotions"**

3. **Cliquez "Ajouter"**

4. **Créez une Réduction Durée :**
   ```
   Type : Réduction Durée
   
   Nom : Promo Longue Durée
   Description : Économisez 20% pour 3h et plus
   
   Type de valeur : Pourcentage (%)
   Valeur : 20
   
   Durée minimum : 3 heures
   
   Cliquez "Créer la réduction"
   ```

5. **Ajoutez un Code Promo :**
   ```
   Cliquez "Ajouter" à nouveau
   
   Type : Code Promo
   
   Nom : Code Bienvenue
   Description : -10% pour nouveaux clients
   
   Type de valeur : Pourcentage (%)
   Valeur : 10
   
   Code Promo : WELCOME10
   
   [x] Limiter le nombre d'utilisations
   Nombre max : 50
   
   Cliquez "Créer la réduction"
   ```

6. **Vérifiez la Liste :**
   ```
   ✅ Promo Longue Durée -20% [Actif]
   ✅ Code Bienvenue -10% (WELCOME10) [Actif]
   ```

7. **Sauvegardez**

**✅ RÉSULTAT ATTENDU :**  
Deux réductions actives dans la liste

---

## 📱 TEST 3 : Vérifier l'Affichage Public

### Étapes :

1. **Déconnectez-vous** (cliquez "Déconnexion")

2. **Allez sur** : `http://localhost:5174/terrains`

3. **Trouvez "Mon Terrain Test" dans la liste**

4. **Cliquez dessus pour voir les détails**

5. **Vérifiez que vous voyez :**
   ```
   💰 Tarifs :
   Lun-Ven : 25,000 FCFA/h
   Sam-Dim : 40,000 FCFA/h
   
   ⏰ Créneaux spéciaux :
   Happy Hour (14h-18h) : 20,000 FCFA/h
   Peak Hours (18h-23h) : 50,000 FCFA/h
   
   🎁 Réductions actives :
   • -20% pour réservations ≥ 3h
   • Code WELCOME10 : -10%
   ```

**✅ RÉSULTAT ATTENDU :**  
Tous les prix et réductions affichés clairement

---

## 💳 TEST 4 : Réservation avec Calcul Prix

### Étapes :

1. **Sur la page du terrain, cliquez "Réserver"**

2. **Choisissez :**
   ```
   Date : Mercredi prochain
   Heure : 15:00 - 17:00 (2 heures)
   ```

3. **Vérifiez le calcul :**
   ```
   Prix applicable : Happy Hour 20,000 FCFA/h
   Durée : 2h
   Total : 40,000 FCFA
   
   Réductions : Aucune (< 3h)
   ━━━━━━━━━━━━━━━━━━━━━
   Prix final : 40,000 FCFA
   ```

4. **Changez pour 4 heures :**
   ```
   Heure : 15:00 - 19:00 (4 heures)
   ```

5. **Vérifiez le nouveau calcul :**
   ```
   Happy Hour (14h-18h) : 3h × 20,000 = 60,000 FCFA
   Prix normal (18h-19h) : 1h × 25,000 = 25,000 FCFA
   Sous-total : 85,000 FCFA
   
   Réduction -20% (≥3h) : -17,000 FCFA
   ━━━━━━━━━━━━━━━━━━━━━
   Prix final : 68,000 FCFA ✅
   ```

**✅ RÉSULTAT ATTENDU :**  
Calcul automatique et précis

---

## 📞 TEST 5 : Contact Propriétaire

### Étapes :

1. **Après avoir réservé et payé** (statut = confirmed + paid)

2. **Allez dans "Mes Réservations"**

3. **Cliquez sur votre réservation**

4. **Avant paiement, vous voyez :**
   ```
   🔒 Contact Propriétaire Masqué
   Le contact sera disponible après validation du paiement
   ```

5. **Après paiement validé :**
   ```
   ✅ Contact Propriétaire Disponible
   [Bouton "Voir le Contact"]
   ```

6. **Cliquez "Voir le Contact"**

7. **Vérifiez que vous voyez :**
   ```
   ✅ Contact Propriétaire
   
   👤 Amadou Diallo
   
   📞 +221 77 123 45 67  [Appeler]
   📧 owner@email.com    [Envoyer]
   
   💡 Conseils :
   • Contactez le propriétaire...
   • Arrivez 15min avant...
   ```

8. **Testez le bouton "Appeler"**  
   → Doit ouvrir l'application téléphone

**✅ RÉSULTAT ATTENDU :**  
Contact révélé uniquement après paiement

---

## 🔍 Vérifications Backend

### Dans le Terminal Backend :

Vous devriez voir des logs comme :
```
POST /api/reservations 201 ... ms
POST /api/payments/initiate 200 ... ms
POST /api/reservations/:id/reveal-contact 200 ... ms
```

---

## ❌ Problèmes Courants

### "Terrain créé mais pas de prix variables"
**Solution :** Vérifiez que le switch "Tarification Avancée" est bien activé (bleu)

### "Réductions ne s'appliquent pas"
**Solution :** Vérifiez que la réduction est bien en statut "Actif" (bouton vert)

### "Contact propriétaire toujours masqué"
**Solution :** Vérifiez que :
- reservation.status = 'confirmed'
- reservation.paymentStatus = 'paid'

### "Backend crash EADDRINUSE"
**Solution :**
```powershell
# Trouver le processus
Get-Process node
# Tuer le processus (remplacez 12345 par le PID)
taskkill /F /PID 12345
# Relancer
cd backend
npm run dev
```

---

## 📊 Checklist Finale

- [ ] Prix de base affiché
- [ ] Switch tarification avancée fonctionne
- [ ] Prix semaine configurable
- [ ] Prix weekend configurable
- [ ] Créneaux horaires créables
- [ ] Créneaux modifiables/supprimables
- [ ] Réductions créables (4 types)
- [ ] Réductions activables/désactivables
- [ ] Code promo fonctionnel
- [ ] Calcul prix automatique
- [ ] Réductions appliquées automatiquement
- [ ] Contact masqué avant paiement
- [ ] Contact révélé après paiement
- [ ] Bouton "Appeler" fonctionnel
- [ ] Bouton "Envoyer Email" fonctionnel

---

## 🎯 Commandes Utiles

### Redémarrer tout :
```powershell
# Backend
cd C:\Users\wopal\Desktop\football-booking-platform\backend
npm run dev

# Frontend (nouveau terminal)
cd C:\Users\wopal\Desktop\football-booking-platform\frontend
npm run dev
```

### Vérifier logs :
```powershell
# Voir les requêtes API dans le terminal backend
```

### Nettoyer cache :
```javascript
// Dans la console navigateur (F12)
localStorage.clear()
location.reload()
```

---

**🎊 Bonne Chance pour les Tests ! Dites-moi ce qui fonctionne ou ce qui pose problème ! 🚀**

