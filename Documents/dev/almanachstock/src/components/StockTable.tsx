'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBoissons, getBoissonsByCategorie, CATEGORIES } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit, 
  Search, 
  Filter, 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info
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
  date_dernière_modif: any;
  actif: boolean;
}

interface StockTableProps {
  filterCategory?: string; // Filtre par catégorie (ex: "Vin", "Soft", etc.)
  excludeCategory?: string; // Exclure une catégorie spécifique
  title?: string; // Titre personnalisé pour la table
}

export default function StockTable({ 
  filterCategory, 
  excludeCategory, 
  title = "Stock des Boissons" 
}: StockTableProps) {
  const [boissons, setBoissons] = useState<Boisson[]>([]);
  const [filteredBoissons, setFilteredBoissons] = useState<Boisson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { getStockStatus, getStatusColor, getStatusText } = useStockAlerts();

  // Fonction pour afficher les icônes de statut
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'critique':
        return <AlertTriangle className="h-4 w-4" />;
      case 'faible':
        return <AlertCircle className="h-4 w-4" />;
      case 'attention':
        return <Info className="h-4 w-4" />;
      case 'ok':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // 🔥 MODE PRODUCTION : Données Firebase
  const isDevelopmentMode = false;
  
  // 🐛 Mode débogage pour les doublons (temporaire)
  const debugMode = false; // Désactivé
  
  const testBoissons = [
    {
      id: 'test1',
      nom: 'Coca-Cola 33cl',
      catégorie: 'Soft',
      quantité: 2,
      seuil_alerte: 10,
      prix_achat: 1.50,
      fournisseur: 'Metro',
      date_dernière_modif: { toDate: () => new Date('2024-01-15') },
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
      date_dernière_modif: { toDate: () => new Date('2024-01-14') },
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
      date_dernière_modif: { toDate: () => new Date('2024-01-16') },
      actif: true
    },
    {
      id: 'test4',
      nom: 'Evian 1L',
      catégorie: 'Soft',
      quantité: 25,
      seuil_alerte: 20,
      prix_achat: 0.80,
      fournisseur: 'Metro',
      date_dernière_modif: { toDate: () => new Date('2024-01-13') },
      actif: true
    },
    {
      id: 'test5',
      nom: 'Champagne Moët',
      catégorie: 'Alcool',
      quantité: 3,
      seuil_alerte: 2,
      prix_achat: 45.00,
      fournisseur: 'Premium Vins',
      date_dernière_modif: { toDate: () => new Date('2024-01-12') },
      actif: true
    },
    {
      id: 'test6',
      nom: 'Espresso Blend',
      catégorie: 'Café/Thé',
      quantité: 12,
      seuil_alerte: 8,
      prix_achat: 3.50,
      fournisseur: 'Coffee Shop',
      date_dernière_modif: { toDate: () => new Date('2024-01-17') },
      actif: true
    }
  ];

  useEffect(() => {
    loadBoissons();
  }, []);

  useEffect(() => {
    filterBoissons();
  }, [boissons, searchTerm, selectedCategory]);

  // Fonction pour dédupliquer les données par ID
  const deduplicateBoissons = (boissons: Boisson[]) => {
    const seen = new Set();
    return boissons.filter(boisson => {
      if (seen.has(boisson.id)) {
        return false;
      }
      seen.add(boisson.id);
      return true;
    });
  };



  const loadBoissons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isDevelopmentMode) {
        // En mode dev, utiliser les données de test
        setTimeout(() => {
          const dedupedData = deduplicateBoissons(testBoissons);
          setBoissons(dedupedData);
          setLoading(false);
        }, 700); // Simule un délai de chargement
        return;
      }
      
      const data = await getBoissons();
      const dedupedData = deduplicateBoissons(data);
      setBoissons(dedupedData);
      

    } catch (err: any) {
      setError(err.message);
      console.error('Erreur lors du chargement des boissons:', err);
    } finally {
      if (!isDevelopmentMode) {
        setLoading(false);
      }
    }
  };

  const filterBoissons = () => {
    let filtered = [...boissons]; // Créer une copie pour éviter les mutations

    // Filtrer par catégorie spécifique (prop filterCategory)
    if (filterCategory) {
      filtered = filtered.filter(boisson => boisson.catégorie === filterCategory);
    }

    // Exclure une catégorie spécifique (prop excludeCategory)
    if (excludeCategory) {
      filtered = filtered.filter(boisson => boisson.catégorie !== excludeCategory);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(boisson =>
        boisson.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boisson.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par catégorie sélectionnée (dropdown)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(boisson => boisson.catégorie === selectedCategory);
    }

    // Dédupliquer
    const uniqueFiltered = deduplicateBoissons(filtered);
    setFilteredBoissons(uniqueFiltered);
  };

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

  if (loading) {
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Erreur lors du chargement: {error}</p>
            <Button onClick={loadBoissons} className="mt-4">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title} ({filteredBoissons.length})</span>
          <Link href="/add">
            <Button>
              {filterCategory === 'Vin' ? 'Ajouter un vin' : 'Ajouter une boisson'}
            </Button>
          </Link>
        </CardTitle>
        
                {/* Message de débogage temporaire */}
        {debugMode && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Mode débogage activé</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Détection et suppression automatique des doublons en cours. Consultez la console pour plus de détails.
            </p>
          </div>
        )}
        
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {filterCategory ? `Tous les ${filterCategory.toLowerCase()}s` : 'Toutes les catégories'}
              </SelectItem>
              {CATEGORIES
                .filter(category => {
                  if (filterCategory) return category === filterCategory;
                  if (excludeCategory) return category !== excludeCategory;
                  return true;
                })
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredBoissons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune boisson trouvée.</p>
            {searchTerm || selectedCategory !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2"
              >
                Réinitialiser les filtres
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Version desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Seuil</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Modifié</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBoissons.map((boisson) => {
                    const status = getStockStatus(boisson.quantité, boisson.seuil_alerte);
                    const statusColor = getStatusColor(status);
                    const statusText = getStatusText(status);
                    
                    return (
                      <TableRow key={boisson.id}>
                        <TableCell className="font-medium">{boisson.nom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{boisson.catégorie}</Badge>
                        </TableCell>
                        <TableCell>{boisson.quantité}</TableCell>
                        <TableCell>{boisson.seuil_alerte}</TableCell>
                        <TableCell>
                          <Badge className={`${statusColor} border-0`}>
                            {renderStatusIcon(status)}
                            <span className="ml-1">{statusText}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(boisson.prix_achat)}</TableCell>
                        <TableCell>{boisson.fournisseur}</TableCell>
                        <TableCell>{formatDate(boisson.date_dernière_modif)}</TableCell>
                        <TableCell>
                          <Link href={`/edit/${boisson.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Version mobile */}
            <div className="md:hidden space-y-4">
              {filteredBoissons.map((boisson) => {
                const status = getStockStatus(boisson.quantité, boisson.seuil_alerte);
                const statusColor = getStatusColor(status);
                const statusText = getStatusText(status);
                
                return (
                  <Card key={boisson.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{boisson.nom}</h3>
                      <Link href={`/edit/${boisson.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Catégorie:</span>
                        <Badge variant="outline">{boisson.catégorie}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantité:</span>
                        <span>{boisson.quantité}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <Badge className={`${statusColor} border-0 text-xs`}>
                          {renderStatusIcon(status)}
                          <span className="ml-1">{statusText}</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix:</span>
                        <span>{formatPrice(boisson.prix_achat)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fournisseur:</span>
                        <span>{boisson.fournisseur}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 