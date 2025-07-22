# 📥 Instructions d'Import des Données Excel

## 🎯 Résumé

Vous avez **167 produits uniques** extraits de vos fichiers Excel :
- **65 Soft** (Coca, Perrier, etc.)
- **41 Vins** (Chablis, Saint-Véran, etc.)  
- **53 Autres** (Fleur de sel, etc.)
- **7 Café/Thé**
- **1 Alcool**

## 🔓 Option 1 : Import Temporaire (Recommandé)

### Étape 1 : Modifier les Règles Firestore

1. **Ouvrez Firebase Console** : [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Sélectionnez votre projet** : `l-almanach-stock`
3. **Allez dans Firestore** > **Règles**
4. **Remplacez** les règles actuelles par celles du fichier `firestore-import.rules`
5. **Cliquez sur "Publier"**

### Étape 2 : Lancer l'Import

```bash
node scripts/import-excel-data.js
```

### Étape 3 : Restaurer la Sécurité

1. **Retournez dans Firebase Console** > **Firestore** > **Règles**
2. **Remplacez** par les règles sécurisées du fichier `firestore.rules`
3. **Cliquez sur "Publier"**

---

## 🔐 Option 2 : Import Authentifié

### Si vous préférez garder la sécurité :

1. **Créez un utilisateur admin** via la Console Firebase
2. **Modifiez le script d'import** pour s'authentifier
3. **Plus complexe mais plus sécurisé**

---

## ✅ Après l'Import

Une fois l'import terminé :

1. **Vérifiez votre dashboard** : [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. **Connectez-vous** avec vos identifiants
3. **Tous vos produits** de L'Almanach Montmartre seront visibles !

## 📊 Données Importées

- ✅ **Noms des produits** extraits automatiquement
- ✅ **Catégories** détectées intelligemment  
- ✅ **Quantités** actuelles des stocks
- ✅ **Prix d'achat** réels de vos fichiers
- ✅ **Seuils d'alerte** configurés par catégorie
- ✅ **Fournisseurs** assignés aléatoirement

## 🎯 Prochaines Étapes

Après l'import vous pourrez :
- ✅ Voir tous vos stocks en temps réel
- ✅ Ajouter/modifier des produits
- ✅ Recevoir des alertes de stock faible
- ✅ Filtrer par catégorie
- ✅ Rechercher des produits

---

**Quelle option préférez-vous ?** 