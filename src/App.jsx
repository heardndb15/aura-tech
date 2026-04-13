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
import VerificationDemo from './components/Verification/VerificationDemo';
import { AnimatePresence, motion } from 'framer-motion';

const PAGES = {
  garden: GardenView,
  tasks: TasksView,
  fears: FearsView,
  review: ReviewView,
  profile: ProfileView,
  verification: VerificationDemo,
};

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('garden');
  const [showAuth, setShowAuth] = useState(false);

  console.log('App Rendering. User:', user, 'Loading:', loading);

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
  if (!user) {
    console.log('No user detected, showing Auth/Landing');
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
              onClick={() => setShowAuth(false)}
              className="fixed top-6 left-6 z-[60] text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
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
    <div className="min-h-screen" style={{ background: 'var(--aura-bg)' }}>
      {/* Ambient garden background */}
      <div className="garden-bg" />
      <div className="bg-glow-top" />

      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ActivePage setActiveTab={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
