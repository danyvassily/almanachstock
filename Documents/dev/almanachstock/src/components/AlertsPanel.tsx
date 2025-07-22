'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, TrendingDown, Package } from 'lucide-react';
import useStockAlerts from '@/hooks/useStockAlerts';

interface AlertsPanelProps {
  filterCategory?: string; // Filtre par catégorie (ex: "Vin", "Soft", etc.)
  excludeCategory?: string; // Exclure une catégorie spécifique
}

export default function AlertsPanel({ filterCategory, excludeCategory }: AlertsPanelProps) {
  const { 
    alertes, 
    loading, 
    error, 
    getStockStatus, 
    getStatusColor, 
    getStatusText,
    getAlerteCounts 
  } = useStockAlerts({ filterCategory, excludeCategory });

  // Les alertes sont déjà filtrées par le hook
  const filteredAlertes = alertes;

  // Calculer les compteurs d'alertes filtrées
  const filteredAlerteCounts = {
    critique: filteredAlertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'critique').length,
    faible: filteredAlertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'faible').length,
    attention: filteredAlertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'attention').length,
    total: filteredAlertes.length
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des alertes: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Séparer les alertes par type
  const alertesCritiques = filteredAlertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'critique');
  const alertesFaibles = filteredAlertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'faible');

  // Si aucune alerte, afficher un message positif
  if (filteredAlertes.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Package className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Parfait ! Tous vos stocks sont au niveau optimal. Aucune alerte détectée.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Résumé des alertes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Alertes de Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{filteredAlerteCounts.critique}</div>
              <div className="text-sm text-gray-600">Stock épuisé</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{filteredAlerteCounts.faible}</div>
              <div className="text-sm text-gray-600">Stock faible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{filteredAlerteCounts.total}</div>
              <div className="text-sm text-gray-600">Total alertes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes critiques */}
      {alertesCritiques.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">
              {alertesCritiques.length} produit(s) en rupture de stock :
            </div>
            <div className="space-y-1">
              {alertesCritiques.map((boisson) => (
                <div key={boisson.id} className="flex justify-between items-center text-sm">
                  <span>{boisson.nom}</span>
                  <Badge variant="destructive" className="text-xs">
                    {boisson.quantité} unité(s)
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Alertes stock faible */}
      {alertesFaibles.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="font-semibold mb-2 text-orange-700">
              {alertesFaibles.length} produit(s) avec stock faible :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alertesFaibles.map((boisson) => (
                <div key={boisson.id} className="flex justify-between items-center text-sm text-orange-700">
                  <span>{boisson.nom}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs border-orange-300">
                      {boisson.quantité}/{boisson.seuil_alerte}
                    </Badge>
                    <TrendingDown className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 