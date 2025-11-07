const axios = require('axios');

const testLoginEndpoint = async () => {
  const API_URL = 'http://localhost:5000/api';
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  🧪 TEST DE L\'ENDPOINT LOGIN                         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const testAccounts = [
    { email: 'fc-medina@221football.sn', password: 'password123', name: 'FC Médina' },
    { email: 'as-pikine@221football.sn', password: 'password123', name: 'AS Pikine' },
    { email: 'scatcity@gmail.com', password: 'password123', name: 'Scat City' }
  ];

  for (const account of testAccounts) {
    console.log(`🔍 Test: ${account.name} (${account.email})`);
    console.log('─'.repeat(60));
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: account.email,
        password: account.password
      });

      if (response.data.success) {
        console.log('✅ CONNEXION RÉUSSIE !');
        console.log(`   User ID: ${response.data.data.user.id}`);
        console.log(`   Email: ${response.data.data.user.email}`);
        console.log(`   Role: ${response.data.data.user.role}`);
        console.log(`   Roles: ${response.data.data.user.roles?.join(', ')}`);
        console.log(`   Primary: ${response.data.data.user.primaryRole}`);
        console.log(`   Team: ${response.data.data.user.teamProfile?.teamName || 'N/A'}`);
        console.log(`   Token: ${response.data.data.token.substring(0, 30)}...`);
      } else {
        console.log('❌ ÉCHEC:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ ERREUR HTTP:', error.response.status);
        console.log('   Message:', error.response.data.message || 'Non disponible');
        console.log('   Détails:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log('❌ ERREUR RÉSEAU: Pas de réponse du serveur');
        console.log('   Le backend est-il démarré ?');
      } else {
        console.log('❌ ERREUR:', error.message);
      }
    }
    
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 DIAGNOSTIC');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Test de connectivité au backend
  try {
    const healthCheck = await axios.get(`${API_URL}/health`, { timeout: 2000 }).catch(() => null);
    if (healthCheck) {
      console.log('✅ Backend accessible sur http://localhost:5000');
    } else {
      console.log('⚠️  Backend ne répond pas au health check');
    }
  } catch (error) {
    console.log('❌ Backend inaccessible');
    console.log('   Vérifiez que le backend est démarré:');
    console.log('   cd backend && npm start\n');
  }

  process.exit(0);
};

testLoginEndpoint();

