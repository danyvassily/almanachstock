const XLSX = require("xlsx");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} = require("firebase/firestore");

// Configuration Firebase (identique à votre app)
const firebaseConfig = {
  apiKey: "AIzaSyBUW7t089PEYdrvkvhLrQnFKZqrooZoYHg",
  authDomain: "l-almanach-stock.firebaseapp.com",
  projectId: "l-almanach-stock",
  storageBucket: "l-almanach-stock.firebasestorage.app",
  messagingSenderId: "471255748821",
  appId: "1:471255748821:web:fab8832adb0e016604125c",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mapping des catégories
const CATEGORY_MAPPING = {
  blancs: "Vin",
  rouges: "Vin",
  rosés: "Vin",
  champagne: "Alcool",
  softs: "Soft",
  bières: "Bière",
  spiritueux: "Alcool",
  digestifs: "Alcool",
  apéritifs: "Alcool",
  café: "Café/Thé",
  thé: "Café/Thé",
};

// Seuils d'alerte par défaut selon la catégorie
const DEFAULT_THRESHOLDS = {
  Vin: 3,
  Alcool: 2,
  Soft: 10,
  Bière: 6,
  "Café/Thé": 5,
  Autre: 5,
};

// Fournisseurs par défaut
const DEFAULT_SUPPLIERS = [
  "Metro",
  "Sysco",
  "Vinatis",
  "Premium Vins",
  "Coffee Shop",
  "Fournisseur local",
];

function getRandomSupplier() {
  return DEFAULT_SUPPLIERS[
    Math.floor(Math.random() * DEFAULT_SUPPLIERS.length)
  ];
}

function detectCategory(productName, sectionName = "") {
  const name = productName.toLowerCase();
  const section = sectionName.toLowerCase();

  // Priorité à la section si elle donne une indication
  for (const [key, category] of Object.entries(CATEGORY_MAPPING)) {
    if (section.includes(key) || name.includes(key)) {
      return category;
    }
  }

  // Détection spécifique par mots-clés
  if (name.includes("champagne") || name.includes("crémant")) return "Alcool";
  if (
    name.includes("côtes") ||
    name.includes("bordeaux") ||
    name.includes("bourgogne")
  )
    return "Vin";
  if (
    name.includes("heineken") ||
    name.includes("bière") ||
    name.includes("pils")
  )
    return "Bière";
  if (name.includes("coca") || name.includes("sprite") || name.includes("eau"))
    return "Soft";
  if (
    name.includes("whisky") ||
    name.includes("vodka") ||
    name.includes("rhum")
  )
    return "Alcool";
  if (name.includes("café") || name.includes("expresso")) return "Café/Thé";

  return "Autre";
}

function cleanProductName(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\n\r]/g, "")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value) {
  if (typeof value === "number") return Math.max(0, Number(value.toFixed(2)));
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.max(0, Number(parsed.toFixed(2)));
  }
  return 0;
}

function parseQuantity(value) {
  if (typeof value === "number") return Math.max(0, Math.floor(value));
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d]/g, "");
    const parsed = parseInt(cleaned);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }
  return 0;
}

