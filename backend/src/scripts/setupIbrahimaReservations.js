const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');

const setupIbrahimaReservations = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Trouver le propriétaire par email
    console.log('\n🔍 Recherche du propriétaire...');
    let owner = await User.findOne({ email: 'soonoup93@gmail.com' });

    if (!owner) {
      console.log('❌ Compte non trouvé avec cet email');
      process.exit(1);
    }

    console.log(`✅ Propriétaire trouvé: ${owner.firstName} ${owner.lastName} (${owner.email})`);
    
    // S'assurer qu'il est propriétaire
    if (owner.role !== 'owner') {
      owner.role = 'owner';
      await owner.save();
      console.log('✅ Rôle mis à jour en "owner"');
    }

    // 2. Trouver le terrain BeSport
    console.log('\n🔍 Recherche du terrain BeSport...');
    const besport = await Terrain.findOne({ name: /besport/i });

    if (!besport) {
      console.log('❌ BeSport non trouvé');
      process.exit(1);
    }

    console.log(`✅ BeSport trouvé: ${besport.name}`);

    // 3. Assigner BeSport au propriétaire
    console.log('\n🔄 Attribution de BeSport au propriétaire...');
    besport.owner = owner._id;
    await besport.save();
    console.log('✅ BeSport assigné au propriétaire');

    // 4. Trouver ou créer des clients pour les réservations
    console.log('\n👥 Recherche/Création de clients...');
    const clientsData = [
      { firstName: 'Moussa', lastName: 'Ndiaye', email: 'moussa@example.com', phone: '77 111 11 11' },
      { firstName: 'Fatou', lastName: 'Seck', email: 'fatou@example.com', phone: '77 222 22 22' },
      { firstName: 'Amadou', lastName: 'Ba', email: 'amadou@example.com', phone: '77 333 33 33' },
      { firstName: 'Awa', lastName: 'Diop', email: 'awa@example.com', phone: '77 444 44 44' },
      { firstName: 'Cheikh', lastName: 'Fall', email: 'cheikh@example.com', phone: '77 555 55 55' },
      { firstName: 'Aminata', lastName: 'Toure', email: 'aminata@example.com', phone: '77 666 66 66' },
      { firstName: 'Omar', lastName: 'Sy', email: 'omar@example.com', phone: '77 777 77 77' }
    ];

    const clients = [];
    for (const clientData of clientsData) {
      let client = await User.findOne({ email: clientData.email });
      if (!client) {
        client = new User({
          ...clientData,
          password: 'password123',
          role: 'client',
          isVerified: true
        });
        await client.save();
        console.log(`✅ Client créé: ${client.firstName} ${client.lastName}`);
      } else {
        console.log(`✅ Client existant: ${client.firstName} ${client.lastName}`);
      }
      clients.push(client);
    }

    // 5. Supprimer les anciennes réservations de BeSport
    console.log('\n🗑️ Suppression des anciennes réservations de BeSport...');
    await Reservation.deleteMany({ terrain: besport._id });
    console.log('✅ Anciennes réservations supprimées');

    // 6. Créer 7 nouvelles réservations avec différents statuts
    console.log('\n📅 Création de 7 réservations...');
    
    const today = new Date();
    const pricePerReservation = besport.pricePerHour * 2;
    
    const reservationsData = [
      {
        client: clients[0]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Demain
        startTime: '09:00',
        endTime: '11:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'pending',
        paymentMethod: 'wave',
        notes: 'Match de quartier avec les amis'
      },
      {
        client: clients[1]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Après-demain
        startTime: '14:00',
        endTime: '16:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'pending',
        paymentMethod: 'cash',
        notes: 'Entraînement équipe féminine'
      },
      {
        client: clients[2]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
        startTime: '16:00',
        endTime: '18:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'orange_money',
        notes: 'Tournoi inter-entreprises'
      },
      {
        client: clients[3]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), // Dans 4 jours
        startTime: '10:00',
        endTime: '12:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'wave',
        notes: 'Cours de football pour enfants'
      },
      {
        client: clients[4]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
        startTime: '18:00',
        endTime: '20:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'pending',
        paymentMethod: 'free_money',
        notes: 'Match amical'
      },
      {
        client: clients[5]._id,
        terrain: besport._id,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Hier
        startTime: '15:00',
        endTime: '17:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'cancelled',
        cancellationReason: 'Client a annulé pour raisons personnelles',
        paymentMethod: 'cash'
      },
      {
        client: clients[6]._id,
        terrain: besport._id,
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Dans 1 semaine
        startTime: '08:00',
        endTime: '10:00',
        duration: 2,
        totalPrice: pricePerReservation,
        finalPrice: pricePerReservation,
        status: 'pending',
        paymentMethod: 'orange_money',
        notes: 'Séance d\'entraînement matinale'
      }
    ];

    for (let i = 0; i < reservationsData.length; i++) {
      const reservation = new Reservation(reservationsData[i]);
      await reservation.save();
      const statusEmoji = 
        reservation.status === 'pending' ? '⏰' :
        reservation.status === 'confirmed' ? '✅' :
        '❌';
      console.log(`${statusEmoji} Réservation ${i + 1}/7 créée: ${reservation.status} - ${clients[i].firstName} ${clients[i].lastName}`);
    }

    console.log('\n✅ CONFIGURATION TERMINÉE !');
    console.log('\n📊 RÉSUMÉ:');
    console.log(`👤 Propriétaire: ${owner.firstName} ${owner.lastName} (${owner.email})`);
    console.log(`🏟️  Terrain: ${besport.name}`);
    console.log(`📅 Réservations créées: 7`);
    console.log(`   - En attente: 4`);
    console.log(`   - Confirmées: 2`);
    console.log(`   - Annulées: 1`);
    console.log('\n🔐 CONNEXION:');
    console.log(`Email: ${owner.email}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
};

setupIbrahimaReservations();

