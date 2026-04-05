import { Sun, Moon, LogOut, Bell, Sprout } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const { notifications, wallet, garden } = useApp();
    const [showNotifs, setShowNotifs] = useState(false);
    const unread = notifications.filter(n => !n.read).length;

    return (
        <header
            className="sticky top-0 z-50 glass"
            style={{ borderBottom: '1px solid var(--aura-border)' }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-5 min-h-14 h-14 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--accent-gradient)' }}
                    >
                        <Sprout className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gradient" style={{ fontFamily: 'Outfit' }}>
                        Aura
                    </span>
                </div>

                {/* Right side - HUD */}
                <div className="flex items-center gap-3">
                    {/* User Level */}
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className="aura-micro font-black uppercase tracking-wide opacity-60">Lvl</span>
                            <span className="text-sm font-black italic">{Math.floor((garden.roots.level + garden.stems.level + garden.buds.level) / 3)}</span>
                        </div>
                        <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${((garden.roots.xp % 100) + (garden.stems.xp % 100) + (garden.buds.xp % 100)) / 3}%` }}
                            />
                        </div>
                    </div>

                    {/* Token balance */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-full text-xs font-bold shadow-sm btn-game"
                        style={{ background: 'var(--aura-surface)', border: '1px solid var(--aura-border)' }}
                    >
                        <span className="animate-bounce">🪙</span>
                        <span>{wallet.balance}</span>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            type="button"
                            id="header-notifications"
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="aura-icon-btn rounded-xl transition-all duration-200 relative"
                            style={{ color: 'var(--aura-text-secondary)' }}
                            aria-expanded={showNotifs}
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5 shrink-0" aria-hidden />
                            {unread > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] min-h-[1.125rem] px-0.5 rounded-full aura-micro font-bold text-white flex items-center justify-center leading-none"
                                    style={{ background: 'var(--weed-primary)' }}>
                                    {unread > 9 ? '9+' : unread}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden"
                                    style={{
                                        background: 'var(--aura-surface)',
                                        border: '1px solid var(--aura-border)',
                                        boxShadow: 'var(--shadow-lg)',
                                    }}
                                >
                                    <div className="px-4 py-3 font-semibold text-sm" style={{ borderBottom: '1px solid var(--aura-border)' }}>
                                        Notifications
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <p className="px-4 py-5 text-xs text-center leading-relaxed" style={{ color: 'var(--aura-text-muted)' }}>
                                                No notifications yet 🌿
                                            </p>
                                        ) : (
                                            notifications.slice(0, 5).map(n => (
                                                <div key={n.id} className="px-4 py-2.5 text-xs leading-relaxed"
                                                    style={{
                                                        borderBottom: '1px solid var(--aura-border)',
                                                        color: 'var(--aura-text-secondary)',
                                                    }}>
                                                    {n.message}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme toggle */}
                    <button
                        type="button"
                        id="theme-toggle"
                        onClick={toggleTheme}
                        className="aura-icon-btn rounded-xl transition-all duration-200"
                        style={{ color: 'var(--aura-text-secondary)' }}
                        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" aria-hidden /> : <Moon className="w-5 h-5 shrink-0" aria-hidden />}
                    </button>

                    {/* User menu */}
                    <button
                        type="button"
                        id="user-menu"
                        onClick={logout}
                        className="aura-icon-btn rounded-xl transition-all duration-200"
                        style={{ color: 'var(--aura-text-secondary)' }}
                        title="Logout"
                        aria-label="Log out"
                    >
                        <LogOut className="w-5 h-5 shrink-0" aria-hidden />
                    </button>
                </div>
            </div>
        </header>
    );
}
