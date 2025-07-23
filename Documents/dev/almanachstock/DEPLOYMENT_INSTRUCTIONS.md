# 🚀 Instructions de Déploiement - AlmanachStock

## ✅ Statut : Prêt pour le déploiement !

Ton application a été configurée et testée avec succès. Voici les étapes pour la mettre en ligne **maintenant** :

## 📋 **Option 1 : Déploiement Vercel (5 minutes) - RECOMMANDÉ**

### Étape 1 : Créer ton compte Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "Sign up" 
3. Connecte-toi avec ton compte GitHub

### Étape 2 : Pousser ton code sur GitHub
```bash
# Si pas encore fait
git init
git add .
git commit -m "🚀 Application prête pour déploiement"

# Créer un nouveau repository sur GitHub puis :
git remote add origin https://github.com/TON_USERNAME/almanach-stock.git
git push -u origin main
```

### Étape 3 : Déployer sur Vercel
1. **Sur Vercel, clique "New Project"**
2. **Importer ton repository GitHub "almanach-stock"**
3. **Configurer :**
   - Framework Preset: `Next.js` ✅ (détecté automatiquement)
   - Root Directory: `./` ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅

4. **Variables d'environnement :**
   Copie-colle ces variables dans Vercel :
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBUW7t089PEYdrvkvhLrQnFKZqrooZoYHg
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=l-almanach-stock.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=l-almanach-stock
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=l-almanach-stock.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=471255748821
   NEXT_PUBLIC_FIREBASE_APP_ID=1:471255748821:web:fab8832adb0e016604125c
   NODE_ENV=production
   ```

5. **Clique "Deploy"** 🎉

### Étape 4 : Configurer Firebase
1. **Va dans la [Console Firebase](https://console.firebase.google.com)**
2. **Sélectionne ton projet "l-almanach-stock"**
3. **Settings > General**
4. **Dans "Authorized domains", ajoute :**
   - `TON-PROJET.vercel.app` (Vercel te donnera l'URL)

**🎯 Ton app sera en ligne en ~3 minutes !**

---

## 📋 **Option 2 : Firebase Hosting (Alternative)**

### Si tu préfères Firebase Hosting :
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser
firebase init hosting
# ➤ Sélectionner ton projet existant
# ➤ Public directory: .next
# ➤ Configure as SPA: No
# ➤ GitHub actions: No

# Déployer
npm run build
firebase deploy
```

---

## 🌐 **Domaine Personnalisé (Optionnel)**

### Pour un domaine comme "alamanach-stock.com" :
1. **Sur Vercel** : Settings > Domains > Add Domain
2. **Chez ton registrar** (Gandi, OVH, etc.) :
   ```
   Type CNAME : www → cname.vercel-dns.com
   Type A : @ → 76.76.19.19
   ```

---

## ✅ **Test Final**

Une fois déployé :
1. **Visite ton URL** (Vercel te la donnera)
2. **Teste la connexion** avec tes identifiants Firebase
3. **Ajoute quelques produits** pour vérifier le fonctionnement
4. **Vérifie les alertes de stock**

---

## 🆘 **En cas de problème**

### Erreur "Firebase not configured"
➤ Vérifier que les variables d'environnement sont bien copiées dans Vercel

### Erreur "Unauthorized domain"
➤ Ajouter ton domaine Vercel dans Firebase Console > Settings > Authorized domains

### Page blanche
➤ Regarder les logs dans Vercel Dashboard > Functions tab

---

## 📱 **Optimisations Post-Déploiement**

### Analytics (Recommandé)
```bash
# Activer Vercel Analytics
# Dans Vercel Dashboard > Analytics > Enable
```

### Performance
```bash
# Activer Speed Insights
# Dans Vercel Dashboard > Speed Insights > Enable
```

### Monitoring
```bash
# Surveiller les erreurs avec Vercel
# Dashboard > Functions > Error logs
```

---

## 🎯 **Récapitulatif Technique**

✅ **Application** : Next.js 15.4.2 avec React 19
✅ **Base de données** : Firebase Firestore
✅ **Authentification** : Firebase Auth
✅ **Build** : Production optimisé
✅ **Hébergement** : Vercel (recommandé) ou Firebase Hosting
✅ **SSL** : Automatique avec certificat gratuit
✅ **CDN** : Global avec Vercel Edge Network

**Ton AlmanachStock est prêt à conquérir le monde ! 🚀** 