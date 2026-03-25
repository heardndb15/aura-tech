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
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setActiveTab(item.id)}
                            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative"
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
                            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
