# 🖥️ Guide des Commandes Terminal PowerShell

## 🎓 GUIDE DÉBUTANT : Git pour les Nuls avec Exemples Réels

### 🤔 C'est quoi Git et GitHub ? (Analogie Simple)

Imaginez que vous écrivez un livre :

- **Votre ordinateur** = Votre brouillon personnel
- **Git** = Une machine à photocopier qui sauvegarde chaque version
- **GitHub** = Une bibliothèque en ligne où tout le monde peut voir votre livre

**Pourquoi c'est important ?**
- Si votre ordinateur crash, votre code est sauvegardé sur GitHub ✅
- Vous pouvez revenir en arrière si vous cassez quelque chose ✅
- D'autres développeurs peuvent collaborer avec vous ✅
- Les recruteurs peuvent voir vos projets ✅

---

## 📚 TUTORIEL PAS À PAS : Votre Premier Commit

### 🎯 Exercice Pratique #1 : Modifier et Sauvegarder

**Scénario** : Vous venez d'ajouter un nouveau terrain de football dans votre base de données et vous voulez sauvegarder ce changement sur GitHub.

#### **Étape 0 : Ouvrir PowerShell**

1. Appuyez sur **Windows + R**
2. Tapez `powershell` et appuyez sur **Entrée**
3. Une fenêtre bleue s'ouvre (c'est PowerShell)

---

#### **Étape 1 : Aller dans votre projet**

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
```

**Explication** :
- `cd` = "Change Directory" (changer de dossier)
- C'est comme double-cliquer sur un dossier, mais en ligne de commande

**Ce que vous verrez** :
```
PS C:\Users\wopal\Desktop\football-booking-platform>
```

✅ **Vous êtes maintenant dans le bon dossier !**

---

#### **Étape 2 : Faire une modification (EXERCICE RÉEL)**

**Modifions le README.md pour ajouter votre nom !**

1. Ouvrez le fichier `README.md` dans votre éditeur de code
2. Trouvez la ligne : `## 👥 Auteur`
3. Remplacez `Amadou Wopa` par votre vrai nom complet
4. Ajoutez votre email en dessous
5. **SAUVEGARDEZ** le fichier (Ctrl+S)

**Exemple** :
```markdown
## 👥 Auteur

**Nom complet** : Amadou Wopa Diallo
**Email** : amadou.wopa@example.com
**GitHub** : @llodiasen
```

---

#### **Étape 3 : Vérifier ce qui a changé**

```powershell
git status
```

**Ce que vous verrez** (exemple réel) :
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to include in what will be committed)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

**🔍 Comment lire ce message ?**

- ✅ `On branch main` = Vous êtes sur la branche principale (tout va bien)
- 🔴 `modified: README.md` = Le fichier README.md a été modifié (en ROUGE)
- ⚠️ `no changes added to commit` = Git voit le changement mais n'est pas encore prêt à le sauvegarder

**Analogie** : C'est comme si vous aviez écrit sur une feuille, mais que vous ne l'avez pas encore mise dans l'enveloppe.

---

#### **Étape 4 : Ajouter le fichier modifié**

```powershell
git add README.md
```

**OU pour ajouter TOUS les fichiers modifiés** :

```powershell
git add .
```

**Explication** :
- `git add README.md` = Ajouter seulement README.md
- `git add .` = Ajouter TOUS les fichiers modifiés (le point `.` signifie "tout")

**Analogie** : Vous mettez maintenant la feuille dans l'enveloppe, prête à être envoyée.

---

#### **Étape 5 : Re-vérifier**

```powershell
git status
```

**Ce que vous verrez maintenant** :
```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
```

**🔍 Différence importante** :
- Avant : `modified: README.md` en ROUGE
- Maintenant : `modified: README.md` en VERT ✅

**Cela signifie** : Le fichier est prêt à être sauvegardé !

---

#### **Étape 6 : Créer un commit (sauvegarder)**

```powershell
git commit -m "Ajout des informations de l'auteur dans README"
```

**⚠️ ATTENTION aux guillemets !**
- Utilisez des **guillemets doubles** `"message"`
- Le message doit décrire ce que vous avez fait

