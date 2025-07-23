'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Configuration des scopes pour récupérer email et profil
      provider.addScope('email');
      provider.addScope('profile');
      
      // Configuration des paramètres personnalisés
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline'
      });
      
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      setLoading(false);
      console.error('Google login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<UserCredential> => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 