'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import StockTable from '@/components/StockTable';
import CompactAlertsPanel from '@/components/CompactAlertsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wine, BarChart3, TrendingUp } from 'lucide-react';
import useVinsMetrics from '@/hooks/useVinsMetrics';

export default function VinsPage() {
  const { user } = useAuth();
  const { totalVins, valeurTotale, prixMoyen, stockTotal, loading, error } = useVinsMetrics();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* En-tête des vins */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-600 rounded-full">
                <Wine className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Cave à Vins
                </h1>
                <p className="mt-2 text-gray-600">
                  Gestion de votre cave et stocks de vins
                </p>
              </div>
            </div>

            {/* Métriques spécifiques aux vins */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Vins
                  </CardTitle>
                  <Wine className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {loading ? '...' : stockTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bouteilles en stock
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Valeur Cave
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {loading ? '...' : `${valeurTotale}€`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valeur totale des vins
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Prix Moyen
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {loading ? '...' : `${prixMoyen}€`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Par bouteille
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertes spécifiques aux vins */}
            <CompactAlertsPanel filterCategory="Vin" />

            {/* Table des vins */}
            <StockTable filterCategory="Vin" />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 