**Ce que vous verrez** :
```
[main f6fc71f] Ajout des informations de l'auteur dans README
 1 file changed, 3 insertions(+), 1 deletion(-)
```

**🔍 Explication** :
- `1 file changed` = 1 fichier modifié
- `3 insertions(+)` = 3 lignes ajoutées
- `1 deletion(-)` = 1 ligne supprimée

**Analogie** : Vous avez fermé et scellé l'enveloppe. La sauvegarde est créée sur votre ordinateur.

---

#### **Étape 7 : Envoyer vers GitHub**

```powershell
git push
```

**Ce que vous verrez** (ça peut prendre 5-10 secondes) :
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 456 bytes | 456.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/llodiasen/football-booking-platform.git
   f6fc71f..a3b2c9e  main -> main
```

**🔍 Explication** :
- `Enumerating objects` = Git compte les fichiers à envoyer
- `Compressing objects` = Git compresse pour envoyer plus vite
- `Writing objects: 100%` = Envoi en cours
- `To https://github.com/...` = Destination (votre GitHub)
- `main -> main` = Branche envoyée ✅

**Analogie** : L'enveloppe est maintenant à la poste (GitHub) !

---

#### **Étape 8 : Vérifier sur GitHub**

1. Ouvrez votre navigateur
2. Allez sur : **https://github.com/llodiasen/football-booking-platform**
3. Vous devriez voir :
   - Votre dernier commit en haut
   - Le message : "Ajout des informations de l'auteur dans README"
   - Il y a quelques secondes / minutes

**🎉 FÉLICITATIONS ! Vous avez fait votre premier commit professionnel !**

---

## 🎯 Exercice Pratique #2 : Ajouter un Nouveau Terrain

**Scénario réel** : Vous voulez ajouter un fichier JSON avec les terrains de Dakar.

### **Étape 1 : Créer un nouveau fichier**

Créez un fichier : `backend/src/data/terrains-dakar.json`

Contenu :
```json
{
  "terrains": [
    {
      "nom": "Stade Léopold Sédar Senghor",
      "ville": "Dakar",
      "quartier": "Plateau",
      "prix_heure": 50000,
      "type": "Football 11"
    },
    {
      "nom": "Terrain Sacré-Cœur",
      "ville": "Dakar",
      "quartier": "Sacré-Cœur",
      "prix_heure": 25000,
      "type": "Football 5"
    }
  ]
}
```

### **Étape 2 : Voir ce qui a changé**

```powershell
git status
```

**Résultat** :
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        backend/src/data/terrains-dakar.json
```

**🔍 "Untracked files"** = Fichier nouveau que Git n'a jamais vu

### **Étape 3 : Ajouter le nouveau fichier**

```powershell
git add backend/src/data/terrains-dakar.json
```

### **Étape 4 : Créer le commit**

```powershell
git commit -m "Ajout des terrains de football à Dakar"
```

### **Étape 5 : Envoyer**

```powershell
git push
```

**✅ Terminé ! Le fichier est maintenant sur GitHub.**

---

## 🎯 Exercice Pratique #3 : Corriger un Bug

**Scénario** : Vous avez trouvé une faute d'orthographe dans le fichier `frontend/src/pages/Home.jsx`

### **Workflow complet** :

```powershell
# 1. Aller dans le projet
cd C:\Users\wopal\Desktop\football-booking-platform

# 2. Modifier le fichier Home.jsx dans votre éditeur
#    (corrigez la faute et sauvegardez)

# 3. Vérifier
git status

# 4. Ajouter
git add frontend/src/pages/Home.jsx

# 5. Commiter
git commit -m "Correction faute d'orthographe page d'accueil"

# 6. Envoyer
git push
```

**⏱️ Temps total** : 1-2 minutes

---

## 🎯 Exercice Pratique #4 : Plusieurs Fichiers en Même Temps

**Scénario** : Vous avez travaillé toute la journée et modifié :
- Le backend (ajout d'une nouvelle route)
- Le frontend (amélioration du design)
- Le README (mise à jour de la documentation)

### **Workflow simplifié** :

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform

git status                    # Voir tout ce qui a changé

git add .                     # Ajouter TOUT d'un coup

git status                    # Re-vérifier (tout doit être en vert)

git commit -m "Ajout route réservation + amélioration design + màj doc"

git push
```

