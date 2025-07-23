# 🚀 Guide de Déploiement - AlmanachStock

## Préparation pour la Production

### 1. Test en local
```bash
# Nettoyer le cache
npm run clean

# Build de production
npm run build:production

# Tester en local
npm run preview
```

### 2. Variables d'environnement
Créer un fichier `.env.local` basé sur `env.template` :
```bash
cp env.template .env.local
```

## 🔥 Déploiement sur Vercel (Recommandé)

### Étape 1: Préparation Git
```bash
# Initialiser Git si pas déjà fait
git init
git add .
git commit -m "🚀 Préparation pour le déploiement"

# Pousser sur GitHub/GitLab
git remote add origin https://github.com/ton-username/almanach-stock.git
git push -u origin main
```

### Étape 2: Déploiement Vercel
1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec ton compte GitHub/GitLab**
3. **Cliquer sur "New Project"**
4. **Importer ton repository `almanach-stock`**
5. **Configurer le projet :**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Étape 3: Variables d'environnement sur Vercel
Dans les paramètres du projet Vercel, ajouter :
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBUW7t089PEYdrvkvhLrQnFKZqrooZoYHg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=l-almanach-stock.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=l-almanach-stock
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=l-almanach-stock.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=471255748821
NEXT_PUBLIC_FIREBASE_APP_ID=1:471255748821:web:fab8832adb0e016604125c
NODE_ENV=production
```

### Étape 4: Configuration Firebase
1. **Aller dans la Console Firebase**
2. **Projet Settings > General**
3. **Ajouter ton domaine Vercel dans "Authorized domains"**
   - `ton-projet.vercel.app`
   - `www.ton-domaine.com` (si domaine personnalisé)

## 🔧 Alternative: Firebase Hosting

### Étape 1: Installation Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Étape 2: Initialisation
```bash
firebase init hosting
# Choisir ton projet Firebase existant
# Public directory: .next
# Configure as SPA: No
# Set up automatic builds: Yes
```

### Étape 3: Déploiement
```bash
npm run build
firebase deploy
```

## 🌐 Domaine Personnalisé (Optionnel)

### Sur Vercel:
1. **Settings > Domains**
2. **Ajouter ton domaine**
3. **Configurer DNS chez ton registrar**

### Configuration DNS:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19
```

## 📊 Monitoring et Performance

### Analytics avec Vercel
- **Activer Vercel Analytics** dans les paramètres
- **Speed Insights** pour les métriques de performance

### Firebase Analytics
Ajouter dans `firebase.ts` :
```javascript
import { getAnalytics } from "firebase/analytics";
export const analytics = getAnalytics(app);
```

## 🔒 Sécurité Production

### 1. Firestore Rules
Vérifier que tes règles Firestore sont sécurisées :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Seuls les utilisateurs authentifiés peuvent accéder
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. CSP Headers (Content Security Policy)
Ajouter dans `next.config.ts` :
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 🚀 Déploiement Automatique

### GitHub Actions (Optionnel)
Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## ✅ Checklist Final

- [ ] Build de production réussie
- [ ] Variables d'environnement configurées
- [ ] Domaines autorisés dans Firebase
- [ ] SSL/HTTPS activé
- [ ] Analytics configuré
- [ ] Firestore rules sécurisées
- [ ] Tests de l'application en production
- [ ] Monitoring activé

## 📞 Support

En cas de problème :
1. Vérifier les logs sur Vercel/Firebase
2. Tester en local avec `npm run preview`
3. Vérifier les variables d'environnement
4. Consulter la documentation Vercel/Firebase 