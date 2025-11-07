import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import CookieBanner from './components/ui/CookieBanner';
import HelpCenter from './components/ui/HelpCenter';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Search from './pages/Search';
import TerrainDetails from './pages/TerrainDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyReservations from './pages/MyReservations';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import CreateTerrain from './pages/CreateTerrain';
import BookingModern from './pages/BookingModern';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';

// Multi-Role Pages
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import RegisterTeamPage from './pages/auth/RegisterTeamPage';
import RegisterPlayerPage from './pages/auth/RegisterPlayerPage';
import RegisterSubscriberPage from './pages/auth/RegisterSubscriberPage';
import TeamDashboard from './pages/dashboards/TeamDashboard';
import PlayerDashboard from './pages/dashboards/PlayerDashboard';
import SubscriberDashboard from './pages/dashboards/SubscriberDashboard';

// Composant de route protégée
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const hasToken = !!localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vérifier le token en plus de isAuthenticated pour gérer le cas juste après inscription
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  // Si on a un token mais pas encore de user, on attend
  if (hasToken && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (roles && user && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname === '/dashboard' || 
                           location.pathname.startsWith('/dashboard/team') ||
                           location.pathname.startsWith('/dashboard/player') ||
                           location.pathname.startsWith('/dashboard/subscriber');

  return (
    <div className="flex flex-col min-h-screen">
      <Toast />
      <CookieBanner />
      <HelpCenter />
      
      {/* Routes Admin/Owner Dashboard sans Navbar/Footer */}
      {(isAdminRoute || isDashboardRoute) ? (
        <Routes>
          <Route 
            path="/admin" 
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/reservations" 
            element={
              <PrivateRoute roles={['admin']}>
                <AdminReservations />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/team" 
            element={
              <PrivateRoute roles={['team']}>
                <TeamDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/player" 
            element={
              <PrivateRoute roles={['player']}>
                <PlayerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/subscriber" 
            element={
              <PrivateRoute roles={['subscriber']}>
                <SubscriberDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      ) : (
        /* Routes normales avec Navbar/Footer */
        <>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              
              {/* Multi-Role Registration */}
              <Route path="/role-selection" element={<RoleSelectionPage />} />
              <Route path="/register/team" element={<RegisterTeamPage />} />
              <Route path="/register/player" element={<RegisterPlayerPage />} />
              <Route path="/register/subscriber" element={<RegisterSubscriberPage />} />
              
              <Route path="/terrains" element={<Search />} />
              <Route path="/terrains/:id" element={<TerrainDetails />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />

              {/* Routes protégées */}
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/reservations" 
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard?section=reservations" replace />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/booking/:terrainId" 
                element={
                  <PrivateRoute>
                    <BookingModern />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/terrains/new" 
                element={
                  <PrivateRoute roles={['owner', 'admin']}>
                    <CreateTerrain />
                  </PrivateRoute>
                } 
              />

              {/* Payment Routes */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="container-custom py-20 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page non trouvée</p>
                  <a href="/" className="text-primary-600 hover:underline">
                    Retour à l'accueil
                  </a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;