**💡 Astuce** : Quand vous modifiez plusieurs fichiers liés à une même fonctionnalité, faites UN SEUL commit avec un message descriptif.

---

## 📊 Comprendre "git status" en Détail

### **Exemple de ce que vous pouvez voir** :

```powershell
git status
```

**Résultat possible** :
```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   backend/src/routes/terrains.js
        new file:   backend/src/data/terrains-dakar.json

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   frontend/src/App.jsx
        modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .env.production
```

### **🔍 Décryptage ligne par ligne** :

1. **"Changes to be committed"** (EN VERT) ✅
   - Ces fichiers sont PRÊTS à être sauvegardés
   - Vous avez déjà fait `git add` sur eux

2. **"Changes not staged for commit"** (EN ROUGE) ⚠️
   - Ces fichiers sont modifiés MAIS pas encore ajoutés
   - Vous devez faire `git add` dessus

3. **"Untracked files"** (EN ROUGE) 🆕
   - Ces fichiers sont NOUVEAUX, Git ne les connaît pas
   - Vous devez faire `git add` pour que Git commence à les suivre

### **Que faire maintenant ?**

```powershell
# Option 1 : Tout ajouter d'un coup
git add .

# Option 2 : Ajouter seulement certains fichiers
git add frontend/src/App.jsx
git add README.md
```

---

## 🚨 Erreurs Courantes et Solutions

### **Erreur #1 : "fatal: not a git repository"**

**Message complet** :
```
fatal: not a git repository (or any of the parent directories): .git
```

**Cause** : Vous n'êtes pas dans le bon dossier

**Solution** :
```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
```

---

### **Erreur #2 : "Please tell me who you are"**

**Message complet** :
```
*** Please tell me who you are.

Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**Cause** : C'est la première fois que vous utilisez Git sur cet ordinateur

**Solution** (à faire UNE SEULE FOIS) :
```powershell
git config --global user.name "Amadou Wopa"
git config --global user.email "votre.email@example.com"
```

**Ensuite, refaites votre commit** :
```powershell
git commit -m "Votre message"
```

---

### **Erreur #3 : "nothing to commit, working tree clean"**

**Message** :
```
nothing to commit, working tree clean
```

**Cause** : Vous n'avez rien modifié OU vous avez oublié de sauvegarder vos fichiers dans l'éditeur

**Solution** :
1. Vérifiez que vous avez bien sauvegardé (Ctrl+S)
2. Faites `git status` pour voir s'il y a des changements

---

### **Erreur #4 : Mot de passe demandé (mais le token ne fonctionne pas)**

**Cause** : Windows utilise un ancien mot de passe en cache

**Solution** :
```powershell
# Supprimer les identifiants en cache
git credential-manager uninstall
git credential-manager install
```

Ou utilisez l'URL avec le token (déjà fait) :
```powershell
git remote set-url origin https://ghp_VOTRE_TOKEN@github.com/llodiasen/football-booking-platform.git
```

---

## 📅 Routine Quotidienne (À Imprimer et Coller sur Votre Bureau)

### **🌅 Début de journée**

```powershell
# 1. Ouvrir PowerShell
# 2. Aller dans le projet
cd C:\Users\wopal\Desktop\football-booking-platform

# 3. Récupérer les derniers changements (si vous travaillez en équipe)
git pull

# 4. Démarrer le backend (Terminal 1)
cd backend
npm run dev

# 5. Démarrer le frontend (Terminal 2 - nouveau)
cd C:\Users\wopal\Desktop\football-booking-platform\frontend
npm run dev
```

---

### **💻 Pendant le travail** (toutes les 30-60 min)

```powershell
# Sauvegarder rapidement
git add .
git commit -m "Description courte de ce que vous venez de faire"
git push
```

**Exemples de messages selon ce que vous faites** :
- `"Ajout formulaire de réservation"`
- `"Correction bug affichage terrains"`
- `"Amélioration style navbar"`
- `"Ajout validation email"`
- `"WIP: travail en cours sur page paiement"` (WIP = Work In Progress)

---

### **🌙 Fin de journée**

```powershell
# 1. Arrêter les serveurs (Ctrl+C dans chaque terminal)

