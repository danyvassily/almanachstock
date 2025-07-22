import { useState, useEffect } from 'react';
import { getBoissonsStockFaible } from '@/lib/firestore';

interface Boisson {
  id: string;
  nom: string;
  catégorie: string;
  quantité: number;
  seuil_alerte: number;
  prix_achat: number;
  fournisseur: string;
  actif: boolean;
}

interface UseStockAlertsOptions {
  filterCategory?: string; // Filtre par catégorie (ex: "Vin", "Soft", etc.)
  excludeCategory?: string; // Exclure une catégorie spécifique
}

/**
 * Hook personnalisé pour gérer les alertes de stock
 * @param options - Options de filtrage
 * @returns {Object} - État des alertes et fonctions utilitaires
 */
export const useStockAlerts = (options: UseStockAlertsOptions = {}) => {
  const { filterCategory, excludeCategory } = options;
  const [alertes, setAlertes] = useState<Boisson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 MODE PRODUCTION : Données Firebase
  const isDevelopmentMode = false; // Changé à false pour utiliser Firebase
  
  const testAlertes: Boisson[] = [
    {
      id: 'test1',
      nom: 'Coca-Cola 33cl',
      catégorie: 'Soft',
      quantité: 2,
      seuil_alerte: 10,
      prix_achat: 1.50,
      fournisseur: 'Metro',
      actif: true
    },
    {
      id: 'test2',
      nom: 'Bordeaux Rouge 2020',
      catégorie: 'Vin',
      quantité: 0,
      seuil_alerte: 5,
      prix_achat: 15.90,
      fournisseur: 'Vinatis',
      actif: true
    },
    {
      id: 'test3',
      nom: 'Heineken 50cl',
      catégorie: 'Bière',
      quantité: 8,
      seuil_alerte: 15,
      prix_achat: 2.20,
      fournisseur: 'Sysco',
      actif: true
    }
  ];

  // Charger les alertes au montage du composant
  useEffect(() => {
    loadAlertes();
  }, []);

  /**
   * Charger les boissons avec stock faible
   */
  const loadAlertes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isDevelopmentMode) {
        // En mode dev, utiliser les données de test
        setTimeout(() => {
          let filteredTestAlertes = testAlertes;
          if (filterCategory) {
            filteredTestAlertes = filteredTestAlertes.filter(boisson => boisson.catégorie === filterCategory);
          }
          if (excludeCategory) {
            filteredTestAlertes = filteredTestAlertes.filter(boisson => boisson.catégorie !== excludeCategory);
          }
          setAlertes(filteredTestAlertes);
          setLoading(false);
        }, 500); // Simule un délai de chargement
        return;
      }
      
      const boissonsStockFaible = await getBoissonsStockFaible();
      
      // Appliquer les filtres si spécifiés
      let filteredAlertes = boissonsStockFaible;
      if (filterCategory) {
        filteredAlertes = filteredAlertes.filter(boisson => boisson.catégorie === filterCategory);
      }
      if (excludeCategory) {
        filteredAlertes = filteredAlertes.filter(boisson => boisson.catégorie !== excludeCategory);
      }
      
      setAlertes(filteredAlertes);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error("Erreur lors du chargement des alertes:", err);
    } finally {
      if (!isDevelopmentMode) {
        setLoading(false);
      }
    }
  };

  /**
   * Déterminer le statut du stock d'une boisson
   * @param {number} quantite - Quantité actuelle
   * @param {number} seuilAlerte - Seuil d'alerte défini
   * @returns {string} - Statut du stock (critique, faible, ok)
   */
  const getStockStatus = (quantite: number, seuilAlerte: number): string => {
    if (quantite === 0) return 'critique';
    if (quantite <= seuilAlerte) return 'faible';
    if (quantite <= seuilAlerte * 1.5) return 'attention';
    return 'ok';
  };

  /**
   * Obtenir la couleur correspondant au statut du stock
   * @param {string} status - Statut du stock
   * @returns {string} - Classe CSS Tailwind pour la couleur
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'critique':
        return 'text-red-600 bg-red-50';
      case 'faible':
        return 'text-orange-600 bg-orange-50';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50';
      case 'ok':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  /**
   * Obtenir le texte descriptif du statut
   * @param {string} status - Statut du stock
   * @returns {string} - Description du statut
   */
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'critique':
        return 'Stock épuisé';
      case 'faible':
        return 'Stock faible';
      case 'attention':
        return 'À surveiller';
      case 'ok':
        return 'Stock OK';
      default:
        return 'Inconnu';
    }
  };

  /**
   * Obtenir l'icône correspondant au statut
   * @param {string} status - Statut du stock
   * @returns {string} - Nom de l'icône Lucide React
   */
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'critique':
        return 'AlertTriangle';
      case 'faible':
        return 'AlertCircle';
      case 'attention':
        return 'Info';
      case 'ok':
        return 'CheckCircle';
      default:
        return 'HelpCircle';
    }
  };

  /**
   * Compter le nombre d'alertes par type
   * @returns {Object} - Compteurs des différents types d'alertes
   */
  const getAlerteCounts = () => {
    const counts = {
      critique: 0,
      faible: 0,
      attention: 0,
      total: alertes.length
    };

    alertes.forEach(boisson => {
      const status = getStockStatus(boisson.quantité, boisson.seuil_alerte);
      if (status === 'critique') counts.critique++;
      else if (status === 'faible') counts.faible++;
      else if (status === 'attention') counts.attention++;
    });

    return counts;
  };

  return {
    alertes,
    loading,
    error,
    loadAlertes,
    getStockStatus,
    getStatusColor,
    getStatusText,
    getStatusIcon,
    getAlerteCounts
  };
};

export default useStockAlerts;
