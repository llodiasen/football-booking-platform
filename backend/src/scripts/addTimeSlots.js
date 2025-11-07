const mongoose = require('mongoose');
require('dotenv').config();

const Terrain = require('../models/Terrain');

// Connexion MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
};

// Créneaux horaires standards (8h à 23h)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8;
  const endHour = 23;

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      startTime: `${String(hour).padStart(2, '0')}:00`,
      endTime: `${String(hour + 1).padStart(2, '0')}:00`,
      isAvailable: true
    });
  }

  return slots;
};

// Ajouter les créneaux à tous les terrains
const addTimeSlotsToTerrains = async () => {
  try {
    console.log('\n⏰ AJOUT DES CRÉNEAUX HORAIRES AUX TERRAINS\n');
    console.log('='.repeat(60));

    await connectDB();

    // Récupérer tous les terrains
    const terrains = await Terrain.find({});
    console.log(`\n📊 ${terrains.length} terrains trouvés`);

    const timeSlots = generateTimeSlots();
    console.log(`\n⏰ ${timeSlots.length} créneaux générés (8h-23h)`);

    // Mettre à jour chaque terrain
    let updated = 0;
    for (const terrain of terrains) {
      await Terrain.findByIdAndUpdate(terrain._id, {
        $set: {
          'openingHours.monday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.tuesday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.wednesday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.thursday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.friday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.saturday': { 
            closed: false,
            slots: timeSlots
          },
          'openingHours.sunday': { 
            closed: false,
            slots: timeSlots
          }
        }
      });
      updated++;
      process.stdout.write(`\r✅ Mise à jour: ${updated}/${terrains.length} terrains`);
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('\n🎉 CRÉNEAUX AJOUTÉS AVEC SUCCÈS !\n');
    console.log('📊 RÉSUMÉ :');
    console.log(`   - ${updated} terrains mis à jour`);
    console.log(`   - ${timeSlots.length} créneaux par jour`);
    console.log(`   - Horaires: 8h00 - 23h00`);
    console.log('\n✅ Les réservations fonctionnent maintenant !\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
};

// Lancer
addTimeSlotsToTerrains();

