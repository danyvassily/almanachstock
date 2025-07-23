'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  AlertCircle, 
  Package,
  Euro,
  Building,
  X
} from 'lucide-react';
import useStockAlerts from '@/hooks/useStockAlerts';

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

interface StockAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterCategory?: string;
  excludeCategory?: string;
  title?: string;
}

export default function StockAlertsModal({ 
  isOpen, 
  onClose, 
  filterCategory, 
  excludeCategory,
  title = "Alertes de Stock"
}: StockAlertsModalProps) {
  const { 
    alertes, 
    loading, 
    getStockStatus,
    getAlerteCounts 
  } = useStockAlerts({ filterCategory, excludeCategory });

  const [activeTab, setActiveTab] = useState<'critique' | 'faible'>('critique');

  // Séparer les alertes par type
  const alertesCritiques = alertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'critique');
  const alertesFaibles = alertes.filter(b => getStockStatus(b.quantité, b.seuil_alerte) === 'faible');

  const alerteCounts = getAlerteCounts();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const ProductCard = ({ boisson, type }: { boisson: Boisson, type: 'critique' | 'faible' }) => (
    <Card className="p-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{boisson.nom}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{boisson.catégorie}</Badge>
            <Badge 
              className={`text-xs ${
                type === 'critique' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {boisson.quantité} unité{boisson.quantité > 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Euro className="h-3 w-3 mr-1" />
              {formatPrice(boisson.prix_achat)}
            </div>
            <div className="flex items-center">
              <Building className="h-3 w-3 mr-1" />
              <span className="truncate">{boisson.fournisseur}</span>
            </div>
          </div>
        </div>
        <div className="ml-2 text-right">
          <div className="text-xs text-gray-500">Seuil</div>
          <div className="font-medium text-sm">{boisson.seuil_alerte}</div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des alertes...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {alerteCounts.total > 0 
              ? `${alerteCounts.critique} produit(s) épuisé(s) • ${alertesFaibles.length} en stock faible`
              : "Aucune alerte détectée"
            }
          </DialogDescription>
        </DialogHeader>

        {alerteCounts.total === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tout va bien ! 🎉
            </h3>
            <p className="text-gray-500">
              Tous vos stocks sont au niveau optimal.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'critique' | 'faible')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="critique" 
                  className="flex items-center gap-2"
                  disabled={alertesCritiques.length === 0}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Stock épuisé ({alertesCritiques.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="faible" 
                  className="flex items-center gap-2"
                  disabled={alertesFaibles.length === 0}
                >
                  <AlertCircle className="h-4 w-4" />
                  Stock faible ({alertesFaibles.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="critique" className="mt-4">
                {alertesCritiques.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="text-sm font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Produits en rupture de stock ({alertesCritiques.length})
                    </div>
                    {alertesCritiques.map((boisson) => (
                      <ProductCard key={boisson.id} boisson={boisson} type="critique" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <p>Aucun produit en rupture de stock</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="faible" className="mt-4">
                {alertesFaibles.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="text-sm font-medium text-orange-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Produits avec stock faible ({alertesFaibles.length})
                    </div>
                    {alertesFaibles.map((boisson) => (
                      <ProductCard key={boisson.id} boisson={boisson} type="faible" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <p>Aucun produit avec stock faible</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 