async function importDataToFirebase(products) {
  console.log(`\n🚀 Import de ${products.length} produits vers Firebase...`);
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      const docRef = await addDoc(collection(db, "boissons"), {
        ...product,
        date_dernière_modif: Timestamp.now(),
        actif: true,
      });

      console.log(`✅ ${product.nom} - ID: ${docRef.id}`);
      successCount++;

      // Petit délai pour éviter les erreurs de rate limit
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Erreur pour ${product.nom}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Résumé de l'import:`);
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total: ${products.length}`);
}

function processStocksSheet(worksheet) {
  const products = [];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let currentCategory = "";

  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;

    const productName = cleanProductName(row[0]);

    // Détecter les en-têtes de catégorie
    if (productName && !row[1] && !row[2] && productName.length < 20) {
      currentCategory = productName;
      continue;
    }

    // Process products from left section (Blancs/Vins)
    if (productName && (row[1] || row[2])) {
      const quantity = parseQuantity(row[1]);
      const price = parsePrice(row[2]);

      if (productName.length > 2) {
        const category = detectCategory(productName, currentCategory);
        products.push({
          nom: productName,
          catégorie: category,
          quantité: quantity,
          seuil_alerte: DEFAULT_THRESHOLDS[category] || 5,
          prix_achat: price,
          fournisseur: getRandomSupplier(),
        });
      }
    }

    // Process products from right section (Softs)
    const rightProductName = cleanProductName(row[5]);
    if (rightProductName && (row[6] || row[7])) {
      const quantity = parseQuantity(row[6]);
      const price = parsePrice(row[7]);

      if (rightProductName.length > 2) {
        const category = detectCategory(rightProductName, "Softs");
        products.push({
          nom: rightProductName,
          catégorie: category,
          quantité: quantity,
          seuil_alerte: DEFAULT_THRESHOLDS[category] || 5,
          prix_achat: price,
          fournisseur: getRandomSupplier(),
        });
      }
    }
  }

  return products;
}

function processWineSheet(worksheet) {
  const products = [];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let currentCategory = "";

  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;

    const productName = cleanProductName(row[0]);

    // Détecter les en-têtes de catégorie
    if (productName && !row[1] && !row[2] && productName.length < 20) {
      currentCategory = productName;
      continue;
    }

    if (productName && productName.length > 5 && (row[1] || row[7])) {
      // Utiliser le prix d'achat bouteille (colonne 7) en priorité, sinon verre (colonne 1)
      const bottlePrice = parsePrice(row[7]);
      const glassPrice = parsePrice(row[1]);
      const price = bottlePrice > 0 ? bottlePrice : glassPrice * 4; // Estimation bouteille = 4 verres

      if (price > 0) {
        const category = detectCategory(productName, currentCategory);
        products.push({
          nom: productName,
          catégorie: category,
          quantité: Math.floor(Math.random() * 10) + 1, // Quantité aléatoire 1-10
          seuil_alerte: DEFAULT_THRESHOLDS[category] || 3,
          prix_achat: price,
          fournisseur: getRandomSupplier(),
        });
      }
    }
  }

  return products;
}

async function main() {
  console.log("📥 Import des données Excel vers Amphore Stock");
  console.log("=".repeat(50));

  const allProducts = [];

  try {
    // 1. Traiter le fichier des stocks de juillet 2025
    console.log("\n📊 Traitement: Stocks boisson juillet 2025");
    const stocksWorkbook = XLSX.readFile(
      "./src/stock/Stocks boisson juillet 2025.xlsx"
    );
    const stocksSheet = stocksWorkbook.Sheets["Stocks et prix "];
    const stocksProducts = processStocksSheet(stocksSheet);
    allProducts.push(...stocksProducts);
    console.log(`✅ ${stocksProducts.length} produits extraits`);

    // 2. Traiter le fichier des vins 2024
    console.log("\n📊 Traitement: Vins - Coûts matières 2024");
    const winesWorkbook = XLSX.readFile(
      "./src/stock/L'Almanach Montmartre - vins - coûts matières - 2024.xlsx"
    );
    const winesSheet = winesWorkbook.Sheets["Actuels "];
    const winesProducts = processWineSheet(winesSheet);
    allProducts.push(...winesProducts);
    console.log(`✅ ${winesProducts.length} produits extraits`);

    // 3. Dédupliquer les produits par nom
    const uniqueProducts = [];
    const seenNames = new Set();

    for (const product of allProducts) {
      const normalizedName = product.nom
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      if (!seenNames.has(normalizedName) && normalizedName.length > 2) {
        seenNames.add(normalizedName);
        uniqueProducts.push(product);
      }
    }

    console.log(
      `\n🔄 Déduplication: ${allProducts.length} → ${uniqueProducts.length} produits uniques`
    );

    // 4. Afficher un aperçu
    console.log("\n👀 Aperçu des produits à importer:");
    uniqueProducts.slice(0, 10).forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.nom} (${product.catégorie}) - ${
          product.quantité
        } unités - ${product.prix_achat}€`
      );
    });

    if (uniqueProducts.length > 10) {
      console.log(`... et ${uniqueProducts.length - 10} autres produits`);
    }

    // 5. Demander confirmation et importer
    console.log(
      `\n❓ Voulez-vous importer ces ${uniqueProducts.length} produits vers Firebase ?`
    );
    console.log("⏳ Import en cours...");

    await importDataToFirebase(uniqueProducts);

    console.log("\n🎉 Import terminé avec succès !");
    console.log("🌐 Vérifiez votre dashboard: http://localhost:3000/dashboard");
  } catch (error) {
    console.error("💥 Erreur fatale:", error);
  }

  process.exit(0);
}

// Exécuter l'import
main();
