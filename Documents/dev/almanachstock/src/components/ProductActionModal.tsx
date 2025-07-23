'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBoisson, adjustStock } from '@/lib/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Package,
  Euro,
  Building,
  Calendar
} from 'lucide-react';

interface Boisson {
  id: string;
  nom: string;
  catégorie: string;
  quantité: number;
  seuil_alerte: number;
  prix_achat: number;
  fournisseur: string;
  date_dernière_modif: any;
  actif: boolean;
}

interface ProductActionModalProps {
  boisson: Boisson | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ProductActionModal({ 
  boisson, 
  isOpen, 
  onClose, 
  onUpdate 
}: ProductActionModalProps) {
  const router = useRouter();
  const [activeAction, setActiveAction] = useState<'main' | 'adjust' | 'delete' | 'success'>('main');
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!boisson) return null;

  const handleClose = () => {
    setActiveAction('main');
    setAdjustQuantity(1);
    setAdjustReason('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  const handleEdit = () => {
    router.push(`/edit/${boisson.id}`);
    handleClose();
  };

  const handleQuickAdjust = async (isAddition: boolean) => {
    if (adjustQuantity <= 0) {
      setError('La quantité doit être positive');
      return;
    }

    if (!isAddition && boisson.quantité < adjustQuantity) {
      setError(`Stock insuffisant. Stock actuel : ${boisson.quantité}`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const adjustment = isAddition ? adjustQuantity : -adjustQuantity;
      const updatedBoisson = await adjustStock(
        boisson.id, 
        adjustment, 
        adjustReason || (isAddition ? 'Ajout rapide' : 'Retrait rapide')
      );

      setSuccessMessage(
        `${isAddition ? 'Ajout' : 'Retrait'} de ${adjustQuantity} unité(s) effectué ! 
         Nouveau stock : ${updatedBoisson.quantité}`
      );
      setActiveAction('success');
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajustement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError('');

      await deleteBoisson(boisson.id);
      setSuccessMessage(`"${boisson.nom}" a été supprimé avec succès`);
      setActiveAction('success');
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = () => {
    if (boisson.quantité === 0) return { color: 'bg-red-100 text-red-800', text: 'Épuisé' };
    if (boisson.quantité <= boisson.seuil_alerte) return { color: 'bg-orange-100 text-orange-800', text: 'Stock faible' };
    if (boisson.quantité <= boisson.seuil_alerte * 1.5) return { color: 'bg-yellow-100 text-yellow-800', text: 'À surveiller' };
    return { color: 'bg-green-100 text-green-800', text: 'Stock OK' };
  };

  const status = getStockStatus();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Vue principale */}
        {activeAction === 'main' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {boisson.nom}
              </DialogTitle>
              <DialogDescription>
                Choisissez une action pour ce produit
              </DialogDescription>
            </DialogHeader>

            {/* Informations du produit */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Catégorie</div>
                  <Badge variant="outline">{boisson.catégorie}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <Badge className={`${status.color} text-xs`}>
                    {status.text}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Stock actuel</div>
                  <div className="font-semibold">{boisson.quantité} unités</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Seuil d'alerte</div>
                  <div className="font-semibold">{boisson.seuil_alerte}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Prix d'achat</div>
                  <div className="font-semibold flex items-center">
                    <Euro className="h-3 w-3 mr-1" />
                    {formatPrice(boisson.prix_achat)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fournisseur</div>
                  <div className="font-semibold flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    {boisson.fournisseur}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Dernière modification : {formatDate(boisson.date_dernière_modif)}
              </div>
            </div>

            {/* Boutons d'action */}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                onClick={() => setActiveAction('adjust')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Ajuster Stock
              </Button>
              <Button
                onClick={() => setActiveAction('delete')}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Vue ajustement rapide */}
        {activeAction === 'adjust' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Ajuster le stock - {boisson.nom}
              </DialogTitle>
              <DialogDescription>
                Stock actuel : {boisson.quantité} unités
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="adjust-quantity">Quantité</Label>
                <Input
                  id="adjust-quantity"
                  type="number"
                  min="1"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjust-reason">Raison (optionnel)</Label>
                <Input
                  id="adjust-reason"
                  placeholder="Ex: Fin de service, livraison..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setActiveAction('main')}
                variant="outline"
                disabled={isLoading}
              >
                Retour
              </Button>
              <Button
                onClick={() => handleQuickAdjust(true)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
              <Button
                onClick={() => handleQuickAdjust(false)}
                disabled={isLoading || boisson.quantité < adjustQuantity}
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Retirer
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Vue confirmation de suppression */}
        {activeAction === 'delete' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer "{boisson.nom}" ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                onClick={() => setActiveAction('main')}
                variant="outline"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? 'Suppression...' : 'Confirmer la suppression'}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Vue succès */}
        {activeAction === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Action réussie !
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 