# 2. Sauvegarder tout
cd C:\Users\wopal\Desktop\football-booking-platform
git status
git add .
git commit -m "Fin de journée - sauvegarde du travail"
git push

# 3. Vérifier sur GitHub
# Allez sur https://github.com/llodiasen/football-booking-platform
```

---

## 🎓 Exercice Final : Workflow Complet

**Mission** : Ajouter un nouveau fichier de configuration pour les paiements mobiles.

### **Étape par étape (FAITES-LE MAINTENANT !)** :

1. **Créez le fichier** : `backend/src/config/mobile-payments.js`

```javascript
// Configuration des paiements mobiles (Sénégal)
module.exports = {
  wave: {
    apiUrl: process.env.WAVE_API_URL,
    merchantId: process.env.WAVE_MERCHANT_ID
  },
  orangeMoney: {
    apiUrl: process.env.ORANGE_MONEY_API_URL,
    merchantId: process.env.ORANGE_MONEY_MERCHANT_ID
  },
  freeMoney: {
    apiUrl: process.env.FREE_MONEY_API_URL,
    merchantId: process.env.FREE_MONEY_MERCHANT_ID
  }
};
```

2. **Sauvegardez** le fichier (Ctrl+S)

3. **Dans PowerShell** :

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform

git status
# Vous devriez voir : new file: backend/src/config/mobile-payments.js en ROUGE

git add backend/src/config/mobile-payments.js

git status
# Maintenant en VERT

git commit -m "Ajout configuration paiements mobiles (Wave, Orange, Free)"

git push
```

4. **Vérifiez sur GitHub** : https://github.com/llodiasen/football-booking-platform

**✅ Si vous voyez votre nouveau fichier sur GitHub = BRAVO !**

---

# 🖥️ Guide des Commandes Terminal PowerShell

## 📁 Navigation dans les dossiers

```powershell
# Aller dans le dossier principal du projet
cd C:\Users\wopal\Desktop\football-booking-platform

# Aller dans le dossier backend
cd C:\Users\wopal\Desktop\football-booking-platform\backend

# Aller dans le dossier frontend
cd C:\Users\wopal\Desktop\football-booking-platform\frontend

# Revenir au dossier parent
cd ..

# Afficher le dossier actuel
pwd

# Lister les fichiers du dossier actuel
ls
# ou
dir

# Vider l'écran du terminal
cls
```

---

## 🚀 Démarrer les Serveurs

### Backend (API - Port 5000)

```powershell
# Terminal 1 : Démarrer le backend
cd C:\Users\wopal\Desktop\football-booking-platform\backend
npm run dev
```

**Résultat attendu** :
```
✅ MongoDB connecté: ac-hucieeh-shard-00-02.tuwrfir.mongodb.net
🚀 Serveur démarré sur http://localhost:5000
```

### Frontend (Interface - Port 5173 ou 5174)

```powershell
# Terminal 2 : Démarrer le frontend
cd C:\Users\wopal\Desktop\football-booking-platform\frontend
npm run dev
```

**Résultat attendu** :
```
VITE v5.4.21  ready in 1353 ms
➜  Local:   http://localhost:5173/
```

---

## 🛑 Arrêter les Serveurs

```powershell
# Appuyer sur cette combinaison de touches dans le terminal :
Ctrl + C

# Si cela ne fonctionne pas, fermer le terminal
```

---

## 📦 Gestion des Packages NPM

```powershell
# Installer les dépendances (première fois ou après clonage)
npm install

# Installer un nouveau package
npm install nom-du-package

# Désinstaller un package
npm uninstall nom-du-package

# Voir les packages installés
npm list --depth=0

# Mettre à jour les packages
npm update
```

---

## 🔄 Git - Envoyer vos Modifications sur GitHub

