import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { 
  Home, 
  MessageSquare, 
  BarChart2, 
  User, 
  LayoutDashboard, 
  Shield, 
  LogOut,
  Menu,
  X,
  Heart,
  Wind,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import WellnessToolsPage from './pages/WellnessToolsPage';
import InsightsPage from './pages/InsightsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/wellness', icon: Wind, label: 'Tools' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
  ];

  if (!user) return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            <span className="text-xs font-bold">Light Mode</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50 items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-emerald-600 text-xl">
          <Sparkles className="w-6 h-6" />
          <span>WellMind AI</span>
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <button 
            onClick={toggleTheme}
            className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded-lg">
              <Shield className="w-5 h-5" />
            </Link>
          )}
          <Link to="/profile" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded-lg">
            <User className="w-5 h-5" />
          </Link>
          <button onClick={logout} className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50 flex items-center justify-around px-2">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              location.pathname === item.path ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
        <button 
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 text-zinc-600 dark:text-zinc-400"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className="text-[10px]">Theme</span>
        </button>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </nav>
    </>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  const { theme } = useTheme();
  
  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16 md:pb-0 md:pt-16 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/mood" element={<ProtectedRoute><MoodTrackerPage /></ProtectedRoute>} />
            <Route path="/wellness" element={<ProtectedRoute><WellnessToolsPage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
