# 🔐 CONFIGURATION DES CONNEXIONS SOCIALES

## ✅ **État Actuel**

Les boutons de connexion Google et Facebook sont **déjà intégrés** dans l'interface !

- ✅ Boutons visibles sur `/login`
- ✅ Design moderne et responsive
- ✅ Routes backend créées (`/api/auth/google`, `/api/auth/facebook`)
- ✅ Système prêt à recevoir la configuration OAuth

---

## 🚀 **Pour activer les connexions sociales**

### **Étape 1 : Google OAuth**

#### **1.1 Créer une app Google**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un
3. Activez **Google+ API**
4. Allez dans **Identifiants** → **Créer des identifiants** → **ID client OAuth**
5. Type d'application : **Application Web**
6. Origines JavaScript autorisées :
   ```
   http://localhost:5175
   https://football-booking-platform-frontend.vercel.app
   ```
7. URI de redirection autorisés :
   ```
   http://localhost:5000/api/auth/google/callback
   https://football-booking-backend.vercel.app/api/auth/google/callback
   ```

#### **1.2 Configurer les variables d'environnement**

Ajoutez dans `backend/.env` :
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

### **Étape 2 : Facebook OAuth**

#### **2.1 Créer une app Facebook**
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle app
3. Ajoutez le produit **Facebook Login**
4. Dans **Paramètres** → **De base**, notez l'App ID et l'App Secret
5. Dans **Facebook Login** → **Paramètres**, ajoutez les URI de redirection :
   ```
   http://localhost:5000/api/auth/facebook/callback
   https://football-booking-backend.vercel.app/api/auth/facebook/callback
   ```

#### **2.2 Configurer les variables d'environnement**

Ajoutez dans `backend/.env` :
```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

---

### **Étape 3 : Installer Passport.js**

```bash
cd backend
npm install passport passport-google-oauth20 passport-facebook
```

---

### **Étape 4 : Implémenter Passport.js**

#### **4.1 Créer `backend/src/config/passport.js`**

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Chercher si l'utilisateur existe déjà
        let user = await User.findOne({ 'socialAuth.googleId': profile.id });

        if (!user) {
          // Créer un nouvel utilisateur
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            socialAuth: {
              provider: 'google',
              googleId: profile.id
            },
            isVerified: true,
            role: 'client'
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Chercher si l'utilisateur existe déjà
        let user = await User.findOne({ 'socialAuth.facebookId': profile.id });

        if (!user) {
          // Créer un nouvel utilisateur
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            socialAuth: {
              provider: 'facebook',
              facebookId: profile.id
            },
            isVerified: true,
            role: 'client'
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

module.exports = passport;
```

#### **4.2 Modifier `backend/src/models/User.js`**

Ajouter dans le schéma :
```javascript
socialAuth: {
  provider: {
    type: String,
    enum: ['google', 'facebook', 'local'],
    default: 'local'
  },
  googleId: String,
  facebookId: String
},
```

#### **4.3 Mettre à jour les routes**

Remplacer le contenu de `backend/src/routes/socialAuth.js` par les vraies routes Passport.

---

## 🧪 **Test**

Une fois configuré :

1. Allez sur `http://localhost:5175/login`
2. Cliquez sur **"Continuer avec Google"**
3. Authentifiez-vous avec votre compte Google
4. Vous serez redirigé vers le dashboard avec votre compte créé automatiquement

---

## 📝 **Notes**

- Les routes sont **déjà créées** et prêtes
- Les boutons sont **déjà visibles** sur la page de login
- Il ne manque que la **configuration OAuth** (clés API)
- Une fois configuré, tout marchera automatiquement ! 🎉

---

## ❓ **Besoin d'aide ?**

Si vous voulez activer les connexions sociales maintenant, suivez les étapes ci-dessus ou demandez-moi de vous guider pas à pas ! 🚀

