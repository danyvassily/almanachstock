'use client';

import { useState, useEffect } from 'react';
import { getBoissons } from '@/lib/firestore';

interface VinsMetrics {
  totalVins: number;
  valeurTotale: number;
  prixMoyen: number;
  stockTotal: number;
  vinsPlusChers: Array<{ nom: string; prix: number }>;
  loading: boolean;
  error: string | null;
}

export default function useVinsMetrics() {
  const [metrics, setMetrics] = useState<VinsMetrics>({
    totalVins: 0,
    valeurTotale: 0,
    prixMoyen: 0,
    stockTotal: 0,
    vinsPlusChers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadVinsMetrics = async () => {
      try {
        setMetrics(prev => ({ ...prev, loading: true, error: null }));

        // Récupérer toutes les boissons
        const boissons = await getBoissons();
        
        // Filtrer uniquement les vins
        const vins = boissons.filter(boisson => boisson.catégorie === 'Vin');

        if (vins.length === 0) {
          setMetrics({
            totalVins: 0,
            valeurTotale: 0,
            prixMoyen: 0,
            stockTotal: 0,
            vinsPlusChers: [],
            loading: false,
            error: null
          });
          return;
        }

        // Calculer les métriques
        const totalVins = vins.length;
        const stockTotal = vins.reduce((total, vin) => total + vin.quantité, 0);
        const valeurTotale = vins.reduce((total, vin) => total + (vin.prix_achat * vin.quantité), 0);
        const prixMoyen = totalVins > 0 ? vins.reduce((total, vin) => total + vin.prix_achat, 0) / totalVins : 0;
        
        // Top 5 des vins les plus chers
        const vinsPlusChers = vins
          .sort((a, b) => b.prix_achat - a.prix_achat)
          .slice(0, 5)
          .map(vin => ({
            nom: vin.nom,
            prix: vin.prix_achat
          }));

        setMetrics({
          totalVins,
          valeurTotale: Math.round(valeurTotale * 100) / 100, // Arrondir à 2 décimales
          prixMoyen: Math.round(prixMoyen * 100) / 100,
          stockTotal,
          vinsPlusChers,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Erreur lors du chargement des métriques vins:', error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }));
      }
    };

    loadVinsMetrics();
  }, []);

  return metrics;
} 