### 📖 Comprendre le Workflow Git

Quand vous modifiez des fichiers en local, voici les étapes pour les envoyer sur GitHub :

```
Fichiers modifiés → git add → git commit → git push → GitHub
    (local)         (staging)   (sauvegarde)  (envoi)    (en ligne)
```

---

### 🎯 Étapes Détaillées (À FAIRE DANS L'ORDRE)

#### **Étape 1 : Vérifier ce qui a changé**

```powershell
# Se placer dans le dossier principal du projet
cd C:\Users\wopal\Desktop\football-booking-platform

# Voir tous les fichiers modifiés
git status
```

**Ce que vous verrez** :
- 🔴 En **rouge** : Fichiers modifiés mais pas encore ajoutés
- 🟢 En **vert** : Fichiers prêts à être committés

**Exemple de résultat** :
```
Changes not staged for commit:
  modified:   backend/src/server.js
  modified:   frontend/src/App.jsx
```

---

#### **Étape 2 : Ajouter les fichiers modifiés**

```powershell
# Option A : Ajouter TOUS les fichiers modifiés (recommandé)
git add .

# Option B : Ajouter UN seul fichier spécifique
git add backend/src/server.js

# Option C : Ajouter plusieurs fichiers spécifiques
git add backend/src/server.js frontend/src/App.jsx
```

**Explication** :
- `git add .` → Le point (`.`) signifie "tout ajouter"
- Cette commande prépare vos fichiers pour la sauvegarde

---

#### **Étape 3 : Vérifier ce qui va être sauvegardé**

```powershell
# Voir les fichiers en vert (prêts à être committés)
git status
```

**Vous devriez voir** :
```
Changes to be committed:
  modified:   backend/src/server.js    (en VERT)
  modified:   frontend/src/App.jsx     (en VERT)
```

---

#### **Étape 4 : Créer un commit (sauvegarder)**

```powershell
# Créer un commit avec un message descriptif
git commit -m "Ajout de la fonctionnalité de réservation"
```

**⚠️ IMPORTANT : Le message doit être clair !**

**Exemples de BONS messages** :
```powershell
git commit -m "Ajout du formulaire d'inscription"
git commit -m "Correction du bug de connexion MongoDB"
git commit -m "Amélioration du design de la page d'accueil"
git commit -m "Mise à jour du README"
```

**Exemples de MAUVAIS messages** ❌ :
```powershell
git commit -m "modif"          # Trop vague
git commit -m "test"           # Pas informatif
git commit -m "ça marche"      # Pas professionnel
```

---

#### **Étape 5 : Envoyer vers GitHub**

```powershell
# Pousser vers GitHub
git push
```

**Si c'est la première fois** ou si vous avez une erreur, utilisez :
```powershell
git push -u origin main
```

**Ce qui se passe** :
- Vos fichiers sont envoyés sur GitHub
- Vous verrez un compteur de progression
- À la fin, vous verrez "✓ Done"

---

### 🚀 Workflow Complet en Une Fois

