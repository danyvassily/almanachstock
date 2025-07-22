'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔥 MODE PRODUCTION : Authentification activée
  const isDevelopmentMode = false; // Changé à false pour activer l'auth

  useEffect(() => {
    if (isDevelopmentMode) {
      // En mode dev, aller directement au dashboard
      router.push('/dashboard');
      return;
    }

    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router, isDevelopmentMode]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        {/* Logo animé */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-full shadow-lg animate-pulse">
            <Image
              src="/almanach-logo.svg"
              alt="L&apos;Almanach Montmartre"
              width={80}
              height={80}
              className="h-20 w-20"
            />
          </div>
        </div>
        
        {/* Titre */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            L&apos;Almanach Montmartre
          </h1>
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Stock Management
          </h2>
          <p className="text-gray-600">
            {isDevelopmentMode ? 'Redirection vers le dashboard...' : 'Chargement de l\'application...'}
          </p>
        </div>
        
        {/* Spinner de chargement */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}
