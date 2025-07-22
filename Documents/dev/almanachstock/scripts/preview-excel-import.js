const XLSX = require("xlsx");

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
          source: "Stocks juillet 2025 - Gauche",
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
          source: "Stocks juillet 2025 - Droite",
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
          source: "Vins 2024",
        });
      }
    }
  }

  return products;
}

function analyzeProducts(products) {
  const stats = {
    total: products.length,
    byCategory: {},
    bySource: {},
    priceRange: { min: Infinity, max: 0 },
    quantityRange: { min: Infinity, max: 0 },
  };

  products.forEach((product) => {
    // Par catégorie
    stats.byCategory[product.catégorie] =
      (stats.byCategory[product.catégorie] || 0) + 1;

    // Par source
    stats.bySource[product.source] = (stats.bySource[product.source] || 0) + 1;

    // Prix
    if (product.prix_achat > 0) {
      stats.priceRange.min = Math.min(stats.priceRange.min, product.prix_achat);
      stats.priceRange.max = Math.max(stats.priceRange.max, product.prix_achat);
    }

    // Quantité
    stats.quantityRange.min = Math.min(
      stats.quantityRange.min,
      product.quantité
    );
    stats.quantityRange.max = Math.max(
      stats.quantityRange.max,
      product.quantité
    );
  });

  return stats;
}

function main() {
  console.log("🔍 Prévisualisation des données Excel à importer");
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

    // 4. Analyser les données
    const stats = analyzeProducts(uniqueProducts);

    console.log("\n📈 Statistiques des données:");
    console.log(`📦 Total de produits: ${stats.total}`);
    console.log(
      `💰 Prix: ${stats.priceRange.min.toFixed(
        2
      )}€ - ${stats.priceRange.max.toFixed(2)}€`
    );
    console.log(
      `📊 Quantités: ${stats.quantityRange.min} - ${stats.quantityRange.max}`
    );

    console.log("\n📂 Répartition par catégorie:");
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} produits`);
    });

    console.log("\n📄 Répartition par source:");
    Object.entries(stats.bySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} produits`);
    });

    // 5. Afficher un échantillon détaillé
    console.log("\n👀 Échantillon de produits (premiers 20):");
    console.log("-".repeat(100));
    console.log(
      "NOM".padEnd(40) +
        "CATÉGORIE".padEnd(12) +
        "QTÉ".padEnd(5) +
        "PRIX".padEnd(8) +
        "SEUIL".padEnd(7) +
        "SOURCE"
    );
    console.log("-".repeat(100));

    uniqueProducts.slice(0, 20).forEach((product) => {
      const name =
        product.nom.length > 37
          ? product.nom.substring(0, 37) + "..."
          : product.nom;
      console.log(
        name.padEnd(40) +
          product.catégorie.padEnd(12) +
          product.quantité.toString().padEnd(5) +
          `${product.prix_achat.toFixed(2)}€`.padEnd(8) +
          product.seuil_alerte.toString().padEnd(7) +
          product.source
      );
    });

    if (uniqueProducts.length > 20) {
      console.log(`... et ${uniqueProducts.length - 20} autres produits`);
    }

    console.log("\n✅ Prévisualisation terminée !");
    console.log(
      "🚀 Pour lancer l'import vers Firebase: node scripts/import-excel-data.js"
    );
  } catch (error) {
    console.error("💥 Erreur:", error);
  }
}

// Exécuter la prévisualisation
main();
