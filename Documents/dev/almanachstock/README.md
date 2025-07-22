# 📊 Almanach Stock - Gestion de Stock Restaurant

Application web moderne de gestion de stock de boissons pour restaurants, développée avec **Next.js**, **Firebase** et **Tailwind CSS**.

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec Firebase Auth
- Système de création de compte
- Protection des routes privées
- Déconnexion automatique

### 📱 Dashboard Principal
- Vue d'ensemble des stocks en temps réel
- Tableau responsive avec tri et filtres
- Système d'alertes visuelles par couleur :
  - 🔴 **Rouge** : Stock épuisé (quantité = 0)
  - 🟠 **Orange** : Stock faible (≤ seuil d'alerte)
  - 🟡 **Jaune** : À surveiller (≤ seuil × 1.5)
  - 🟢 **Vert** : Stock OK

### 🍹 Gestion des Boissons
- **Ajouter** : Nouveau produit avec formulaire complet
- **Modifier** : Édition en temps réel des informations
- **Supprimer** : Suppression sécurisée avec confirmation
- **Catégories** : Soft, Alcool, Vin, Bière, Cocktail, Café/Thé, Autre

### 🚨 Système d'Alertes
- Alertes automatiques en temps réel
- Notifications pour stocks critiques
- Résumé visuel des alertes sur le dashboard
- Filtrage des produits en alerte

### 📊 Données Trackées
- **Nom** : Identifiant du produit
- **Catégorie** : Classification par type
- **Quantité** : Stock actuel
- **Seuil d'alerte** : Niveau de déclenchement des alertes
- **Prix d'achat** : Coût unitaire
- **Fournisseur** : Source d'approvisionnement
- **Date de modification** : Horodatage automatique

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **ShadCN UI** - Bibliothèque de composants modernes
- **Lucide React** - Icônes SVG

### Backend
- **Firebase Auth** - Authentification utilisateur
- **Firestore** - Base de données NoSQL temps réel
- **Firebase SDK** - Intégration complète

### Outils de Développement
- **ESLint** - Linting et qualité de code
- **PostCSS** - Traitement CSS
- **npm** - Gestionnaire de packages

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- Compte **Firebase** configuré

### Installation
\`\`\`bash
# Cloner le projet
git clone <url-du-repo>
cd almanachstock

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev
\`\`\`

### Configuration Firebase
1. Créer un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer **Authentication** (Email/Password)
3. Activer **Firestore Database**
4. Récupérer la configuration et l'ajouter dans `src/lib/firebase.js`

### Scripts Disponibles
\`\`\`bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
\`\`\`

## 📱 Design Responsive

### Mobile First
- Interface optimisée pour smartphones
- Navigation hamburger sur mobile
- Cartes remplacent les tableaux sur petits écrans
- Touch-friendly avec boutons adaptés

### Breakpoints
- **Mobile** : < 768px - Design en cartes
- **Tablet** : 768px - 1024px - Transition progressive
- **Desktop** : > 1024px - Tableau complet

## 🔒 Sécurité

### Firebase Security Rules
\`\`\`javascript
// Firestore Rules recommandées
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boissons/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

### Protection des Routes
- Composant `ProtectedRoute` pour pages privées
- Redirection automatique vers login si non authentifié
- Context `AuthProvider` pour gestion globale de l'état

## 📂 Structure du Projet

\`\`\`
src/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Page principale
│   ├── login/            # Authentification
│   ├── add/              # Ajout de produit
│   ├── edit/[id]/        # Édition dynamique
│   ├── not-found.tsx     # Page 404
│   ├── layout.tsx        # Layout global
│   └── page.tsx          # Page d'accueil
├── components/           # Composants réutilisables
│   ├── ui/              # Composants ShadCN UI
│   ├── Navbar.tsx       # Barre de navigation
│   ├── StockTable.tsx   # Tableau des stocks
│   ├── AlertsPanel.tsx  # Panel d'alertes
│   └── ProtectedRoute.tsx # Protection des routes
├── contexts/            # Contexts React
│   └── AuthContext.tsx  # Authentification globale
├── hooks/               # Hooks personnalisés
│   └── useStockAlerts.js # Gestion des alertes
├── lib/                 # Bibliothèques et utils
│   ├── firebase.js      # Configuration Firebase
│   ├── firestore.js     # Fonctions Firestore
│   └── utils.ts         # Utilitaires
└── styles/              # Styles globaux
    └── globals.css      # CSS global + Tailwind
\`\`\`

## 🎯 Utilisation

### Premier Usage
1. **Connexion** : Créer un compte ou se connecter
2. **Ajouter des produits** : Utiliser le bouton "Ajouter une boisson"
3. **Configurer les seuils** : Définir les niveaux d'alerte pour chaque produit
4. **Surveiller** : Le dashboard affiche automatiquement les alertes

### Workflow Quotidien
1. **Consulter les alertes** : Vérifier les stocks critiques
2. **Mettre à jour les quantités** : Modifier les stocks après réception/vente
3. **Ajouter de nouveaux produits** : Enrichir l'inventaire
4. **Analyser** : Utiliser les filtres pour analyser par catégorie

## 🛡️ Bonnes Pratiques

### Gestion des Seuils
- **Produits rapides** : Seuil élevé (ex: 20-30 unités)
- **Produits lents** : Seuil bas (ex: 5-10 unités)
- **Révision mensuelle** : Ajuster selon les tendances

### Catégorisation
- **Cohérence** : Utiliser les mêmes catégories
- **Spécificité** : Adapter aux besoins du restaurant
- **Evolution** : Ajouter de nouvelles catégories si nécessaire

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit les changements (\`git commit -m 'Add AmazingFeature'\`)
4. Push sur la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- 📧 Email : support@almanach-stock.com
- 📱 Documentation : [Wiki du projet]
- 🐛 Issues : [GitHub Issues]

---

**Almanach Stock** - Solution professionnelle de gestion de stock pour restaurants 🍾
