import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Sparkles, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DECOR_ITEMS = [
    { id: 'lantern-1', label: 'Spirit Lantern', emoji: '🏮', price: 50, theme: 'Fire', type: 'decor' },
    { id: 'fountain-1', label: 'Zen Fountain', emoji: '⛲', price: 150, theme: 'Water', type: 'decor' },
    { id: 'crystal-1', label: 'Astral Crystal', emoji: '🔮', price: 200, theme: 'Earth', type: 'decor' },
    { id: 'windchime-1', label: 'Breeze Chime', emoji: '🎐', price: 80, theme: 'Air', type: 'decor' },
    { id: 'bonsai-1', label: 'Master Bonsai', emoji: '🪴', price: 120, theme: 'Earth', type: 'decor' },
    { id: 'statue-1', label: 'Guardian Fox', emoji: '🦊', price: 300, theme: 'Spiritual', type: 'decor' },
    { id: 'sakura-1', label: 'Ever-Bloom', emoji: '🌸', price: 250, theme: 'Growth', type: 'decor' },
];

export default function ShopModal({ onClose }) {
    const { wallet, buyItem, garden } = useApp();

    const handleBuy = (item) => {
        if (buyItem(item)) {
            // Success sound or more visual feedback?
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white dark:bg-[#0b1a0f] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 text-white overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
                    <div className="absolute top-0 right-0 opacity-10 text-8xl -rotate-12 translate-x-1/4 translate-y-1/4 select-none">💎</div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tight" style={{ fontFamily: 'Outfit' }}>EMPORIUM</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Island Decoration & Rare Artifacts</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Balance Banner */}
                <div className="px-6 py-3 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase opacity-60">Current Bag</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-black text-sm border border-yellow-400/30">
                        <span className="animate-bounce">🪙</span> {wallet.balance} GEMS
                    </div>
                </div>

                {/* Items Grid */}
                <div className="p-6 grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                    {DECOR_ITEMS.map((item) => {
                        const canAfford = wallet.balance >= item.price;
                        const isOwned = (garden.decorations || []).some(d => d.id === item.id);

                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -4 }}
                                className={`relative p-4 rounded-2xl border-2 transition-all group overflow-hidden ${isOwned
                                        ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10'
                                        : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:border-accent-gold/50'
                                    }`}
                            >
                                {/* Item Glow */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent-gold/10 blur-xl group-hover:bg-accent-gold/20 transition-colors" />

                                <div className="text-center mb-3">
                                    <span className="text-4xl block mb-2 filter drop-shadow-lg group-hover:scale-110 transition-transform">
                                        {item.emoji}
                                    </span>
                                    <h3 className="text-sm font-black tracking-tight" style={{ color: 'var(--aura-text)' }}>{item.label}</h3>
                                    <span className="text-[10px] font-bold opacity-50 uppercase">{item.theme}</span>
                                </div>

                                <button
                                    onClick={() => !isOwned && handleBuy(item)}
                                    disabled={!canAfford || isOwned}
                                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${isOwned
                                            ? 'bg-emerald-500 text-white cursor-default'
                                            : canAfford
                                                ? 'bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95'
                                                : 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    {isOwned ? 'OWNED' : canAfford ? `${item.price} GEMS` : 'NOT ENOUGH'}
                                </button>

                                {isOwned && (
                                    <div className="absolute top-2 right-2">
                                        <Sparkles className="w-3 h-3 text-emerald-500" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="p-4 text-center">
                    <p className="text-[10px] font-medium opacity-40">Artifacts are placed randomly on your island upon purchase.</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
