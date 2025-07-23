'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Package, 
  ChevronRight,
  Wine,
  Coffee
} from 'lucide-react';
import useStockAlerts from '@/hooks/useStockAlerts';
import StockAlertsModal from '@/components/StockAlertsModal';

interface CompactAlertsPanelProps {
  filterCategory?: string;
  excludeCategory?: string;
  title?: string;
}

export default function CompactAlertsPanel({ 
  filterCategory, 
  excludeCategory,
  title
}: CompactAlertsPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    alertes, 
    loading, 
    error, 
    getStockStatus,
    getAlerteCounts 
  } = useStockAlerts({ filterCategory, excludeCategory });

  const alerteCounts = getAlerteCounts();

  // Déterminer le titre et l'icône selon le contexte
  const getContextInfo = () => {
    if (filterCategory === 'Vin') {
      return {
        title: title || 'Alertes Cave à Vins',
        icon: Wine,
        emptyMessage: 'Votre cave à vins est parfaitement approvisionnée ! 🍷'
      };
    }
    
    if (excludeCategory === 'Vin') {
      return {
        title: title || 'Alertes Boissons & Produits',
        icon: Coffee,
        emptyMessage: 'Tous vos produits sont bien approvisionnés ! ☕'
      };
    }

    return {
      title: title || 'Alertes de Stock',
      icon: Package,
      emptyMessage: 'Tous vos stocks sont au niveau optimal ! 📦'
    };
  };

  const contextInfo = getContextInfo();

  if (loading) {
    return (
      <Alert className="animate-pulse">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </Alert>
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

  // Si aucune alerte
  if (alerteCounts.total === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <contextInfo.icon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          {contextInfo.emptyMessage}
        </AlertDescription>
      </Alert>
    );
  }

  // Déterminer le niveau d'urgence principal
  const hasStock = alerteCounts.critique > 0;
  const alertType = hasStock ? 'critique' : 'faible';
  const alertColor = hasStock ? 'destructive' : 'default';
  const alertBg = hasStock ? '' : 'border-orange-200 bg-orange-50';
  const alertIcon = hasStock ? AlertTriangle : AlertCircle;
  const iconColor = hasStock ? 'text-red-600' : 'text-orange-600';

  // Message principal
  const getMessage = () => {
    if (alerteCounts.critique > 0 && alerteCounts.faible > 0) {
      return `${alerteCounts.critique} produit(s) en rupture • ${alerteCounts.faible} stock faible`;
    } else if (alerteCounts.critique > 0) {
      return `${alerteCounts.critique} produit(s) en rupture de stock`;
    } else {
      return `${alerteCounts.faible} produit(s) avec stock faible`;
    }
  };

  return (
    <>
      <Alert 
        variant={alertColor as "default" | "destructive"}
        className={`cursor-pointer hover:shadow-md transition-all duration-200 group ${alertBg}`}
        onClick={() => setIsModalOpen(true)}
      >
        {React.createElement(alertIcon, { className: `h-4 w-4 ${iconColor}` })}
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={hasStock ? 'text-red-700' : 'text-orange-700'}>
              {getMessage()}
            </span>
            {/* Badges détaillés */}
            <div className="flex gap-1">
              {alerteCounts.critique > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {alerteCounts.critique} épuisé{alerteCounts.critique > 1 ? 's' : ''}
                </Badge>
              )}
              {alerteCounts.faible > 0 && (
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {alerteCounts.faible} faible{alerteCounts.faible > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Indicateur cliquable */}
          <div className="flex items-center gap-1 text-xs opacity-60 group-hover:opacity-100">
            <span>Voir détails</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </AlertDescription>
      </Alert>

      {/* Modal avec les détails */}
      <StockAlertsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterCategory={filterCategory}
        excludeCategory={excludeCategory}
        title={contextInfo.title}
      />
    </>
  );
} 