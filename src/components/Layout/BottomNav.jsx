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
            className="fixed bottom-0 left-0 right-0 z-50 glass"
            style={{ borderTop: '1px solid var(--aura-border)' }}
        >
            <div className="max-w-5xl mx-auto flex items-center justify-around h-16 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setActiveTab(item.id)}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative grow"
                            style={{ color: isActive ? 'var(--stem-primary)' : 'var(--aura-text-muted)' }}
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
                                animate={{ scale: isActive ? 1.2 : 1 }}
                            >
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                            </motion.div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
}
