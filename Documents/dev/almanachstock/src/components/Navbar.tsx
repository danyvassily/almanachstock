'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Plus, 
  BarChart3, 
  Wine,
  AlertTriangle, 
  LogOut, 
  User,
  RefreshCw
} from 'lucide-react';
import useStockAlerts from '@/hooks/useStockAlerts';

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { getAlerteCounts } = useStockAlerts({ excludeCategory: "Vin" });
  
  // 🔥 MODE PRODUCTION : Authentification activée
  const isDevelopmentMode = false; // Changé à false pour activer l'auth
  const devUser = { email: 'demo@amphore-stock.com' };
  const currentUser = isDevelopmentMode ? devUser : user;
  
  const alerteCounts = getAlerteCounts();

  const handleSignOut = async () => {
    try {
      if (isDevelopmentMode) {
        // En mode dev, redirection simple
        router.push('/login');
      } else {
        await signOut(auth);
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!currentUser) {
    return null; // Ne pas afficher la navbar si l'utilisateur n'est pas connecté
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src="/almanach-logo-simple.svg"
                  alt="Amphore Stock"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Amphore Stock
              </span>
              {isDevelopmentMode && (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  MODE DEV
                </span>
              )}
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/adjust">
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ajuster Stock
                </Button>
              </Link>
              <Link href="/vins">
                <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                  <Wine className="h-4 w-4 mr-2" />
                  Cave à Vins
                </Button>
              </Link>
              <Link href="/add">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </Link>
            </div>
          </div>

          {/* Alertes et profil utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Badge d'alertes */}
            {alerteCounts.total > 0 && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <Badge variant="destructive" className="text-xs">
                  {alerteCounts.critique + alerteCounts.faible}
                </Badge>
              </div>
            )}

            {/* Menu utilisateur desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm text-gray-700">
                      {currentUser.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {isDevelopmentMode ? 'Retour Login' : 'Déconnexion'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/dashboard" onClick={closeMenu}>
                <div className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </Link>
              <Link href="/adjust" onClick={closeMenu}>
                <div className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Ajuster Stock
                  </Button>
                </div>
              </Link>
              <Link href="/vins" onClick={closeMenu}>
                <div className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <Wine className="h-4 w-4 mr-2" />
                    Cave à Vins
                  </Button>
                </div>
              </Link>
              <Link href="/add" onClick={closeMenu}>
                <div className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </div>
              </Link>
              <div className="border-t pt-2">
                <div className="flex items-center px-3 py-2">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm text-gray-700">
                    {currentUser.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isDevelopmentMode ? 'Retour Login' : 'Déconnexion'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 