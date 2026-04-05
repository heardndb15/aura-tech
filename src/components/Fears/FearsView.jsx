import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Plus, X, Skull, Swords, CheckCircle2, Flame } from 'lucide-react';

export default function FearsView() {
    const { fears, addFear, conquerFear } = useApp();
    const [showAdd, setShowAdd] = useState(false);
    const [fearText, setFearText] = useState('');

    const activeFears = fears.filter(f => f.status === 'active');
    const conqueredFears = fears.filter(f => f.status === 'conquered');

    const handleAddFear = () => {
        if (!fearText.trim()) return;
        addFear(fearText.trim());
        setFearText('');
        setShowAdd(false);
    };

    return (
        <div className="aura-view">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Weeds 🌾</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-black btn-game shadow-lg shrink-0"
                    style={{ background: 'var(--weed-primary)' }}
                >
                    <Plus className="w-5 h-5" /> Slayer Mode
                </motion.button>
                </div>
                <p className="text-xs leading-relaxed max-w-prose" style={{ color: 'var(--aura-text-muted)' }}>
                Face your fears. Complete challenges to remove weeds from your garden.
            </p>
            </div>

            {/* Stats banner */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--weed-light)', border: '1px solid var(--weed-primary)33' }}>
                    <div className="flex items-center gap-2">
                        <Skull className="w-5 h-5" style={{ color: 'var(--weed-primary)' }} />
                        <div>
                            <p className="text-lg font-bold" style={{ color: 'var(--weed-primary)' }}>{activeFears.length}</p>
                            <p className="aura-micro" style={{ color: 'var(--aura-text-muted)' }}>Active weeds</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--stem-light)', border: '1px solid var(--stem-primary)33' }}>
                    <div className="flex items-center gap-2">
                        <Swords className="w-5 h-5" style={{ color: 'var(--stem-primary)' }} />
                        <div>
                            <p className="text-lg font-bold" style={{ color: 'var(--stem-primary)' }}>{conqueredFears.length}</p>
                            <p className="aura-micro" style={{ color: 'var(--aura-text-muted)' }}>Conquered</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Fears */}
            {activeFears.length > 0 && (
                <>
                    <div className="aura-subsection">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--aura-text-secondary)' }}>
                        🔥 Active Fears
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        <AnimatePresence>
                            {activeFears.map((fear, i) => (
                                <motion.div
                                    key={fear.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-2xl p-4 sm:p-5 transition-all duration-200 card-game"
                                    style={{
                                        background: 'var(--aura-surface)',
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                                            style={{ background: 'var(--weed-light)' }}>
                                            🌾
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--aura-text)' }}>
                                                {fear.text}
                                            </h4>
                                            <div className="rounded-lg p-3 sm:p-4 mb-4" style={{ background: 'var(--aura-bg-secondary)' }}>
                                                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--bud-primary)' }}>
                                                    💪 Challenge:
                                                </p>
                                                <p className="text-xs" style={{ color: 'var(--aura-text-secondary)' }}>
                                                    {fear.challenge}
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => conquerFear(fear.id)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white btn-game"
                                                style={{ background: 'var(--stem-primary)' }}
                                            >
                                                <Swords className="w-4 h-4" /> Vanquish!
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    </div>
                </>
            )}

            {/* Conquered Fears */}
            {conqueredFears.length > 0 && (
                <div className="aura-subsection">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--aura-text-secondary)' }}>
                        ✅ Conquered
                    </h3>
                    <div className="space-y-3">
                        {conqueredFears.map((fear) => (
                            <div
                                key={fear.id}
                                className="rounded-xl p-4 flex items-center gap-3 sm:gap-4 opacity-70"
                                style={{
                                    background: 'var(--aura-surface)',
                                    border: '1px solid var(--aura-border)',
                                }}
                            >
                                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--stem-primary)' }} />
                                <div className="flex-1">
                                    <p className="text-sm line-through" style={{ color: 'var(--aura-text-muted)' }}>
                                        {fear.text}
                                    </p>
                                </div>
                                <Flame className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {fears.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-5xl mb-3">🌾</div>
                    <p className="text-sm font-medium" style={{ color: 'var(--aura-text-secondary)' }}>
                        No weeds in your garden yet
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--aura-text-muted)' }}>
                        Add a fear to start growing stronger
                    </p>
                </div>
            )}

            {/* Add Fear Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-5"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowAdd(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="w-full max-w-sm rounded-2xl p-5 sm:p-6"
                            style={{ background: 'var(--aura-surface)', boxShadow: 'var(--shadow-lg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <h3 className="font-bold" style={{ fontFamily: 'Outfit' }}>🌾 Name Your Fear</h3>
                                <button type="button" onClick={() => setShowAdd(false)} className="aura-icon-btn rounded-xl shrink-0" style={{ color: 'var(--aura-text-muted)' }} aria-label="Close">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--aura-text-muted)' }}>
                                Write down something you're afraid of. We'll generate a challenge to help you face it.
                            </p>

                            <input
                                id="fear-input"
                                type="text"
                                value={fearText}
                                onChange={(e) => setFearText(e.target.value)}
                                placeholder="e.g., Public speaking, rejection, heights..."
                                className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                                style={{
                                    background: 'var(--aura-bg-secondary)',
                                    border: '1px solid var(--aura-border)',
                                    color: 'var(--aura-text)',
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddFear()}
                            />

                            <button
                                type="button"
                                id="fear-add"
                                onClick={handleAddFear}
                                disabled={!fearText.trim()}
                                className="w-full min-h-11 py-3 rounded-xl text-white text-sm font-black transition-all duration-200 disabled:opacity-40 btn-game shadow-lg"
                                style={{ background: 'var(--weed-primary)' }}
                            >
                                Start Boss Fight ⚔️
                            </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
