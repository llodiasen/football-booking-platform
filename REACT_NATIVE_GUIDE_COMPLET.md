# 📱 Guide Complet - Application Mobile React Native

## 🎯 FootballSN Mobile - Documentation Complète

Ce guide vous explique comment créer l'application mobile React Native de votre plateforme de réservation.

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Structure du projet](#structure-du-projet)
5. [Composants principaux](#composants-principaux)
6. [Navigation](#navigation)
7. [Intégration API](#intégration-api)
8. [Fonctionnalités natives](#fonctionnalités-natives)
9. [Build et Déploiement](#build-et-déploiement)

---

## 🎯 Vue d'ensemble

### Qu'est-ce qu'on va créer ?

Une application mobile **iOS et Android** avec:
- ✅ Authentification (login/register)
- ✅ Recherche de terrains avec carte
- ✅ Réservation en ligne
- ✅ Paiement mobile money
- ✅ Gestion de profil et équipes
- ✅ Notifications push
- ✅ Mode hors-ligne
- ✅ Géolocalisation
- ✅ Partage social

### Temps de Développement

| Phase | Durée | Complexité |
|-------|-------|------------|
| Setup initial | 1 jour | Facile |
| UI/Navigation | 3-5 jours | Moyenne |
| Intégration API | 2-3 jours | Facile |
| Fonctions natives | 3-5 jours | Moyenne |
| Tests & Debug | 3-5 jours | Moyenne |
| **TOTAL** | **2-4 semaines** | Moyenne |

---

## 🛠️ Prérequis

### Logiciels à Installer

**Pour iOS et Android:**
- Node.js 18+ ✅ (déjà installé)
- npm ou yarn ✅ (déjà installé)
- Git ✅ (déjà installé)
- Watchman (optionnel, améliore performance)

**Pour Android:**
- Android Studio
- Java JDK 11+
- Android SDK
- Android Emulator

**Pour iOS (Mac uniquement):**
- Xcode 14+
- CocoaPods
- iOS Simulator

---

## 📦 Installation

### Étape 1: Créer le Projet React Native

```bash
# Utiliser Expo (Recommandé pour débuter)
npx create-expo-app@latest football-booking-mobile

# OU React Native CLI (Plus de contrôle)
npx react-native init FootballBookingMobile

# Naviguer dans le projet
cd football-booking-mobile
```

### Étape 2: Installer les Dépendances

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# UI/Design
npm install react-native-paper
npm install react-native-vector-icons

# HTTP & State
npm install axios
npm install zustand

# Maps & Location
npm install react-native-maps
npm install @react-native-community/geolocation

# Calendrier & Dates
npm install react-native-calendars
npm install date-fns

# Images & Médias
npm install react-native-image-picker
npm install react-native-fast-image

# Notifications
npm install @notifee/react-native

# Paiement Mobile Money
npm install react-native-webview

# Storage Local
npm install @react-native-async-storage/async-storage

# Icons
npm install react-native-vector-icons
```

---

## 🏗️ Structure du Projet

```
football-booking-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── OnboardingScreen.js
│   │   ├── home/
│   │   │   ├── HomeScreen.js
│   │   │   └── SearchScreen.js
│   │   ├── terrains/
│   │   │   ├── TerrainListScreen.js
│   │   │   ├── TerrainDetailScreen.js
│   │   │   └── MapScreen.js
│   │   ├── booking/
│   │   │   ├── BookingScreen.js
│   │   │   ├── CalendarScreen.js
│   │   │   └── PaymentScreen.js
│   │   ├── profile/
│   │   │   ├── ProfileScreen.js
│   │   │   ├── ReservationsScreen.js
│   │   │   └── TeamsScreen.js
│   │   └── owner/
│   │       ├── DashboardScreen.js
│   │       └── ManageTerrainScreen.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   └── Loading.js
│   │   ├── terrain/
│   │   │   ├── TerrainCard.js
│   │   │   ├── TerrainFilters.js
│   │   │   └── TerrainMap.js
│   │   ├── booking/
│   │   │   ├── TimeSlotPicker.js
│   │   │   └── ReservationSummary.js
│   │   └── layout/
│   │       ├── Header.js
│   │       └── TabBar.js
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   │
│   ├── services/
│   │   ├── api.js (RÉUTILISÉ du web!)
│   │   ├── auth.js
│   │   ├── location.js
│   │   ├── notifications.js
│   │   └── storage.js
│   │
│   ├── context/
│   │   ├── AuthContext.js (RÉUTILISÉ!)
│   │   └── AppContext.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   └── constants/
│       ├── colors.js
│       └── config.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── App.js
├── app.json
└── package.json
```

---

## 🎨 Composants React Native

### 1. TerrainCard.js

```javascript
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, MapPin } from 'react-native-feather';

const TerrainCard = ({ terrain, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: terrain.images?.[0]?.url || 'https://via.placeholder.com/300x200' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{terrain.name}</Text>
        
        <View style={styles.location}>
          <MapPin width={16} height={16} color="#6b7280" />
          <Text style={styles.locationText}>
            {terrain.address.city}, {terrain.address.region}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Star width={16} height={16} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>
              {terrain.rating?.average?.toFixed(1) || 'N/A'}
            </Text>
            <Text style={styles.reviewCount}>
              ({terrain.rating?.count || 0} avis)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {terrain.pricePerHour.toLocaleString()} FCFA
            </Text>
            <Text style={styles.priceUnit}>/h</Text>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{terrain.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 2,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TerrainCard;
```

---

### 2. SearchScreen.js

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { terrainAPI } from '../services/api';
import TerrainCard from '../components/terrain/TerrainCard';
import { Search, Filter } from 'react-native-feather';

const SearchScreen = ({ navigation }) => {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    size: '',
  });

  useEffect(() => {
    loadTerrains();
  }, [filters]);

  const loadTerrains = async () => {
    try {
      const response = await terrainAPI.getAll(filters);
      setTerrains(response.data.data);
    } catch (error) {
      console.error('Error loading terrains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const renderTerrain = ({ item }) => (
    <TerrainCard
      terrain={item}
      onPress={() => navigation.navigate('TerrainDetail', { terrainId: item._id })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search width={20} height={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un terrain..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('Filters', { filters, setFilters })}
        >
          <Filter width={20} height={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={styles.loader} />
      ) : (
        <FlatList
          data={terrains}
          renderItem={renderTerrain}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucun terrain trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#16a34a',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default SearchScreen;
```

---

### 3. Navigation (AppNavigator.js)

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Calendar, User } from 'react-native-feather';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/terrains/SearchScreen';
import TerrainDetailScreen from '../screens/terrains/TerrainDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home width={size} height={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Rechercher',
          tabBarIcon: ({ color, size }) => <Search width={size} height={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ProfileScreen}
        options={{
          title: 'Réservations',
          tabBarIcon: ({ color, size }) => <Calendar width={size} height={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User width={size} height={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TerrainDetail"
          component={TerrainDetailScreen}
          options={{ title: 'Détails du terrain' }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: 'Réserver' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

### 4. Service API (RÉUTILISÉ du Web!)

```javascript
// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://football-booking-api.onrender.com/api'; // Votre API en production

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// MÊME API QUE LE WEB - Déjà prêt!
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const terrainAPI = {
  getAll: (params) => api.get('/terrains', { params }),
  getOne: (id) => api.get(`/terrains/${id}`),
  getAvailability: (id, date) => api.get(`/terrains/${id}/availability`, { params: { date } }),
};

export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  create: (data) => api.post('/reservations', data),
  cancel: (id, reason) => api.put(`/reservations/${id}/cancel`, { cancellationReason: reason }),
};

export const paymentAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  verify: (id) => api.get(`/payments/verify/${id}`),
};

export default api;
```

---

### 5. HomeScreen.js

```javascript
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Search, MapPin, Users } from 'react-native-feather';

const HomeScreen = ({ navigation }) => {
  const sports = [
    { id: 'football', name: 'Football', icon: '⚽', color: '#16a34a' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#f97316' },
    { id: 'natation', name: 'Natation', icon: '🏊', color: '#3b82f6' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Trouvez Votre{'\n'}Terrain</Text>
        <Text style={styles.heroSubtitle}>
          Plus de 50 terrains disponibles au Sénégal
        </Text>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Search width={20} height={20} color="#fff" />
          <Text style={styles.searchButtonText}>Rechercher un terrain</Text>
        </TouchableOpacity>
      </View>

      {/* Sports Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rechercher par Sport</Text>
        
        <View style={styles.sportsGrid}>
          {sports.map(sport => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportCard, { backgroundColor: sport.color }]}
              onPress={() => navigation.navigate('Search', { sport: sport.id })}
            >
              <Text style={styles.sportIcon}>{sport.icon}</Text>
              <Text style={styles.sportName}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* How it Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Search width={24} height={24} color="#16a34a" />
            </View>
            <Text style={styles.stepTitle}>1. Recherchez</Text>
            <Text style={styles.stepText}>
              Trouvez le terrain parfait près de vous
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <MapPin width={24} height={24} color="#16a34a" />
            </View>
            <Text style={styles.stepTitle}>2. Réservez</Text>
            <Text style={styles.stepText}>
              Choisissez votre créneau en ligne
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Users width={24} height={24} color="#16a34a" />
            </View>
            <Text style={styles.stepTitle}>3. Jouez</Text>
            <Text style={styles.stepText}>
              Présentez-vous et profitez
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  hero: {
    backgroundColor: '#16a34a',
    padding: 32,
    paddingTop: 48,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  sportsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sportCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sportIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  sportName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  steps: {
    gap: 16,
  },
  step: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default HomeScreen;
```

---

### 6. CalendarScreen.js (Réservation)

```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = ({ route, navigation }) => {
  const { terrain } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      navigation.navigate('Payment', {
        terrain,
        date: selectedDate,
        startTime: selectedSlot,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Choisissez une date</Text>
        
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#16a34a' }
          }}
          theme={{
            selectedDayBackgroundColor: '#16a34a',
            todayTextColor: '#16a34a',
            arrowColor: '#16a34a',
          }}
          minDate={new Date().toISOString().split('T')[0]}
        />

        {selectedDate && (
          <>
            <Text style={styles.slotsTitle}>Créneaux disponibles</Text>
            <View style={styles.slotsGrid}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slot,
                    selectedSlot === slot && styles.slotSelected
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text style={[
                    styles.slotText,
                    selectedSlot === slot && styles.slotTextSelected
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {selectedDate && selectedSlot && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    padding: 20,
    color: '#111827',
  },
  slotsTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 20,
    paddingBottom: 12,
    color: '#111827',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  slot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  slotTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  continueButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CalendarScreen;
```

---

### 7. Paiement Mobile Money (PaymentScreen.js)

```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { paymentAPI } from '../services/api';

const PaymentScreen = ({ route, navigation }) => {
  const { reservation } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'wave', name: 'Wave', icon: '🌊', color: '#00A3E0' },
    { id: 'orange_money', name: 'Orange Money', icon: '🍊', color: '#FF7900' },
    { id: 'free_money', name: 'Free Money', icon: '💳', color: '#E51D2A' },
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.initiate({
        reservationId: reservation._id,
        paymentMethod,
        phoneNumber
      });

      if (response.data.success) {
        // Rediriger vers confirmation
        navigation.navigate('PaymentSuccess', { payment: response.data.data });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payer votre réservation</Text>

      {/* Amount */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Montant à payer</Text>
        <Text style={styles.amount}>{reservation.finalPrice} FCFA</Text>
      </View>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>Méthode de paiement</Text>
      {paymentMethods.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            paymentMethod === method.id && styles.methodSelected
          ]}
          onPress={() => setPaymentMethod(method.id)}
        >
          <View style={styles.methodInfo}>
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <Text style={styles.methodName}>{method.name}</Text>
          </View>
          <View style={[
            styles.radio,
            paymentMethod === method.id && styles.radioSelected
          ]} />
        </TouchableOpacity>
      ))}

      {/* Phone Number */}
      <Text style={styles.sectionTitle}>Numéro de téléphone</Text>
      <TextInput
        style={styles.input}
        placeholder="+221 XX XXX XX XX"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, (!phoneNumber || loading) && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!phoneNumber || loading}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Traitement...' : `Payer ${reservation.finalPrice} FCFA`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },
  amountCard: {
    backgroundColor: '#dcfce7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16a34a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  methodCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodSelected: {
    borderColor: '#16a34a',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 32,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  radioSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#16a34a',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  payButton: {
    backgroundColor: '#16a34a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PaymentScreen;
```

---

### 8. Géolocalisation (MapScreen.js)

```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { MapPin } from 'react-native-feather';

const MapScreen = ({ terrains, onTerrainPress }) => {
  const [region, setRegion] = useState({
    latitude: 14.7167, // Dakar
    longitude: -17.4677,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Obtenir la position actuelle
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {terrains.map(terrain => (
          <Marker
            key={terrain._id}
            coordinate={{
              latitude: terrain.address.coordinates?.coordinates[1] || 14.7167,
              longitude: terrain.address.coordinates?.coordinates[0] || -17.4677,
            }}
            onPress={() => onTerrainPress(terrain)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                {terrain.pricePerHour.toLocaleString()}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.listButton}>
        <Text style={styles.listButtonText}>Liste</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  listButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  listButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default MapScreen;
```

---

### 9. Notifications Push

```javascript
// src/services/notifications.js
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus;
};

export const displayNotification = async (title, body, data = {}) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'football-booking',
      smallIcon: 'ic_launcher',
      color: '#16a34a',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
    data,
  });
};

export const scheduleReservationReminder = async (reservation, terrain) => {
  const reservationDate = new Date(reservation.date);
  const [hours, minutes] = reservation.startTime.split(':');
  reservationDate.setHours(hours, minutes);
  
  // Notification 24h avant
  const reminderTime = new Date(reservationDate.getTime() - 24 * 60 * 60 * 1000);

  await notifee.createTriggerNotification(
    {
      title: 'Rappel de réservation',
      body: `Votre match au ${terrain.name} est demain à ${reservation.startTime}`,
      android: {
        channelId: 'football-booking',
      },
    },
    {
      type: 'timestamp',
      timestamp: reminderTime.getTime(),
    }
  );
};
```

---

## 🎨 Design System Mobile

### Couleurs (Identiques au Web)

```javascript
// src/constants/colors.js
export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  orange: {
    500: '#f97316',
    600: '#ea580c',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
};
```

### Spacing

```javascript
// src/constants/spacing.js
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

### Typography

```javascript
// src/constants/typography.js
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
};
```

---

## 🔧 Configuration

### package.json

```json
{
  "name": "football-booking-mobile",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.2",
    "axios": "^1.6.2",
    "react-native-maps": "^1.10.0",
    "@react-native-community/geolocation": "^3.2.1",
    "react-native-calendars": "^1.1302.0",
    "date-fns": "^2.30.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-image-picker": "^7.1.0",
    "react-native-fast-image": "^8.6.3",
    "@notifee/react-native": "^7.8.2",
    "react-native-webview": "^13.6.4",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@react-native/babel-preset": "0.73.18",
    "@react-native/metro-config": "0.73.2",
    "jest": "^29.7.0"
  }
}
```

---

## 🚀 Commandes de Lancement

### Android

```bash
# Démarrer Metro
npx react-native start

# Lancer sur émulateur Android
npx react-native run-android

# Lancer sur device Android (USB)
npx react-native run-android --device
```

### iOS (Mac uniquement)

```bash
# Installer pods
cd ios && pod install && cd ..

# Lancer sur simulateur
npx react-native run-ios

# Lancer sur iPhone spécifique
npx react-native run-ios --device "iPhone de User"
```

---

## 📦 Build pour Production

### Android (APK/AAB)

```bash
# Générer signing key
keytool -genkey -v -keystore football-booking.keystore -alias football-booking -keyalg RSA -keysize 2048 -validity 10000

# Build Release
cd android
./gradlew assembleRelease

# APK sera dans:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS (IPA)

```bash
# Via Xcode
1. Ouvrir ios/FootballBookingMobile.xcworkspace
2. Product → Archive
3. Distribute App → App Store Connect
```

---

## 🌟 Fonctionnalités Natives Spécifiques

### 1. Géolocalisation en Temps Réel

```javascript
// Trouver terrains à proximité
import Geolocation from '@react-native-community/geolocation';

const findNearbyTerrains = () => {
  Geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await terrainAPI.getAll({
        latitude,
        longitude,
        radius: 5000 // 5km
      });
      setNearbyTerrains(response.data.data);
    }
  );
};
```

### 2. Partage Social

```javascript
import Share from 'react-native-share';

const shareTerrain = async (terrain) => {
  await Share.open({
    message: `Découvrez ${terrain.name} sur FootballSN!`,
    url: `https://footballsn.com/terrains/${terrain._id}`,
    title: 'Partager ce terrain',
  });
};
```

### 3. Caméra (Upload Photos)

```javascript
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const uploadTerrainPhoto = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  });

  if (result.assets) {
    const photo = result.assets[0];
    // Upload vers Cloudinary ou votre backend
  }
};
```

### 4. Deep Linking

```javascript
// Ouvrir terrain depuis lien externe
const linking = {
  prefixes: ['footballsn://', 'https://footballsn.com'],
  config: {
    screens: {
      TerrainDetail: 'terrains/:id',
      Booking: 'booking/:terrainId',
    },
  },
};

// Exemple: footballsn://terrains/123456
```

---

## 🎯 Roadmap React Native

### Semaine 1: Setup & Navigation
- [ ] Créer projet React Native
- [ ] Setup navigation (Stack + Tabs)
- [ ] Créer screens de base
- [ ] Intégrer AuthContext

### Semaine 2: UI & Composants
- [ ] Créer composants UI (Button, Card, Input)
- [ ] Implémenter TerrainCard
- [ ] Page Search avec filtres
- [ ] Page Détail terrain

### Semaine 3: Fonctionnalités
- [ ] Système de réservation
- [ ] Calendrier de sélection
- [ ] Intégration paiement
- [ ] Profil utilisateur

### Semaine 4: Features Natives
- [ ] Géolocalisation + Maps
- [ ] Notifications push
- [ ] Upload photos
- [ ] Mode hors-ligne

### Semaine 5: Tests & Déploiement
- [ ] Tests sur devices
- [ ] Optimisation performance
- [ ] Build production
- [ ] Soumission aux stores

---

## 💰 Coûts Application Mobile

### Développement
- React Native: Gratuit (open source)
- Librairies: Gratuites

### Stores
- Google Play Store: 25$ (paiement unique)
- Apple App Store: 99$/an

### Services Tiers (Optionnel)
- Cloudinary (images): Gratuit jusqu'à 25 GB
- Firebase (notifications): Gratuit jusqu'à 100k messages/mois
- Google Maps: 200$/mois gratuit

### Total Minimum
- **Première année**: ~125$ (stores uniquement)
- **Années suivantes**: ~100$/an (Apple Store)

---

## 📚 Ressources d'Apprentissage

### Documentation Officielle
- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Expo: https://docs.expo.dev

### Tutoriels Vidéo
- YouTube: "React Native Full Course"
- Udemy: "The Complete React Native + Hooks Course"

### Communautés
- Discord React Native
- Stack Overflow
- Reddit r/reactnative

---

## 🔄 Migration Web → Mobile

### Ce qui est DÉJÀ PRÊT (70%):

```javascript
✅ Backend API complet (aucun changement!)
✅ Service API (api.js) - Copier-coller
✅ AuthContext - Adapter légèrement
✅ Logique métier - Réutiliser
✅ Validation - Réutiliser
✅ Modèles de données - Identiques
```

### Ce qui doit être CRÉÉ (30%):

```javascript
⚠️ Composants UI (StyleSheet au lieu de Tailwind)
⚠️ Navigation (React Navigation)
⚠️ Layouts mobile
⚠️ Gestes tactiles
⚠️ Permissions (caméra, localisation)
```

---

## 🎨 Design Mobile UI/UX

### Principes Mobile-First

1. **Thumb Zone**: Boutons importants en bas (zone du pouce)
2. **Touch Targets**: Min 44x44px
3. **Swipe Gestures**: Navigation par gestes
4. **Bottom Tabs**: Navigation principale
5. **Modal Screens**: Détails, filtres
6. **Pull to Refresh**: Actualiser les listes
7. **Infinite Scroll**: Pagination automatique

### Patterns Recommandés

```
┌─────────────────┐
│   Header        │
├─────────────────┤
│                 │
│   ScrollView    │
│   Content       │
│                 │
├─────────────────┤
│  Bottom Tabs    │
│ 🏠 🔍 📅 👤    │
└─────────────────┘
```

---

## 🚀 Déploiement

### Google Play Store

**Étapes:**
1. Créer compte Google Play Console (25$)
2. Générer APK signé
3. Créer listing (description, screenshots)
4. Upload APK
5. Soumettre pour review (2-3 jours)

### Apple App Store

**Étapes:**
1. Compte Apple Developer (99$/an)
2. Créer App ID dans App Store Connect
3. Build via Xcode
4. Upload via Transporter
5. Soumettre pour review (1-7 jours)

---

## 📊 Comparaison Web vs Mobile

| Fonctionnalité | Web | React Native |
|----------------|-----|--------------|
| Recherche terrains | ✅ | ✅ |
| Filtres avancés | ✅ | ✅ |
| Carte interactive | Google Maps API | React Native Maps |
| Réservation | ✅ | ✅ |
| Paiement | Wave/Orange/Free | WebView ou SDK natif |
| Notifications | Email/SMS | Push + Email/SMS |
| Hors-ligne | PWA | AsyncStorage |
| Caméra | Input file | Native Camera |
| Géolocalisation | Navigator API | Geolocation native |
| Performance | Bonne | Excellente |

---

## 🎯 Template de Démarrage

### App.js (Point d'entrée)

```javascript
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
```

---

## 💡 Conseils Pro

### À Faire
- ✅ Commencez par Expo (plus simple)
- ✅ Testez sur vrais devices dès le début
- ✅ Utilisez TypeScript (meilleure maintenabilité)
- ✅ Suivez les guidelines iOS et Android
- ✅ Optimisez les images (FastImage)
- ✅ Implementez error boundaries

### À Éviter
- ❌ Trop d'animations (performance)
- ❌ Bibliothèques obsolètes
- ❌ Ignorer les guidelines des stores
- ❌ Négliger la sécurité (stockage tokens)

---

## 📱 Screenshots Requis pour Stores

### Google Play Store
- Min 2 screenshots par appareil (phone, tablet, 7-inch tablet)
- Format: PNG ou JPG
- Résolution: 16:9
- Tailles: 1080x1920, 1440x2560, 2560x1440

### Apple App Store
- 5.5" (iPhone 8 Plus): 1242 x 2208
- 6.5" (iPhone 11 Pro Max): 1242 x 2688
- 12.9" (iPad Pro): 2048 x 2732

---

## 🎉 Résultat Final - App Mobile

### Fonctionnalités

**Authentification:**
- Login avec Face ID/Touch ID
- Biométrie
- Remember me

**Recherche:**
- Vue Liste + Vue Carte
- Filtres avancés
- Géolocalisation automatique
- Recherche vocale (optionnel)

**Réservation:**
- Calendrier natif
- Time picker
- Récapitulatif visuel
- Confirmation instantanée

**Paiement:**
- Wave Money
- Orange Money
- Free Money
- Historique des paiements

**Profil:**
- Gestion compte
- Mes réservations
- Mes équipes
- Paramètres

**Notifications:**
- Push (réservation confirmée)
- Rappels 24h avant
- Promotions
- Nouvelles de l'équipe

---

## 📞 Support Technique

### Documentation
- React Native Docs: https://reactnative.dev/docs/getting-started
- React Navigation: https://reactnavigation.org/docs/getting-started
- Expo: https://docs.expo.dev

### Communautés
- Reactiflux Discord
- React Native Community
- Stack Overflow

---

## 🎯 Prochaines Étapes

### Quand Démarrer React Native ?

**Attendez d'avoir:**
1. ✅ Site web 100% opérationnel
2. ✅ Premiers utilisateurs et retours
3. ✅ Contenu (50+ terrains)
4. ✅ Budget pour les stores (125$)
5. ✅ Temps de développement (3-4 semaines)

**Ou commencez maintenant si:**
- Vous voulez tester rapidement
- Vous avez le temps
- Budget disponible

---

**📱 Documentation React Native complète créée ! Passons maintenant à l'amélioration de votre site web ! 🚀**


