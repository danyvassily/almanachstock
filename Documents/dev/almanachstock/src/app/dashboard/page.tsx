'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import AlertsPanel from '@/components/AlertsPanel';
import StockTable from '@/components/StockTable';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* En-tête du dashboard */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Stock des Boissons
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez vos boissons et autres produits (hors vins). Consultez la cave à vins séparément.
              </p>
            </div>

            {/* Panel d'alertes (hors vins) */}
            <AlertsPanel excludeCategory="Vin" />

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