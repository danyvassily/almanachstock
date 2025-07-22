'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { addBoisson, CATEGORIES } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  nom: string;
  catégorie: string;
  quantité: number;
  seuil_alerte: number;
  prix_achat: number;
  fournisseur: string;
}

export default function AddPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    catégorie: '',
    quantité: 0,
    seuil_alerte: 5,
    prix_achat: 0,
    fournisseur: ''
  });

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.nom.trim()) {
      setError('Le nom de la boisson est obligatoire');
      setIsLoading(false);
      return;
    }

    if (!formData.catégorie) {
      setError('La catégorie est obligatoire');
      setIsLoading(false);
      return;
    }

    if (formData.quantité < 0) {
      setError('La quantité ne peut pas être négative');
      setIsLoading(false);
      return;
    }

    if (formData.seuil_alerte < 0) {
      setError('Le seuil d\'alerte ne peut pas être négatif');
      setIsLoading(false);
      return;
    }

    if (formData.prix_achat < 0) {
      setError('Le prix d\'achat ne peut pas être négatif');
      setIsLoading(false);
      return;
    }

    if (!formData.fournisseur.trim()) {
      setError('Le fournisseur est obligatoire');
      setIsLoading(false);
      return;
    }

    try {
      await addBoisson({
        nom: formData.nom.trim(),
        catégorie: formData.catégorie,
        quantité: Number(formData.quantité),
        seuil_alerte: Number(formData.seuil_alerte),
        prix_achat: Number(formData.prix_achat),
        fournisseur: formData.fournisseur.trim()
      });

      setSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      catégorie: '',
      quantité: 0,
      seuil_alerte: 5,
      prix_achat: 0,
      fournisseur: ''
    });
    setError('');
    setSuccess(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* En-tête avec navigation */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Ajouter une boisson
                </h1>
                <p className="mt-2 text-gray-600">
                  Ajoutez un nouveau produit à votre inventaire
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle boisson
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
                      Boisson ajoutée avec succès ! Redirection en cours...
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
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                      <Label htmlFor="catégorie">Catégorie *</Label>
                      <Select 
                        value={formData.catégorie} 
                        onValueChange={(value) => handleInputChange('catégorie', value)}
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Ajout...
                        </div>
                      ) : (
                        'Ajouter la boisson'
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