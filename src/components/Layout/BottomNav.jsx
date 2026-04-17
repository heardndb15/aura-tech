import { Home, ListTodo, ShieldAlert, User, BookHeart } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { id: 'garden', icon: Home, label: 'Garden' },
    { id: 'tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'fears', icon: ShieldAlert, label: 'Fears' },
    { id: 'review', icon: BookHeart, label: 'Review' },
    { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 glass pb-[env(safe-area-inset-bottom,0px)]"
            style={{ borderTop: '1px solid var(--aura-border)' }}
            aria-label="Main navigation"
        >
            <div className="max-w-5xl mx-auto flex items-stretch justify-around min-h-16 px-1 sm:px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <motion.button
                            type="button"
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setActiveTab(item.id)}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 min-h-[3.25rem] sm:min-h-14 rounded-xl transition-all duration-200 relative grow max-w-[5.5rem]"
                            style={{ color: isActive ? 'var(--stem-primary)' : 'var(--aura-text-muted)' }}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={item.label}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -top-1 w-8 h-1 rounded-full"
                                    style={{ background: 'var(--accent-gradient)' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <motion.div
                                animate={{ scale: isActive ? 1.15 : 1 }}
                            >
                                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 1.8} aria-hidden />
                            </motion.div>
                            <span className="aura-micro font-black uppercase tracking-wide text-center leading-tight line-clamp-2">{item.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
}
