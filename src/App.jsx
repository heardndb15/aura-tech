import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import GardenView from './components/Garden/GardenView';
import TasksView from './components/Tasks/TasksView';
import FearsView from './components/Fears/FearsView';
import ReviewView from './components/Review/ReviewView';
import ProfileView from './components/Profile/ProfileView';
import LandingPage from './components/Landing/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';

const PAGES = {
  garden: GardenView,
  tasks: TasksView,
  fears: FearsView,
  review: ReviewView,
  profile: ProfileView,
};

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('garden');
  const [showAuth, setShowAuth] = useState(false);


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--aura-bg)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-3 animate-pulse-glow">🌱</div>
          <p className="text-sm" style={{ color: 'var(--aura-text-muted)' }}>Growing your garden...</p>
        </motion.div>
      </div>
    );
  }

  // Auth/Landing screen
  if (!user) {;
    return (
      <AnimatePresence mode="wait">
        {!showAuth ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={() => setShowAuth(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <AuthPage />
            {/* Back button to landing */}
            <button
              type="button"
              onClick={() => setShowAuth(false)}
              className="fixed top-[max(1.5rem,env(safe-area-inset-top))] left-[max(1.5rem,env(safe-area-inset-left))] z-[60] transition-colors inline-flex items-center gap-2 min-h-11 px-3 rounded-xl text-xs font-black uppercase tracking-wide"
              style={{ color: 'var(--aura-text-secondary)' }}
            >
              ← Назад
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Main app
  const ActivePage = PAGES[activeTab];

  return (
    <div className="w-full flex flex-col min-h-screen" style={{ background: 'var(--aura-bg)' }}>
      {/* Ambient garden background */}
      <div className="garden-bg" />
      <div className="bg-glow-top" />

      <Header />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
          >
            <ActivePage setActiveTab={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
