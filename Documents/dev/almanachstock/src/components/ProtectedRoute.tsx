'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔥 MODE PRODUCTION : Authentification requise
  const isDevelopmentMode = false; // Changé à false pour activer l'auth

  useEffect(() => {
    if (!isDevelopmentMode && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, isDevelopmentMode]);

  // Mode développement : accès direct
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection va se faire)
  if (!user) {
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return <>{children}</>;
} 