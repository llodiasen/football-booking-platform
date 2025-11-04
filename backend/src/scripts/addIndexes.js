const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking';

async function addIndexes() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const db = mongoose.connection.db;

    console.log('📊 Ajout des indexes pour optimisation...\n');

    // ====== TERRAINS ======
    console.log('1️⃣  Collection Terrains:');
    
    // Index pour recherche par ville et région
    await db.collection('terrains').createIndex({ 'address.city': 1 });
    console.log('   ✅ Index créé: address.city');
    
    await db.collection('terrains').createIndex({ 'address.region': 1 });
    console.log('   ✅ Index créé: address.region');
    
    // Index pour recherche par propriétaire
    await db.collection('terrains').createIndex({ owner: 1 });
    console.log('   ✅ Index créé: owner');
    
    // Index pour recherche par statut
    await db.collection('terrains').createIndex({ isActive: 1, isApproved: 1 });
    console.log('   ✅ Index créé: isActive + isApproved');
    
    // Index pour tri par prix
    await db.collection('terrains').createIndex({ pricePerHour: 1 });
    console.log('   ✅ Index créé: pricePerHour');
    
    // Index pour tri par note
    await db.collection('terrains').createIndex({ 'rating.average': -1 });
    console.log('   ✅ Index créé: rating.average');
    
    // Index pour tri par date de création
    await db.collection('terrains').createIndex({ createdAt: -1 });
    console.log('   ✅ Index créé: createdAt');
    
    // Index géospatial pour recherche par proximité
    await db.collection('terrains').createIndex({ 'address.coordinates': '2dsphere' });
    console.log('   ✅ Index géospatial créé: address.coordinates (2dsphere)');
    
    // Index texte pour recherche full-text
    await db.collection('terrains').createIndex({ 
      name: 'text', 
      description: 'text' 
    }, { 
      weights: { name: 10, description: 5 },
      default_language: 'french'
    });
    console.log('   ✅ Index texte créé: name + description\n');

    // ====== RESERVATIONS ======
    console.log('2️⃣  Collection Reservations:');
    
    // Index pour recherche par terrain
    await db.collection('reservations').createIndex({ terrain: 1 });
    console.log('   ✅ Index créé: terrain');
    
    // Index pour recherche par client
    await db.collection('reservations').createIndex({ client: 1 });
    console.log('   ✅ Index créé: client');
    
    // Index pour recherche par date
    await db.collection('reservations').createIndex({ date: 1 });
    console.log('   ✅ Index créé: date');
    
    // Index pour recherche par statut
    await db.collection('reservations').createIndex({ status: 1 });
    console.log('   ✅ Index créé: status');
    
    // Index composé pour vérification disponibilité (le plus utilisé)
    await db.collection('reservations').createIndex({ 
      terrain: 1, 
      date: 1, 
      status: 1 
    });
    console.log('   ✅ Index composé créé: terrain + date + status\n');

    // ====== USERS ======
    console.log('3️⃣  Collection Users:');
    
    // Index pour recherche par email (déjà unique normalement)
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('   ✅ Index unique créé: email');
    
    // Index pour recherche par téléphone (déjà unique normalement)
    await db.collection('users').createIndex({ phone: 1 }, { unique: true });
    console.log('   ✅ Index unique créé: phone');
    
    // Index pour recherche par rôle
    await db.collection('users').createIndex({ role: 1 });
    console.log('   ✅ Index créé: role\n');

    // ====== PAYMENTS ======
    console.log('4️⃣  Collection Payments:');
    
    // Index pour recherche par réservation
    await db.collection('payments').createIndex({ reservation: 1 });
    console.log('   ✅ Index créé: reservation');
    
    // Index pour recherche par utilisateur
    await db.collection('payments').createIndex({ user: 1 });
    console.log('   ✅ Index créé: user');
    
    // Index pour recherche par statut
    await db.collection('payments').createIndex({ status: 1 });
    console.log('   ✅ Index créé: status\n');

    // ====== TEAMS ======
    console.log('5️⃣  Collection Teams:');
    
    // Index pour recherche par propriétaire
    await db.collection('teams').createIndex({ owner: 1 });
    console.log('   ✅ Index créé: owner');
    
    // Index pour recherche par membres
    await db.collection('teams').createIndex({ 'members.user': 1 });
    console.log('   ✅ Index créé: members.user\n');

    console.log('🎉 Tous les indexes ont été créés avec succès !');
    console.log('\n📈 Performance de la base de données optimisée !\n');

    // Afficher les statistiques
    const collections = ['terrains', 'reservations', 'users', 'payments', 'teams'];
    
    console.log('📊 Statistiques des indexes:\n');
    for (const collName of collections) {
      try {
        const indexes = await db.collection(collName).indexes();
        console.log(`${collName.toUpperCase()}: ${indexes.length} index${indexes.length > 1 ? 'es' : ''}`);
      } catch (err) {
        console.log(`${collName.toUpperCase()}: Collection n'existe pas encore`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

addIndexes();

