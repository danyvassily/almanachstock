import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppression de l'export statique pour permettre l'utilisation complète de Firebase
  // output: 'export', - SUPPRIMÉ
  // distDir: 'dist', - SUPPRIMÉ
  // trailingSlash: true, - SUPPRIMÉ
  
  images: {
    // Garde l'optimisation d'images désactivée si nécessaire pour ton hébergeur
    unoptimized: false
  },
  
  // Variables d'environnement publiques pour Firebase
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  
  // Configuration pour des performances optimales
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
};

export default nextConfig;
