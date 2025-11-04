const mongoose = require('mongoose');
require('dotenv').config();

const Terrain = require('../models/Terrain');
const User = require('../models/User');

// Commentaires réalistes pour terrains de football
const reviewsData = [
  {
    rating: 5,
    comment: "Un terrain exceptionnel ! Le gazon est parfaitement entretenu et les vestiaires sont très propres. Le propriétaire est très réactif et accueillant. Je recommande vivement pour des matchs entre amis.",
    firstName: "Mamadou",
    city: "Dakar"
  },
  {
    rating: 5,
    comment: "Excellent terrain, bien situé et facile d'accès. L'éclairage nocturne est parfait pour nos matchs du soir. Les douches sont propres et l'ambiance est conviviale. On reviendra sans hésiter !",
    firstName: "Abdoulaye",
    city: "Pikine"
  },
  {
    rating: 5,
    comment: "Terrain de qualité avec un très bon rapport qualité-prix. Le propriétaire est disponible et à l'écoute. Les équipements sont en bon état et le terrain est toujours bien préparé. Parfait pour notre équipe !",
    firstName: "Ibrahima",
    city: "Guédiawaye"
  },
  {
    rating: 5,
    comment: "Super expérience ! Le terrain synthétique est de très bonne qualité, les marquages sont nets et les cages sont solides. Parking disponible et sécurisé. Idéal pour nos entraînements hebdomadaires.",
    firstName: "Cheikh",
    city: "Rufisque"
  },
  {
    rating: 4,
    comment: "Très bon terrain, bien entretenu. Seul petit bémol : l'attente était un peu longue à l'arrivée. Mais sinon, excellent rapport qualité-prix et bonne ambiance générale.",
    firstName: "Moussa",
    city: "Parcelles Assainies"
  },
  {
    rating: 5,
    comment: "Je loue ce terrain régulièrement pour mon équipe et je n'ai jamais été déçu. Le propriétaire est professionnel, le terrain est toujours impeccable et les installations sont modernes. Hautement recommandé !",
    firstName: "Ousmane",
    city: "Almadies"
  },
  {
    rating: 5,
    comment: "Parfait pour nos matchs du weekend ! Le terrain est spacieux, bien éclairé et les vestiaires sont propres. Communication fluide avec le propriétaire. On a passé un excellent moment, merci !",
    firstName: "Amadou",
    city: "Liberté 6"
  },
  {
    rating: 5,
    comment: "Terrain top ! Gazon de qualité, équipements en bon état et ambiance au rendez-vous. Le quartier est calme et sécurisé. Réservation facile et propriétaire très arrangeant. Je recommande à 100% !",
    firstName: "Modou",
    city: "Sacré-Cœur"
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error.message);
    process.exit(1);
  }
};

const addReviews = async () => {
  try {
    console.log('🎯 Ajout des avis aux terrains...\n');

    // Récupérer tous les terrains
    const terrains = await Terrain.find({ isApproved: true });
    console.log(`📊 ${terrains.length} terrains trouvés\n`);

    // Créer des utilisateurs fictifs pour les avis
    const reviewUsers = [];
    for (let i = 0; i < reviewsData.length; i++) {
      const reviewData = reviewsData[i];
      let user = await User.findOne({ email: `${reviewData.firstName.toLowerCase()}@example.com` });
      
      if (!user) {
        // Générer un numéro de téléphone unique
        const phoneNumber = `77 ${String(i + 1).padStart(3, '0')} ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)}`;
        
        user = new User({
          firstName: reviewData.firstName,
          lastName: 'Client',
          email: `${reviewData.firstName.toLowerCase()}@example.com`,
          phone: phoneNumber,
          password: 'Password123!',
          role: 'client',
          isVerified: true
        });
        await user.save();
        console.log(`✅ Utilisateur créé: ${reviewData.firstName} (${phoneNumber})`);
      }
      
      reviewUsers.push({
        userId: user._id,
        ...reviewData
      });
    }

    // Ajouter des avis à chaque terrain
    let totalAdded = 0;
    for (const terrain of terrains) {
      // Ajouter 3-6 avis aléatoires par terrain
      const numReviews = Math.floor(Math.random() * 4) + 3;
      const shuffled = [...reviewUsers].sort(() => 0.5 - Math.random());
      const selectedReviews = shuffled.slice(0, numReviews);

      for (const review of selectedReviews) {
        // Vérifier si l'utilisateur a déjà laissé un avis
        const existingReview = terrain.reviews.find(
          r => r.user && r.user.toString() === review.userId.toString()
        );

        if (!existingReview) {
          terrain.reviews.push({
            user: review.userId,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Date aléatoire dans les 90 derniers jours
          });
          totalAdded++;
        }
      }

      // Calculer la note moyenne
      if (terrain.reviews.length > 0) {
        const totalRating = terrain.reviews.reduce((sum, r) => sum + r.rating, 0);
        terrain.rating = {
          average: totalRating / terrain.reviews.length,
          count: terrain.reviews.length
        };
      }

      await terrain.save();
      console.log(`✅ ${terrain.name}: ${terrain.reviews.length} avis (note: ${terrain.rating.average.toFixed(1)})`);
    }

    console.log(`\n🎉 ${totalAdded} avis ajoutés avec succès !`);
    console.log(`📊 Total terrains mis à jour: ${terrains.length}`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connexion MongoDB fermée');
  }
};

// Exécution
connectDB().then(() => addReviews());

