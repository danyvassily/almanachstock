'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Package, 
  Activity,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || (user && mounted)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-6">
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
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Gestion Intelligente",
      description: "Suivez vos stocks en temps réel avec des alertes automatiques et des prévisions avancées."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Avancés",
      description: "Tableaux de bord interactifs et rapports détaillés pour optimiser vos performances."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Sécurité Renforcée",
      description: "Vos données sont protégées avec un chiffrement de niveau entreprise."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Optimale",
      description: "Interface rapide et réactive pour une expérience utilisateur exceptionnelle."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaboration d'Équipe",
      description: "Travaillez en équipe avec des rôles et permissions personnalisables."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Accès Universel",
      description: "Accessible depuis n'importe quel appareil, n'importe où dans le monde."
    }
  ];

  const benefits = [
    "Réduction des coûts de stockage jusqu'à 30%",
    "Gain de temps de 50% sur la gestion quotidienne",
    "Prévention des ruptures de stock",
    "Optimisation automatique des commandes",
    "Conformité réglementaire assurée"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Navigation */}
      <header className="relative z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Image
                  src="/almanach-logo.svg"
                  alt="L&apos;Almanach Montmartre"
                  width={32}
                  height={32}
                  className="h-8 w-8 invert"
                />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">Amphore Stock</h1>
                <p className="text-sm text-slate-600">Gestion Professionnelle</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  <Activity className="h-4 w-4 mr-2" />
                  Solution Professionnelle
                </div>
                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  Révolutionnez votre 
                  <span className="text-blue-600"> gestion de stock</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Amphore Stock vous offre une solution complète et intuitive pour optimiser vos inventaires, 
                  réduire vos coûts et maximiser vos performances commerciales.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg h-auto"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 px-8 py-3 text-lg h-auto"
                >
                  Découvrir les fonctionnalités
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">99.9%</div>
                  <div className="text-sm text-slate-600">Disponibilité</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">10k+</div>
                  <div className="text-sm text-slate-600">Produits gérés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Tableau de bord</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full w-1/2"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-5/6"></div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                        <div className="text-2xl font-bold text-slate-900">+24%</div>
                        <div className="text-sm text-slate-600">Performance</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <Package className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-slate-900">1,247</div>
                        <div className="text-sm text-slate-600">Articles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités avancées
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez tous les outils dont vous avez besoin pour optimiser votre gestion de stock 
              et propulser votre entreprise vers le succès.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-xl text-slate-900">{feature.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Résultats mesurables
                </h2>
                <p className="text-xl text-slate-600">
                  Nos clients constatent des améliorations significatives dès les premières semaines d&apos;utilisation.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-6">Évolution des performances</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Efficacité opérationnelle</span>
                      <span className="font-semibold text-slate-900">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Réduction des coûts</span>
                      <span className="font-semibold text-slate-900">72%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Satisfaction utilisateur</span>
                      <span className="font-semibold text-slate-900">94%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Prêt à transformer votre gestion de stock ?
            </h2>
                         <p className="text-xl text-blue-100 max-w-2xl mx-auto">
               Rejoignez des centaines d&apos;entreprises qui ont déjà révolutionné leur approche 
               de la gestion d&apos;inventaire avec Amphore Stock.
             </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => router.push('/login')}
                className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 text-lg h-auto font-semibold"
              >
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg h-auto"
              >
                Planifier une démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Image
                  src="/almanach-logo.svg"
                  alt="L&apos;Almanach Montmartre"
                  width={32}
                  height={32}
                  className="h-8 w-8 invert"
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-xl text-white">Amphore Stock</h3>
                                 <p className="text-slate-400 text-sm">by L&apos;Almanach Montmartre</p>
              </div>
            </div>
            <div className="space-y-2 text-slate-400">
              <p className="font-medium">© 2024 Dany Manfoumbi Vassiliakos</p>
              <p>danyvassiliakos@gmail.com</p>
              <p className="text-slate-500">Solution de gestion de stock professionnelle</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
