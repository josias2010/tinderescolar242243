import { useState, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';
import AdminPage from './pages/AdminPage';
import MatchesPage from './pages/MatchesPage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => void;
  register: (data: any) => void;
  logout: () => void;
  completeOnboarding: () => void;
  onboardingComplete: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  completeOnboarding: () => {},
  onboardingComplete: false,
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = (email: string, _password: string) => {
    setIsAuthenticated(true);
    setOnboardingComplete(true);
    setUser({ email, name: 'Usuario', plan: 'free' });
  };

  const register = (data: any) => {
    setIsAuthenticated(true);
    setOnboardingComplete(false);
    setUser({ ...data, plan: 'free' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setOnboardingComplete(false);
    setUser(null);
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, completeOnboarding, onboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, onboardingComplete } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (onboardingComplete) return <Navigate to="/app/discover" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
          <Route path="/app/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}