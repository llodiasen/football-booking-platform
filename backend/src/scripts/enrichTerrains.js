const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Terrain = require('../models/Terrain');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

// Descriptions variées pour les terrains
const descriptions = [
  "Terrain de football professionnel avec gazon synthétique de dernière génération. Surface homogène garantissant un excellent confort de jeu et une bonne glisse du ballon. Parfait pour les matchs compétitifs et les entraînements intensifs.",
  "Magnifique terrain avec un revêtement en gazon synthétique premium offrant une expérience de jeu exceptionnelle. Idéal pour tous types de pratiques sportives, des matchs amicaux aux tournois officiels.",
  "Terrain moderne équipé d'un système d'éclairage LED performant permettant de jouer en soirée dans d'excellentes conditions. Surface synthétique résistante et confortable.",
  "Superbe infrastructure sportive avec terrain aux normes FIFA. Vestiaires spacieux, douches chaudes, et parking sécurisé. Un lieu idéal pour vos événements sportifs.",
  "Terrain de qualité supérieure avec drainage optimal garantissant une jouabilité parfaite même après la pluie. Entouré de filets de protection de 6 mètres de hauteur.",
  "Complexe sportif moderne offrant un cadre exceptionnel pour la pratique du football. Terrain entretenu quotidiennement, vestiaires climatisés et espace détente.",
  "Terrain premium situé dans un quartier calme et facilement accessible. Surface synthétique nouvelle génération offrant un confort de jeu optimal et réduisant le risque de blessures.",
  "Infrastructure de haut niveau avec terrain homologué pour les compétitions officielles. Gradin couvert pour les spectateurs, système de sonorisation et tableau d'affichage électronique."
];

// Points forts variés
const highlights = [
  [
    "Gazon synthétique dernière génération FIFA Quality Pro",
    "Système d'éclairage LED 500 lux pour matchs nocturnes",
    "Filets de protection 6m de hauteur",
    "Vestiaires spacieux avec douches chaudes",
    "Parking gratuit 50 places",
    "Accès PMR (Personnes à Mobilité Réduite)"
  ],
  [
    "Surface homologuée FFF pour compétitions officielles",
    "Gradins couverts capacité 150 personnes",
    "Système de sonorisation professionnel",
    "Tableau d'affichage électronique",
    "Espace détente avec distributeurs",
    "Wifi gratuit dans tout le complexe"
  ],
  [
    "Terrain entretenu quotidiennement par des professionnels",
    "Vestiaires climatisés avec casiers sécurisés",
    "Douches individuelles avec eau chaude illimitée",
    "Zone d'échauffement dédiée",
    "Matériel de jeu fourni (ballons, chasubles)",
    "Service de location de chaussures"
  ],
  [
    "Drainage optimal - jouable par tous temps",
    "Revêtement anti-choc réduisant les blessures",
    "Éclairage programmable selon vos besoins",
    "Accès sécurisé par badge électronique",
    "Vidéosurveillance 24h/24",
    "Gardien sur place pendant les heures d'ouverture"
  ],
  [
    "Terrain aux dimensions officielles 40m x 20m",
    "Buts scellés avec filets professionnels",
    "Marquage au sol permanent haute qualité",
    "Zone technique avec bancs de touche",
    "Panneau tactique effaçable disponible",
    "Kit de premiers secours et défibrillateur"
  ],
  [
    "Emplacement central avec excellente desserte",
    "À proximité des transports en commun",
    "Commerces et restaurants à 2 min à pied",
    "Espace cafétéria avec vue sur le terrain",
    "Salle de réunion pour briefings d'équipe",
    "Service de réservation en ligne 24/7"
  ]
];

// Règles du terrain détaillées
const terrainRules = [
  "Arriver 10 minutes avant l'heure réservée pour l'accès aux vestiaires",
  "Chaussures à crampons moulés obligatoires (crampons vissés interdits)",
  "Port de protège-tibias fortement recommandé",
  "Respecter les autres utilisateurs et le personnel",
  "Ne pas fumer dans l'enceinte du complexe",
  "Consommer de l'alcool strictement interdit",
  "Les enfants de moins de 12 ans doivent être accompagnés",
  "Interdiction d'introduire des objets dangereux",
  "Respecter les horaires de début et de fin de créneau",
  "Laisser les vestiaires propres après utilisation"
];

// Points d'intérêt du quartier
const neighborhoodHighlights = [
  {
    category: "Transport",
    items: [
      "Arrêt de bus ligne 12 à 100m",
      "Station de taxi à 200m",
      "Parking gratuit 50 places",
      "Piste cyclable sécurisée"
    ]
  },
  {
    category: "Commerce",
    items: [
      "Supérette Auchan à 300m",
      "Pharmacie à 150m",
      "Restaurants et snacks variés",
      "Station-service Total à 500m"
    ]
  },
  {
    category: "Loisirs",
    items: [
      "Parc public avec aires de jeux",
      "Salle de sport à 400m",
      "Terrain de basketball municipal",
      "Espace culturel polyvalent"
    ]
  }
];

