'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import CompactAlertsPanel from '@/components/CompactAlertsPanel';
import StockTable from '@/components/StockTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* En-tête du dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Stock des Boissons
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez vos boissons et autres produits (hors vins). Consultez la cave à vins séparément.
                </p>
              </div>
              
              {/* Boutons d'action rapide */}
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                <Link href="/adjust">
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Ajuster Stock
                  </Button>
                </Link>
                <Link href="/add">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Produit
                  </Button>
                </Link>
              </div>
            </div>

            {/* Panel d'alertes (hors vins) */}
            <CompactAlertsPanel excludeCategory="Vin" />

            {/* Tableau des stocks (hors vins) */}
            <StockTable 
              excludeCategory="Vin" 
              title="Stock des Boissons et Produits" 
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 