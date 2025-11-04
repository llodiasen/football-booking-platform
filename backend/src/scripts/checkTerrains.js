const mongoose = require('mongoose');
require('dotenv').config();

const Terrain = require('../models/Terrain');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error.message);
    process.exit(1);
  }
};

const checkTerrains = async () => {
  try {
    const allTerrains = await Terrain.find();
    const approvedTerrains = await Terrain.find({ isApproved: true });
    
    console.log('\n📊 STATISTIQUES TERRAINS:\n');
    console.log(`Total terrains: ${allTerrains.length}`);
    console.log(`Terrains approuvés: ${approvedTerrains.length}`);
    console.log(`Terrains en attente: ${allTerrains.length - approvedTerrains.length}`);
    
    console.log('\n📍 PREMIERS 10 TERRAINS:\n');
    allTerrains.slice(0, 10).forEach((t, i) => {
      console.log(`${i + 1}. ${t.name} - ${t.address.city} (${t.isApproved ? '✅ Approuvé' : '⏳ En attente'})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée');
  }
};

connectDB().then(() => checkTerrains());

