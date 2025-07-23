'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, loginWithGoogle, register, user } = useAuth();
  const router = useRouter();

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        default:
          errorMessage = error.message || 'Une erreur est survenue';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la connexion avec Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Connexion annulée par l\'utilisateur';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloquée par le navigateur. Veuillez autoriser les popups.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Demande de connexion annulée';
          break;
        default:
          errorMessage = error.message || 'Erreur lors de la connexion avec Google';
      }
      
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100">
              <Image
                src="/almanach-logo.svg"
                alt="L&apos;Almanach Montmartre"
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Amphore Stock</h1>
          <p className="text-slate-600 font-medium">
            Votre solution de gestion de stock professionnelle
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              {isRegistering ? 'Créer un compte' : 'Bienvenue'}
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              {isRegistering 
                ? 'Créez votre compte pour commencer'
                : 'Connectez-vous pour accéder à votre espace'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Bouton Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </div>
              )}
            </Button>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 font-medium">Ou</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading || isGoogleLoading}
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200" 
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isRegistering ? 'Création...' : 'Connexion...'}
                  </div>
                ) : (
                  isRegistering ? 'Créer le compte' : 'Se connecter'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                disabled={isLoading || isGoogleLoading}
              >
                {isRegistering 
                  ? 'Déjà un compte ? Se connecter'
                  : 'Pas de compte ? Créer un compte'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 space-y-1">
          <p className="font-medium">© 2024 Dany Manfoumbi Vassiliakos</p>
          <p>danyvassiliakos@gmail.com</p>
          <p className="text-slate-400">Solution de gestion de stock professionnelle</p>
        </div>
      </div>
    </div>
  );
} 