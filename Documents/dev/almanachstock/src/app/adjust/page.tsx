'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import QuickStockAdjust from '@/components/QuickStockAdjust';

export default function AdjustPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <QuickStockAdjust />
        </main>
      </div>
    </ProtectedRoute>
  );
} 