**Tapez ces commandes UNE PAR UNE** (PowerShell n'accepte pas `&&`) :

```powershell
# 1. Se placer dans le projet
cd C:\Users\wopal\Desktop\football-booking-platform

# 2. Voir ce qui a changé
git status

# 3. Ajouter tous les fichiers
git add .

# 4. Vérifier ce qui va être sauvegardé
git status

# 5. Créer le commit
git commit -m "Description claire de vos modifications"

# 6. Envoyer vers GitHub
git push
```

---

### 📝 Exemples Pratiques Complets

#### **Exemple 1 : Vous avez modifié le backend**

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
git status                                    # Voir les modifs
git add .                                     # Tout ajouter
git commit -m "Ajout de l'API de paiement"   # Sauvegarder
git push                                      # Envoyer
```

#### **Exemple 2 : Vous avez corrigé un bug**

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
git add .
git commit -m "Correction du bug d'authentification"
git push
```

#### **Exemple 3 : Vous avez ajouté une nouvelle page**

```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
git add .
git commit -m "Création de la page de profil utilisateur"
git push
```

---

### 🔍 Vérifier sur GitHub

Après avoir fait `git push` :

1. **Allez sur** : https://github.com/llodiasen/football-booking-platform
2. **Vous verrez** : Votre dernier commit et message
3. **Cliquez sur "Commits"** : Pour voir l'historique complet

---

### ⚠️ Que Faire en Cas d'Erreur ?

#### **Erreur : "Your branch is behind"**

```powershell
# Récupérer les derniers changements depuis GitHub
git pull

# Ensuite, refaire le push
git push
```

#### **Erreur : "Please tell me who you are"**

```powershell
# Configurer votre nom et email Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

#### **Erreur : Conflit de fichiers**

```powershell
# 1. Récupérer les changements
git pull

# 2. Git vous montrera les fichiers en conflit
# 3. Ouvrez les fichiers et corrigez manuellement
# 4. Puis :
git add .
git commit -m "Résolution des conflits"
git push
```

---

### 🎓 Astuces Professionnelles

#### **Voir ce qui a changé avant de commit**

```powershell
# Voir les différences détaillées
git diff

# Voir les différences d'un fichier spécifique
git diff backend/src/server.js
```

#### **Annuler le dernier git add (avant commit)**

```powershell
# Retirer tous les fichiers du staging
git reset

# Retirer un fichier spécifique
git reset backend/src/server.js
```

#### **Modifier le message du dernier commit**

```powershell
# Si vous vous êtes trompé dans le message
git commit --amend -m "Nouveau message corrigé"
```

#### **Voir l'historique des commits**

```powershell
# Voir tous les commits
git log

# Voir les 5 derniers commits
git log -5

# Voir l'historique en une ligne par commit
git log --oneline
```

---

### 📊 Commandes Git - Récapitulatif

| Commande | Explication | Quand l'utiliser |
|----------|-------------|------------------|
| `git status` | Voir les fichiers modifiés | Avant et après `git add` |
| `git add .` | Ajouter tous les fichiers | Après avoir fait des modifications |
| `git add fichier.js` | Ajouter un fichier spécifique | Si vous voulez être sélectif |
| `git commit -m "message"` | Sauvegarder avec un message | Après `git add` |
| `git push` | Envoyer vers GitHub | Après `git commit` |
| `git pull` | Récupérer depuis GitHub | Avant de commencer à travailler |
| `git log` | Voir l'historique | Pour voir vos commits passés |
| `git diff` | Voir les changements | Avant `git add` |

---

### ✅ Checklist Quotidienne

**Début de journée** :
```powershell
cd C:\Users\wopal\Desktop\football-booking-platform
git pull    # Récupérer les derniers changements
```

**Pendant le travail** :
- Sauvegardez régulièrement avec Git toutes les 30-60 minutes

**Après chaque fonctionnalité terminée** :
```powershell
git add .
git commit -m "Description claire"
git push
```

**Fin de journée** :
```powershell
git status  # Vérifier qu'il n'y a rien d'oublié
git add .
git commit -m "Fin de journée - sauvegarde du travail"
git push
```

---

## 🔄 Git - Commandes de Base (Autres)

### Vérifier l'état du projet

```powershell
# Voir les fichiers modifiés
git status

# Voir l'historique des commits
git log

# Voir les branches
git branch
```

### Récupérer les changements depuis GitHub

```powershell
# Récupérer les dernières modifications
git pull
```

### Voir les différences

```powershell
# Voir ce qui a changé dans les fichiers
git diff

# Voir les fichiers ajoutés au staging
git diff --staged
```

---

## 🌐 Tester l'API

### Avec curl (dans PowerShell)

```powershell
# Tester la route principale
curl http://localhost:5000

# Tester la route health
curl http://localhost:5000/health

# Tester l'inscription (POST)
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"nom\":\"Test\",\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

### Ouvrir dans le navigateur

```powershell
# Ouvrir le frontend
start http://localhost:5173

# Ouvrir le backend
start http://localhost:5000
```

---

## 📝 Commandes Utiles pour le Projet

### Redémarrer nodemon (backend)

```powershell
# Si le backend est déjà en cours d'exécution avec nodemon
# Tapez simplement dans le terminal :
rs
# puis appuyez sur Entrée
```

### Voir les processus Node.js en cours

```powershell
# Lister tous les processus Node.js
Get-Process node

# Arrêter tous les processus Node.js
Stop-Process -Name node -Force
```

### Créer un fichier

```powershell
# Créer un fichier vide
New-Item -Path "nom-du-fichier.txt" -ItemType File

# Créer un dossier
New-Item -Path "nom-du-dossier" -ItemType Directory
```

### Supprimer un fichier ou dossier

```powershell
# Supprimer un fichier
Remove-Item "nom-du-fichier.txt"

# Supprimer un dossier et son contenu
Remove-Item "nom-du-dossier" -Recurse
```

---

## 🔍 Debugging

### Voir les logs en temps réel

```powershell
# Les logs s'affichent automatiquement dans le terminal
# avec npm run dev (nodemon et Vite)
```

### Nettoyer le cache npm

```powershell
npm cache clean --force
```

### Réinstaller node_modules

```powershell
# Supprimer node_modules et package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Réinstaller
npm install
```

---

## 📋 Workflow Complet de Développement

### 1️⃣ Démarrage du projet (chaque jour)

```powershell
# Terminal 1 : Backend
cd C:\Users\wopal\Desktop\football-booking-platform\backend
npm run dev

# Terminal 2 : Frontend (dans un nouveau terminal)
cd C:\Users\wopal\Desktop\football-booking-platform\frontend
npm run dev
```

### 2️⃣ Pendant le développement

```powershell
# Les serveurs se rechargent automatiquement quand vous modifiez les fichiers
# Si besoin de redémarrer manuellement le backend, tapez : rs
```

### 3️⃣ Sauvegarder votre travail sur GitHub

```powershell
# Se placer dans le dossier principal
cd C:\Users\wopal\Desktop\football-booking-platform

# Voir ce qui a changé
git status

# Ajouter les changements
git add .

# Créer un commit
git commit -m "Description de ce que vous avez fait"

# Envoyer sur GitHub
git push
```

### 4️⃣ Fin de journée

```powershell
# Arrêter les serveurs
Ctrl + C (dans chaque terminal)

# Sauvegarder sur GitHub (voir étape 3)
```

---

## 🆘 Commandes d'Urgence

### Si les ports sont déjà utilisés

```powershell
# Trouver le processus qui utilise le port 5000
netstat -ano | findstr :5000

# Arrêter le processus (remplacez PID par le numéro trouvé)
taskkill /PID numero_du_pid /F
```

### Si Git pose problème

```powershell
# Annuler les changements non sauvegardés
git reset --hard

# Revenir au dernier commit
git checkout .
```

---

## 💡 Astuces PowerShell

```powershell
# Autocomplétion : Tapez les premières lettres et appuyez sur Tab

# Historique des commandes : Appuyez sur ↑ et ↓

# Copier du texte : Sélectionnez avec la souris, clic droit pour copier

# Coller du texte : Clic droit dans le terminal

# Arrêter une commande en cours : Ctrl + C

# Effacer l'écran : cls ou Clear-Host
```

---

## 📞 URLs Importantes

- **Frontend** : http://localhost:5173 (ou 5174)
- **Backend API** : http://localhost:5000
- **Backend Health** : http://localhost:5000/health
- **GitHub Repo** : https://github.com/llodiasen/football-booking-platform
- **MongoDB Atlas** : https://cloud.mongodb.com

---

## 🎯 Commandes Rapides (Résumé)

| Action | Commande |
|--------|----------|
| Aller au projet | `cd C:\Users\wopal\Desktop\football-booking-platform` |
| Démarrer backend | `cd backend` puis `npm run dev` |
| Démarrer frontend | `cd frontend` puis `npm run dev` |
| Arrêter serveur | `Ctrl + C` |
| Voir changements | `git status` |
| Sauvegarder | `git add . && git commit -m "message" && git push` |
| Nettoyer écran | `cls` |

---

**💾 Sauvegardez ce fichier et gardez-le ouvert pour référence !**