// Services supplémentaires
const additionalServices = [
  "Location de matériel (ballons, chasubles, coupelles)",
  "Coaching sportif sur demande",
  "Organisation d'événements et tournois",
  "Service photo/vidéo des matchs",
  "Boutique de sport partenaire",
  "Service de restauration pour groupes",
  "Massage et kinésithérapie (sur RDV)",
  "Académie de football pour enfants"
];

async function enrichTerrains() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    console.log('📊 Récupération des terrains...');
    const terrains = await Terrain.find({ isApproved: true });
    console.log(`✅ ${terrains.length} terrains trouvés\n`);

    let enrichedCount = 0;

    for (const terrain of terrains) {
      console.log(`\n🔄 Enrichissement: ${terrain.name}`);

      // Enrichir la description si trop courte
      if (!terrain.description || terrain.description.length < 100) {
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
        terrain.description = randomDesc;
        console.log('  ✅ Description enrichie');
      }

      // Ajouter points forts du terrain (si pas déjà présents)
      if (!terrain.highlights || terrain.highlights.length === 0) {
        const randomHighlights = highlights[Math.floor(Math.random() * highlights.length)];
        terrain.highlights = randomHighlights;
        console.log(`  ✅ ${randomHighlights.length} points forts ajoutés`);
      }

      // Ajouter points forts du quartier (si pas déjà présents)
      if (!terrain.neighborhoodHighlights || terrain.neighborhoodHighlights.length === 0) {
        terrain.neighborhoodHighlights = neighborhoodHighlights;
        console.log(`  ✅ Points forts du quartier ajoutés`);
      }

      // Enrichir les règles du terrain
      if (!terrain.bookingRules.rules || terrain.bookingRules.rules.length === 0) {
        // Sélectionner 8 règles aléatoires
        const selectedRules = terrainRules
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        terrain.bookingRules.rules = selectedRules;
        console.log(`  ✅ ${selectedRules.length} règles ajoutées`);
      }

      // Ajouter services supplémentaires
      if (!terrain.additionalServices || terrain.additionalServices.length === 0) {
        const numServices = 4 + Math.floor(Math.random() * 3); // 4 à 6 services
        const selectedServices = additionalServices
          .sort(() => 0.5 - Math.random())
          .slice(0, numServices);
        terrain.additionalServices = selectedServices;
        console.log(`  ✅ ${selectedServices.length} services ajoutés`);
      }

      // Ajouter informations sur la sécurité (si pas déjà présentes)
      if (!terrain.safetyInfo || terrain.safetyInfo.length === 0) {
        terrain.safetyInfo = [
          "Défibrillateur accessible 24/7",
          "Trousse de premiers secours disponible",
          "Personnel formé aux gestes de premiers secours",
          "Vidéosurveillance active",
          "Numéros d'urgence affichés",
          "Éclairage de sécurité nocturne",
          "Sorties de secours signalées",
          "Assurance responsabilité civile incluse"
        ];
        console.log('  ✅ Informations sécurité ajoutées');
      }

      // Ajouter informations d'accessibilité
      if (!terrain.accessibility) {
        terrain.accessibility = {
          wheelchairAccess: Math.random() > 0.3, // 70% accessibles
          parkingPMR: Math.random() > 0.4, // 60% avec parking PMR
          elevatorAvailable: Math.random() > 0.5, // 50% avec ascenseur
          adaptedToilets: Math.random() > 0.3 // 70% avec toilettes adaptées
        };
        console.log('  ✅ Informations accessibilité ajoutées');
      }

      // Sauvegarder les modifications
      await terrain.save();
      enrichedCount++;
      console.log(`  💾 Terrain sauvegardé (${enrichedCount}/${terrains.length})`);
    }

    console.log(`\n\n🎉 Enrichissement terminé !`);
    console.log(`✅ ${enrichedCount} terrains enrichis avec succès\n`);

    console.log('📊 Résumé des ajouts:');
    console.log('  - Descriptions détaillées');
    console.log('  - Points forts du terrain (6 par terrain)');
    console.log('  - Points forts du quartier (Transport, Commerce, Loisirs)');
    console.log('  - Règles détaillées (8 par terrain)');
    console.log('  - Services supplémentaires (4-6 par terrain)');
    console.log('  - Informations sécurité (8 points)');
    console.log('  - Informations accessibilité');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Vérifier que le modèle Terrain supporte ces champs
console.log('⚠️  Note: Ce script suppose que le modèle Terrain a été mis à jour');
console.log('⚠️  avec les champs: highlights, neighborhoodHighlights, additionalServices, safetyInfo, accessibility');
console.log('⚠️  Si ces champs n\'existent pas, ils seront ignorés par Mongoose\n');

enrichTerrains();

