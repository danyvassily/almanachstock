const { createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../src/lib/firebase.ts");

// Informations de l'utilisateur de test
const TEST_USER = {
  email: "test@almanachstock.com",
  password: "Test123456!",
};

async function createTestUser() {
  console.log("🔥 Création d'un utilisateur de test Firebase...");
  console.log(`📧 Email: ${TEST_USER.email}`);
  console.log(`🔐 Mot de passe: ${TEST_USER.password}`);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      TEST_USER.email,
      TEST_USER.password
    );

    console.log("✅ Utilisateur créé avec succès !");
    console.log(`🆔 UID: ${userCredential.user.uid}`);
    console.log(`📧 Email vérifié: ${userCredential.user.emailVerified}`);

    console.log("\n🎯 Prochaines étapes:");
    console.log("1. Ouvrez http://localhost:3000/login");
    console.log("2. Connectez-vous avec les identifiants ci-dessus");
    console.log("3. Testez l'ajout d'une boisson");
    console.log(
      "4. Vérifiez dans la console Firebase que les données sont sauvegardées"
    );
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de l'utilisateur:",
      error.message
    );

    if (error.code === "auth/email-already-in-use") {
      console.log(
        "ℹ️  L'utilisateur existe déjà. Vous pouvez vous connecter directement."
      );
    } else if (error.code === "auth/weak-password") {
      console.log("❗ Le mot de passe doit contenir au moins 6 caractères.");
    } else if (error.code === "auth/invalid-email") {
      console.log("❗ L'adresse email est invalide.");
    }
  }
}

// Exécuter le script
createTestUser()
  .then(() => {
    console.log("\n🏁 Script terminé.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erreur fatale:", error);
    process.exit(1);
  });
