'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getBoissonById, updateBoisson, deleteBoisson, CATEGORIES } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  nom: string;
  catégorie: string;
  quantité: number;
  seuil_alerte: number;
  prix_achat: number;
  fournisseur: string;
}

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPage({ params }: EditPageProps) {
  const [id, setId] = useState<string>('');
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    catégorie: '',
    quantité: 0,
    seuil_alerte: 5,
    prix_achat: 0,
    fournisseur: ''
  });

  const [originalData, setOriginalData] = useState<FormData | null>(null);

  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    extractParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      loadBoisson();
    }
  }, [id]);

  const loadBoisson = async () => {
    try {
      setIsLoading(true);
      setError('');
      const boisson = await getBoissonById(id);
      
      if (!boisson) {
        setError('Boisson non trouvée');
        return;
      }

      const data = {
        nom: (boisson as any).nom,
        catégorie: (boisson as any).catégorie,
        quantité: (boisson as any).quantité,
        seuil_alerte: (boisson as any).seuil_alerte,
        prix_achat: (boisson as any).prix_achat,
        fournisseur: (boisson as any).fournisseur
      };

      setFormData(data);
      setOriginalData(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la boisson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.nom.trim()) {
      setError('Le nom de la boisson est obligatoire');
      setIsSaving(false);
      return;
    }

    if (!formData.catégorie) {
      setError('La catégorie est obligatoire');
      setIsSaving(false);
      return;
    }

    if (formData.quantité < 0) {
      setError('La quantité ne peut pas être négative');
      setIsSaving(false);
      return;
    }

    if (formData.seuil_alerte < 0) {
      setError('Le seuil d\'alerte ne peut pas être négatif');
      setIsSaving(false);
      return;
    }

    if (formData.prix_achat < 0) {
      setError('Le prix d\'achat ne peut pas être négatif');
      setIsSaving(false);
      return;
    }

    if (!formData.fournisseur.trim()) {
      setError('Le fournisseur est obligatoire');
      setIsSaving(false);
      return;
    }

    try {
      await updateBoisson(id, {
        nom: formData.nom.trim(),
        catégorie: formData.catégorie,
        quantité: Number(formData.quantité),
        seuil_alerte: Number(formData.seuil_alerte),
        prix_achat: Number(formData.prix_achat),
        fournisseur: formData.fournisseur.trim()
      });

      setSuccess(true);
      setOriginalData({...formData});
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteBoisson(id);
      setShowDeleteDialog(false);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    if (originalData) {
      setFormData({...originalData});
      setError('');
      setSuccess(false);
    }
  };

  const hasChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar user={user} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Chargement de la boisson...</span>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !formData.nom) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar user={user} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>{error}</p>
                  <Link href="/dashboard">
                    <Button className="mt-4">
                      Retourner au dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* En-tête avec navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Modifier la boisson
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Modifiez les informations de "{formData.nom}"
                  </p>
                </div>
              </div>
              
              {/* Bouton supprimer */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{formData.nom}" ? Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Formulaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  Modifier la boisson
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Boisson modifiée avec succès ! Redirection en cours...
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom de la boisson *</Label>
                      <Input
                        id="nom"
                        type="text"
                        placeholder="Ex: Coca-Cola 33cl"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        disabled={isSaving}
                        required
                      />
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                      <Label htmlFor="catégorie">Catégorie *</Label>
                      <Select 
                        value={formData.catégorie} 
                        onValueChange={(value) => handleInputChange('catégorie', value)}
                        disabled={isSaving}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantité */}
                    <div className="space-y-2">
                      <Label htmlFor="quantité">Quantité en stock</Label>
                      <Input
                        id="quantité"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.quantité}
                        onChange={(e) => handleInputChange('quantité', parseInt(e.target.value) || 0)}
                        disabled={isSaving}
                      />
                    </div>

                    {/* Seuil d'alerte */}
                    <div className="space-y-2">
                      <Label htmlFor="seuil_alerte">Seuil d'alerte</Label>
                      <Input
                        id="seuil_alerte"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={formData.seuil_alerte}
                        onChange={(e) => handleInputChange('seuil_alerte', parseInt(e.target.value) || 0)}
                        disabled={isSaving}
                      />
                      <p className="text-sm text-gray-500">
                        Vous serez alerté quand le stock descend sous ce seuil
                      </p>
                    </div>

                    {/* Prix d'achat */}
                    <div className="space-y-2">
                      <Label htmlFor="prix_achat">Prix d'achat (€)</Label>
                      <Input
                        id="prix_achat"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.prix_achat}
                        onChange={(e) => handleInputChange('prix_achat', parseFloat(e.target.value) || 0)}
                        disabled={isSaving}
                      />
                    </div>

                    {/* Fournisseur */}
                    <div className="space-y-2">
                      <Label htmlFor="fournisseur">Fournisseur *</Label>
                      <Input
                        id="fournisseur"
                        type="text"
                        placeholder="Ex: Metro, Sysco, etc."
                        value={formData.fournisseur}
                        onChange={(e) => handleInputChange('fournisseur', e.target.value)}
                        disabled={isSaving}
                        required
                      />
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      disabled={isSaving || !hasChanges}
                    >
                      Annuler les modifications
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSaving || !hasChanges}
                      className="min-w-[140px]"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Modification...
                        </div>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 