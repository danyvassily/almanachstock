const XLSX = require("xlsx");
const path = require("path");

// Chemins vers les fichiers Excel
const FILES = [
  {
    name: "Vins - Coûts matières 2024",
    path: "./src/stock/L'Almanach Montmartre - vins - coûts matières - 2024.xlsx",
  },
  {
    name: "Stocks boisson juillet 2025",
    path: "./src/stock/Stocks boisson juillet 2025.xlsx",
  },
];

function analyzeExcelFile(filePath, fileName) {
  console.log(`\n📊 Analyse du fichier: ${fileName}`);
  console.log("=".repeat(50));

  try {
    // Lire le fichier Excel
    const workbook = XLSX.readFile(filePath);

    console.log(`📁 Feuilles disponibles: ${workbook.SheetNames.join(", ")}`);

    // Analyser chaque feuille
    workbook.SheetNames.forEach((sheetName) => {
      console.log(`\n📋 Feuille: "${sheetName}"`);
      console.log("-".repeat(30));

      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        console.log(`📏 Nombre de lignes: ${jsonData.length}`);
        console.log(`📝 En-têtes (ligne 1): ${JSON.stringify(jsonData[0])}`);

        if (jsonData.length > 1) {
          console.log(
            `🔍 Exemple de données (ligne 2): ${JSON.stringify(jsonData[1])}`
          );
        }

        if (jsonData.length > 2) {
          console.log(
            `🔍 Exemple de données (ligne 3): ${JSON.stringify(jsonData[2])}`
          );
        }

        // Analyser les colonnes non vides
        const headers = jsonData[0] || [];
        console.log(`\n📊 Colonnes détectées:`);
        headers.forEach((header, index) => {
          if (header && header.toString().trim()) {
            console.log(`  ${index + 1}. "${header}"`);
          }
        });
      } else {
        console.log("⚠️ Feuille vide");
      }
    });
  } catch (error) {
    console.error(
      `❌ Erreur lors de la lecture de ${fileName}:`,
      error.message
    );
  }
}

function main() {
  console.log("🔍 Analyse des fichiers Excel de stock");
  console.log("=====================================\n");

  FILES.forEach((file) => {
    analyzeExcelFile(file.path, file.name);
  });

  console.log("\n\n🎯 Prochaines étapes:");
  console.log("1. Analyser la structure des données");
  console.log("2. Mapper les colonnes vers le format de l'application");
  console.log("3. Créer le script d'import vers Firebase");
}

// Exécuter l'analyse
main();
