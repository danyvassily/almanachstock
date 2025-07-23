'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBoissons, adjustStock } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  RotateCcw,
  ArrowLeft,
  Home
} from 'lucide-react';

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

export default function QuickStockAdjust() {
  const router = useRouter();
  const [boissons, setBoissons] = useState<Boisson[]>([]);
  const [filteredBoissons, setFilteredBoissons] = useState<Boisson[]>([]);
  const [selectedBoisson, setSelectedBoisson] = useState<Boisson | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadBoissons();
  }, []);

  useEffect(() => {
    filterBoissons();
  }, [boissons, searchTerm]);

  const loadBoissons = async () => {
    try {
      setIsLoading(true);
      const data = await getBoissons();
      setBoissons(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des boissons');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBoissons = () => {
    if (!searchTerm) {
      setFilteredBoissons(boissons);
      return;
    }

    const filtered = boissons.filter(boisson =>
      boisson.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boisson.catégorie.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBoissons(filtered);
  };

  const handleAdjustment = async (isAddition: boolean) => {
    if (!selectedBoisson) {
      setError('Veuillez sélectionner une boisson');
      return;
    }

    if (adjustmentQuantity <= 0) {
      setError('La quantité doit être positive');
      return;
    }

    const adjustment = isAddition ? adjustmentQuantity : -adjustmentQuantity;

    // Vérifier si le retrait ne rend pas le stock négatif
    if (!isAddition && selectedBoisson.quantité < adjustmentQuantity) {
      setError(`Stock insuffisant. Stock actuel : ${selectedBoisson.quantité}`);
      return;
    }

    try {
      setIsAdjusting(true);
      setError('');
      setSuccess('');

      const updatedBoisson = await adjustStock(
        selectedBoisson.id, 
        adjustment, 
        reason || (isAddition ? 'Ajout rapide' : 'Retrait rapide')
      );

      // Mettre à jour la liste locale
      setBoissons(prev => prev.map(b => 
        b.id === selectedBoisson.id 
          ? { ...b, quantité: updatedBoisson.quantité }
          : b
      ));

      // Mettre à jour la boisson sélectionnée
      setSelectedBoisson(prev => prev ? { ...prev, quantité: updatedBoisson.quantité } : null);

      setSuccess(
        `${isAddition ? 'Ajout' : 'Retrait'} de ${adjustmentQuantity} unité(s) effectué avec succès ! 
         Nouveau stock : ${updatedBoisson.quantité}`
      );

      // Réinitialiser les champs
      setAdjustmentQuantity(1);
      setReason('');

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajustement');
    } finally {
      setIsAdjusting(false);
    }
  };

  const resetSelection = () => {
    setSelectedBoisson(null);
    setAdjustmentQuantity(1);
    setReason('');
    setError('');
    setSuccess('');
    setSearchTerm('');
  };

  const getStockStatusColor = (quantity: number, threshold: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity <= threshold) return 'bg-orange-100 text-orange-800';
    if (quantity <= threshold * 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (quantity: number, threshold: number) => {
    if (quantity === 0) return 'Épuisé';
    if (quantity <= threshold) return 'Stock faible';
    if (quantity <= threshold * 1.5) return 'À surveiller';
    return 'Stock OK';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des boissons...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Ajustement Rapide des Stocks
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour Dashboard
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Messages d'erreur et de succès */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span>{success}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  size="sm"
                  className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Retour Dashboard
                </Button>
                <Button
                  onClick={() => {
                    setSuccess('');
                    resetSelection();
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvel ajustement
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sélection de boisson */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Sélectionner une boisson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Liste des boissons */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredBoissons.map((boisson) => {
                const isSelected = selectedBoisson?.id === boisson.id;
                const statusColor = getStockStatusColor(boisson.quantité, boisson.seuil_alerte);
                const statusText = getStockStatusText(boisson.quantité, boisson.seuil_alerte);

                return (
                  <div
                    key={boisson.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedBoisson(boisson)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{boisson.nom}</div>
                        <div className="text-sm text-gray-500">{boisson.catégorie}</div>
                        <div className="text-sm">Stock actuel : <span className="font-medium">{boisson.quantité}</span></div>
                      </div>
                      <Badge className={`${statusColor} text-xs`}>
                        {statusText}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBoissons.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Aucune boisson trouvée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ajustement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Ajuster la quantité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedBoisson ? (
              <>
                {/* Boisson sélectionnée */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">{selectedBoisson.nom}</div>
                  <div className="text-sm text-blue-600">
                    Stock actuel : {selectedBoisson.quantité} | Seuil : {selectedBoisson.seuil_alerte}
                  </div>
                </div>

                {/* Quantité à ajuster */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 1)}
                    disabled={isAdjusting}
                  />
                </div>

                {/* Raison (optionnel) */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison (optionnel)</Label>
                  <Input
                    id="reason"
                    placeholder="Ex: Fin de service, inventaire..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isAdjusting}
                  />
                </div>

                {/* Boutons d'action */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAdjustment(true)}
                    disabled={isAdjusting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                  <Button
                    onClick={() => handleAdjustment(false)}
                    disabled={isAdjusting || selectedBoisson.quantité < adjustmentQuantity}
                    variant="destructive"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Retirer
                  </Button>
                </div>

                {/* Bouton reset */}
                <Button
                  onClick={resetSelection}
                  variant="outline"
                  className="w-full"
                  disabled={isAdjusting}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Sélectionnez une boisson pour commencer</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 