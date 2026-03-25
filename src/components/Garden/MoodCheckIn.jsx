import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const MOODS = [
    { value: 1, emoji: '😔', label: 'Struggling' },
    { value: 2, emoji: '😕', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' },
];

export default function MoodCheckIn({ onClose }) {
    const { addMoodCheckIn } = useApp();
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!selectedMood) return;
        addMoodCheckIn(selectedMood, note);
        setSubmitted(true);
        setTimeout(onClose, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="w-full max-w-sm rounded-2xl p-6"
                    style={{
                        background: 'var(--aura-surface)',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {submitted ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="text-5xl mb-3">🌿</div>
                            <p className="font-semibold" style={{ color: 'var(--stem-primary)' }}>
                                Check-in recorded!
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--aura-text-muted)' }}>
                                +10 XP for Roots
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold" style={{ fontFamily: 'Outfit' }}>How are you feeling?</h3>
                                <button onClick={onClose} style={{ color: 'var(--aura-text-muted)' }}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mood selector */}
                            <div className="flex justify-between mb-5">
                                {MOODS.map((mood) => (
                                    <motion.button
                                        key={mood.value}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedMood(mood.value)}
                                        className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                                        style={{
                                            background: selectedMood === mood.value ? 'var(--root-light)' : 'transparent',
                                            border: selectedMood === mood.value ? '2px solid var(--root-primary)' : '2px solid transparent',
                                        }}
                                    >
                                        <span className="text-2xl">{mood.emoji}</span>
                                        <span className="text-[10px] font-medium" style={{
                                            color: selectedMood === mood.value ? 'var(--root-primary)' : 'var(--aura-text-muted)',
                                        }}>
                                            {mood.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Note */}
                            <textarea
                                id="mood-note"
                                placeholder="What's on your mind? (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-xl text-sm resize-none outline-none mb-4"
                                style={{
                                    background: 'var(--aura-bg-secondary)',
                                    border: '1px solid var(--aura-border)',
                                    color: 'var(--aura-text)',
                                }}
                            />

                            <button
                                id="mood-submit"
                                onClick={handleSubmit}
                                disabled={!selectedMood}
                                className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                Record Mood 🧘
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
