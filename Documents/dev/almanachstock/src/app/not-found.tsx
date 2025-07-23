'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600 rounded-full">
            <BarChart3 className="h-12 w-12 text-white" />
          </div>
        </div>
        
        {/* Titre et description */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Page non trouvée
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
            Vérifiez l'URL ou retournez à l'accueil.
          </p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>
        
        {/* Footer */}
        <div className="text-sm text-gray-500 pt-8">
          <p>© 2024 Dany Manfoumbi Vassiliakos - danyvassiliakos@gmail.com</p>
        </div>
      </div>
    </div>
  );
} 