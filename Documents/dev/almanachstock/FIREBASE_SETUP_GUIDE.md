# 🔥 Guide de Configuration Firebase - Mode Production

## 📋 Étapes à Suivre

### 1. Appliquer les Règles Firestore

1. **Accédez à la Console Firebase :**
   - Ouvrez [https://console.firebase.google.com](https://console.firebase.google.com)
   - Sélectionnez votre projet : `l-almanach-stock`

2. **Naviguez vers Firestore :**
   - Dans le menu latéral, cliquez sur **"Firestore Database"**
   - Cliquez sur l'onglet **"Règles"**

3. **Remplacez les règles existantes :**
   - Copiez le contenu du fichier `firestore.rules`
   - Collez-le dans l'éditeur de règles
   - Cliquez sur **"Publier"**

### 2. Activer l'Authentification Email/Password

1. **Accédez à Authentication :**
   - Dans le menu latéral, cliquez sur **"Authentication"**
   - Cliquez sur l'onglet **"Sign-in method"**

2. **Activez Email/Password :**
   - Cliquez sur **"Email/Password"**
   - Activez la première option (**"Email/Password"**)
   - Cliquez sur **"Enregistrer"**

### 3. Créer un Utilisateur de Test

**Option A : Via la Console Firebase**
1. Dans **Authentication** > **Utilisateurs**
2. Cliquez sur **"Ajouter un utilisateur"**
3. Email : `test@almanachstock.com`
4. Mot de passe : `Test123456!`

**Option B : Via l'Application**
1. Accédez à [http://localhost:3000/login](http://localhost:3000/login)
2. Cliquez sur **"Créer un compte"** (si disponible)
3. Utilisez les mêmes identifiants

## 🧪 Test de Production

Après configuration :

1. **Redémarrez l'application** : `npm run dev`
2. **Accédez à l'app** : [http://localhost:3000](http://localhost:3000)
3. **Connectez-vous** avec vos identifiants test
4. **Testez l'ajout** d'une boisson
5. **Vérifiez dans Firestore** que les données sont sauvegardées

## ⚠️ Sécurité

- **Changez les identifiants** de test en production
- **Utilisez des mots de passe forts**
- **Limitez les règles Firestore** selon vos besoins

## 🎯 Prochaines Étapes

- Configuration de l'hébergement Firebase
- Ajout de règles de validation des données
- Mise en place des sauvegardes automatiques 

## 🔧 Étape 1 : Remplacer Temporairement les Règles

1. **Sélectionnez tout le contenu** dans l'éditeur de règles (Ctrl+A / Cmd+A)

2. **Supprimez tout** et **collez ces règles temporaires** :

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 🚨 RÈGLES TEMPORAIRES POUR L'IMPORT INITIAL 🚨
    // ⚠️  À REMPLACER après l'import par les vraies règles de sécurité
    
    match /boissons/{documentId} {
      // Autoriser toutes les opérations temporairement
      allow read, write, update, delete: if true;
    }
    
    // Bloquer toutes les autres collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Cliquez sur "Publier"** (bouton bleu en haut à droite)

4. **Attendez la confirmation** que les règles sont déployées

## 🚀 Étape 2 : Lancer l'Import

Retournez dans votre terminal et lancez : 