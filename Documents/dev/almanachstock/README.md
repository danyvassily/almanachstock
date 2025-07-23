# 📊 Amphore Stock - Gestion de Stock Restaurant

**Amphore Stock** est une application web moderne de gestion d'inventaire dédiée aux restaurants, bars et établissements de restauration. Elle permet un suivi précis des stocks de boissons, vins et autres produits avec un système d'alertes automatiques.

## 🚀 Fonctionnalités Principales

### 📋 Gestion d'Inventaire
- **Suivi en temps réel** : Visualisation instantanée des niveaux de stock
- **Catégorisation avancée** : Organisation par types (vins, bières, spiritueux, etc.)
- **Coûts et prix** : Gestion des coûts d'achat et prix de vente
- **Alertes intelligentes** : Notifications automatiques pour les stocks faibles

### 📊 Tableau de Bord Analytique
- **Métriques clés** : Vue d'ensemble des performances
- **Indicateurs visuels** : Graphiques et statistiques en temps réel
- **Filtres avancés** : Recherche et tri multicritères
- **Exports** : Données exportables pour analyses

### 🔐 Sécurité et Authentification
- **Authentification Firebase** : Connexion sécurisée
- **Gestion des permissions** : Accès contrôlé par utilisateur
- **Sauvegarde automatique** : Données synchronisées en temps réel

## 🛠 Technologies Utilisées

### Frontend
- **Next.js 15** avec App Router
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **Radix UI** pour les composants
- **Recharts** pour les graphiques

### Backend & Base de Données
- **Firebase Authentication** pour l'authentification
- **Firestore** pour la base de données NoSQL
- **Firebase Hosting** pour le déploiement

### Outils de Développement
- **TypeScript** pour la sécurité des types
- **ESLint** pour la qualité du code
- **PostCSS** pour les optimisations CSS

## 📦 Installation et Configuration

### Prérequis
- Node.js 18.0+ 
- npm ou yarn
- Compte Firebase

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-username/amphore-stock.git
cd amphore-stock
npm install
```

### 2. Configuration Firebase
1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez Authentication et Firestore
3. Copiez vos clés de configuration
4. Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

### 3. Lancer l'Application
```bash
# Mode développement
npm run dev

# Build de production
npm run build
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📱 Utilisation

### Première Connexion
1. Accédez à l'application
2. Créez un compte ou connectez-vous
3. Le tableau de bord s'affiche avec les métriques

### Ajouter des Produits
1. Cliquez sur "Ajouter un produit"
2. Remplissez les informations (nom, catégorie, stock, prix)
3. Définissez le seuil d'alerte
4. Sauvegardez

### Gérer les Stocks
- **Visualiser** : Consultez la liste complète dans l'onglet "Vins"
- **Modifier** : Cliquez sur un produit pour éditer ses informations
- **Ajuster** : Utilisez l'ajustement rapide pour mettre à jour les quantités
- **Surveiller** : Les alertes apparaissent automatiquement

### Alertes et Notifications
- **Indicateurs visuels** : Badges colorés selon les niveaux
- **Panel d'alertes** : Vue centralisée des produits en rupture
- **Notifications** : Alertes en temps réel

## 🎨 Interface Utilisateur

### Design System
- **Palette de couleurs** : Tons professionnels (gris, vert, rouge pour alertes)
- **Typography** : Inter font pour une lisibilité optimale  
- **Composants** : Design system cohérent avec Radix UI
- **Responsive** : Optimisé mobile, tablette et desktop

### Accessibilité
- **Contraste** : Respect des standards WCAG 2.1
- **Navigation clavier** : Support complet
- **Screen readers** : Labels et descriptions appropriés
- **Focus indicators** : Indicateurs visuels clairs

## 🚀 Déploiement

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel (Alternative)
```bash
npm install -g vercel
vercel --prod
```

## 📊 Structure du Projet

```
amphore-stock/
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── dashboard/       # Tableau de bord
│   │   ├── vins/           # Gestion des vins
│   │   ├── add/            # Ajout de produits
│   │   └── login/          # Authentification
│   ├── components/         # Composants React
│   │   ├── ui/             # Composants de base
│   │   ├── StockTable.tsx  # Table des stocks
│   │   ├── AlertsPanel.tsx # Panel d'alertes
│   │   └── Navbar.tsx      # Navigation
│   ├── contexts/           # Contextes React
│   ├── hooks/              # Hooks personnalisés
│   ├── lib/                # Utilitaires et configuration
│   └── types/              # Types TypeScript
├── public/                 # Assets statiques
├── scripts/                # Scripts d'import/export
└── docs/                   # Documentation
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production  
npm run start           # Serveur de production
npm run lint            # Vérification du code

# Scripts d'import
npm run import:excel    # Import depuis Excel
npm run preview:import  # Prévisualiser l'import
npm run create:testuser # Créer un utilisateur test
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité
3. **Commiter** vos changements  
4. **Pusher** vers la branche
5. **Ouvrir** une Pull Request

### Guidelines de Contribution
- Code en TypeScript avec types stricts
- Tests unitaires pour les nouvelles fonctionnalités
- Documentation des changements
- Respect des conventions de code (ESLint)

## 📋 Roadmap

### Version 2.0 (Q2 2024)
- [ ] **Gestion multi-établissements**
- [ ] **API REST complète**
- [ ] **Application mobile** (React Native)
- [ ] **Rapports avancés** avec exports PDF

### Version 2.1 (Q3 2024)
- [ ] **Intégrations** fournisseurs
- [ ] **Commandes automatiques**
- [ ] **Analytics avancées**
- [ ] **Mode hors ligne**

## 📞 Support

### Documentation
- 📖 [Guide d'utilisation complet](./docs/USER_GUIDE.md)
- 🔧 [Guide technique](./docs/TECHNICAL_GUIDE.md)
- 🚀 [Guide de déploiement](./docs/DEPLOYMENT_GUIDE.md)

### Contact
- 📧 Email : support@amphore-stock.com
- 💬 Discussions : [GitHub Discussions](https://github.com/votre-username/amphore-stock/discussions)
- 🐛 Bugs : [Issues GitHub](https://github.com/votre-username/amphore-stock/issues)

---

**Amphore Stock** - Solution professionnelle de gestion de stock pour restaurants 🍾

Développé avec ❤️ pour optimiser la gestion d'inventaire des professionnels de la restauration.
