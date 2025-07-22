import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection name
const COLLECTION_NAME = "boissons";

/**
 * Ajouter une nouvelle boisson
 * @param {Object} boissonData - Les données de la boisson
 * @returns {Promise<string>} - L'ID du document créé
 */
export const addBoisson = async (boissonData) => {
  // 🔥 MODE PRODUCTION : Utilisation Firebase
  const isDevelopmentMode = false; // Changé à false pour utiliser Firebase
  
  if (isDevelopmentMode) {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler un succès et retourner un ID fictif
    console.log("📝 [MODE DEV] Boisson ajoutée:", boissonData);
    return `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...boissonData,
      date_dernière_modif: Timestamp.now(),
      actif: true,
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la boisson:", error);
    throw error;
  }
};

/**
 * Récupérer toutes les boissons actives
 * @returns {Promise<Array>} - Liste des boissons
 */
export const getBoissons = async () => {
  try {
    // ✅ Requête simple sans index composé nécessaire
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const boissons = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filtrer côté client les boissons actives
      if (data.actif === true) {
        boissons.push({ id: doc.id, ...data });
      }
    });
    
    // Trier côté client par nom
    return boissons.sort((a, b) => a.nom.localeCompare(b.nom));
  } catch (error) {
    console.error("Erreur lors de la récupération des boissons:", error);
    throw error;
  }
};

/**
 * Récupérer une boisson par son ID
 * @param {string} id - L'ID de la boisson
 * @returns {Promise<Object|null>} - La boisson ou null si non trouvée
 */
export const getBoissonById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la boisson:", error);
    throw error;
  }
};

/**
 * Mettre à jour une boisson
 * @param {string} id - L'ID de la boisson
 * @param {Object} updateData - Les données à mettre à jour
 * @returns {Promise<void>}
 */
export const updateBoisson = async (id, updateData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updateData,
      date_dernière_modif: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la boisson:", error);
    throw error;
  }
};

/**
 * Supprimer une boisson (soft delete)
 * @param {string} id - L'ID de la boisson
 * @returns {Promise<void>}
 */
export const deleteBoisson = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      actif: false,
      date_dernière_modif: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la boisson:", error);
    throw error;
  }
};

/**
 * Récupérer les boissons par catégorie
 * @param {string} categorie - La catégorie à filtrer
 * @returns {Promise<Array>} - Liste des boissons de la catégorie
 */
export const getBoissonsByCategorie = async (categorie) => {
  try {
    // ✅ Requête simple sans index composé nécessaire
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const boissons = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filtrer côté client les boissons actives et de la bonne catégorie
      if (data.actif === true && data.catégorie === categorie) {
        boissons.push({ id: doc.id, ...data });
      }
    });
    
    // Trier côté client par nom
    return boissons.sort((a, b) => a.nom.localeCompare(b.nom));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des boissons par catégorie:",
      error
    );
    throw error;
  }
};

/**
 * Récupérer les boissons avec stock faible
 * @returns {Promise<Array>} - Liste des boissons avec stock critique
 */
export const getBoissonsStockFaible = async () => {
  try {
    // ✅ Requête simple sans index nécessaire
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const boissonsStockFaible = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filtrer côté client les boissons actives avec stock faible
      if (data.actif === true && data.quantité <= data.seuil_alerte) {
        boissonsStockFaible.push({ id: doc.id, ...data });
      }
    });

    return boissonsStockFaible;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des boissons à stock faible:",
      error
    );
    throw error;
  }
};

// Catégories par défaut
export const CATEGORIES = [
  "Soft",
  "Alcool",
  "Vin",
  "Bière",
  "Cocktail",
  "Café/Thé",
  "Autre",
];
