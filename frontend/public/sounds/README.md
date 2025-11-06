# 🔊 Sons de Notification

## 📁 Comment ajouter le son WhatsApp

Pour utiliser le vrai son de notification WhatsApp :

### Option 1 : Télécharger un fichier audio
1. Téléchargez un fichier audio de notification WhatsApp (format MP3 ou OGG)
2. Renommez-le en `whatsapp.mp3`
3. Placez-le dans ce dossier : `frontend/public/sounds/whatsapp.mp3`

### Option 2 : Utiliser le son synthétique (déjà actif)
Le système utilise actuellement un **son synthétique** qui imite le son de WhatsApp :
- **2 notes courtes** (D5 et G5)
- **Timing rapide** (80ms entre les notes)
- **Son cristallin** similaire à WhatsApp

## 🎵 Format recommandé
- **Format** : MP3 ou OGG
- **Durée** : 0.5 - 1 seconde
- **Volume** : Pré-normalisé (le code ajuste à 70%)
- **Qualité** : 128 kbps minimum

## 🔧 Utilisation
Le système essaie automatiquement :
1. 🎵 Fichier local `/sounds/whatsapp.mp3` (si disponible)
2. 🎛️ Son synthétique style WhatsApp (fallback automatique)

## ✅ Le système fonctionne actuellement !
Même sans fichier MP3, le son synthétique produit un résultat très similaire à WhatsApp.

