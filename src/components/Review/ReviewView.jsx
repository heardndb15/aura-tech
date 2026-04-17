import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { ThumbsUp, ThumbsDown, Eye, Camera, AlertTriangle } from 'lucide-react';

// Demo review items for MVP
const DEMO_REVIEWS = [
    {
        id: 'review-1',
        userName: 'Jamie K.',
        taskTitle: 'Study SAT Math for 2 hours',
        category: 'stem',
        proofPhoto: null,
        challenge: 'Show your hand with a peace sign (V) + Include a blue object + Have your textbook/study material visible',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'review-2',
        userName: 'Morgan L.',
        taskTitle: 'Volunteer at the community center',
        category: 'bud',
        proofPhoto: null,
        challenge: 'Show your hand with an OK sign + Be near a door + Have something you shared with someone visible',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: 'review-3',
        userName: 'Taylor R.',
        taskTitle: 'Meditate for 15 minutes',
        category: 'root',
        proofPhoto: null,
        challenge: 'Show your hand with thumbs up + Include an orange object + Have a calming item visible',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
];

export default function ReviewView() {
    const [reviewItems, setReviewItems] = useState(DEMO_REVIEWS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [voted, setVoted] = useState({});

    const currentItem = reviewItems[currentIndex];
    const allReviewed = currentIndex >= reviewItems.length;

    const handleVote = (itemId, isValid) => {
        setVoted(prev => ({ ...prev, [itemId]: isValid }));
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 500);
    };

    const categoryColors = {
        root: { bg: 'var(--root-light)', color: 'var(--root-primary)', emoji: '🧘' },
        stem: { bg: 'var(--stem-light)', color: 'var(--stem-primary)', emoji: '📚' },
        bud: { bg: 'var(--bud-light)', color: 'var(--bud-primary)', emoji: '🤝' },
        weed: { bg: 'var(--weed-light)', color: 'var(--weed-primary)', emoji: '🌾' },
    };

    return (
        <div className="aura-view">
            <div className="flex flex-col gap-2 sm:gap-3">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Peer Review</h2>
            <p className="text-xs leading-relaxed max-w-prose" style={{ color: 'var(--aura-text-muted)' }}>
                Help verify other users' task completions. You earn karma for each review!
            </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--aura-bg-secondary)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--accent-gradient)' }}
                        animate={{ width: `${(currentIndex / reviewItems.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--aura-text-muted)' }}>
                    {currentIndex}/{reviewItems.length}
                </span>
            </div>

            <AnimatePresence mode="wait">
                {allReviewed ? (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-5xl mb-4">🌟</div>
                        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Outfit', color: 'var(--stem-primary)' }}>
                            All Reviewed!
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--aura-text-muted)' }}>
                            Great work! You've reviewed all pending submissions.
                        </p>
                        <p className="text-xs mt-2" style={{ color: 'var(--aura-text-muted)' }}>
                            +{reviewItems.length * 5} karma earned 🧘
                        </p>
                        <button
                            type="button"
                            onClick={() => { setCurrentIndex(0); setVoted({}); }}
                            className="mt-2 px-4 py-2.5 min-h-11 rounded-xl text-sm font-medium"
                            style={{ background: 'var(--stem-light)', color: 'var(--stem-primary)' }}
                        >
                            Review again
                        </button>
                    </motion.div>
                ) : currentItem ? (
                    <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: 'var(--aura-surface)',
                            border: '1px solid var(--aura-border)',
                            boxShadow: 'var(--shadow-md)',
                        }}
                    >
                        {/* Photo area */}
                        <div
                            className="h-52 flex items-center justify-center relative"
                            style={{ background: 'var(--aura-bg-secondary)' }}
                        >
                            <div className="text-center">
                                <Camera className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--aura-text-muted)' }} />
                                <p className="text-xs" style={{ color: 'var(--aura-text-muted)' }}>
                                    Demo — Photo proof would appear here
                                </p>
                            </div>

                            {/* Category badge */}
                            <span
                                className="absolute top-3 left-3 aura-micro font-semibold px-2 py-1 rounded-full"
                                style={{
                                    background: categoryColors[currentItem.category]?.bg,
                                    color: categoryColors[currentItem.category]?.color,
                                }}
                            >
                                {categoryColors[currentItem.category]?.emoji} {currentItem.category}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="p-4 sm:p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: 'var(--accent-gradient)' }}>
                                    {currentItem.userName[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold" style={{ color: 'var(--aura-text)' }}>
                                        {currentItem.userName}
                                    </p>
                                    <p className="aura-micro" style={{ color: 'var(--aura-text-muted)' }}>
                                        {new Date(currentItem.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-sm font-semibold leading-snug" style={{ color: 'var(--aura-text)' }}>
                                {currentItem.taskTitle}
                            </h4>

                            {/* Challenge requirements */}
                            <div className="rounded-lg p-3 sm:p-4" style={{ background: 'var(--aura-bg-secondary)' }}>
                                <p className="aura-micro font-semibold mb-1.5" style={{ color: 'var(--aura-text-secondary)' }}>
                                    Challenge Requirements:
                                </p>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--aura-text-muted)' }}>
                                    {currentItem.challenge}
                                </p>
                            </div>

                            {/* Vote section */}
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3" style={{ color: 'var(--accent-gold)' }} />
                                <p className="aura-micro" style={{ color: 'var(--aura-text-muted)' }}>
                                    Does this photo meet all the challenge requirements?
                                </p>
                            </div>

                            <div className="flex gap-3 sm:gap-4">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVote(currentItem.id, true)}
                                    className={`flex-1 flex items-center justify-center gap-2 min-h-11 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${voted[currentItem.id] === true ? 'ring-2' : ''}`}
                                    style={{
                                        background: voted[currentItem.id] === true ? 'var(--stem-primary)' : 'var(--stem-light)',
                                        color: voted[currentItem.id] === true ? '#fff' : 'var(--stem-primary)',
                                    }}
                                >
                                    <ThumbsUp className="w-4 h-4" /> Valid
                                </motion.button>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVote(currentItem.id, false)}
                                    className={`flex-1 flex items-center justify-center gap-2 min-h-11 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${voted[currentItem.id] === false ? 'ring-2' : ''}`}
                                    style={{
                                        background: voted[currentItem.id] === false ? 'var(--weed-primary)' : 'var(--weed-light)',
                                        color: voted[currentItem.id] === false ? '#fff' : 'var(--weed-primary)',
                                    }}
                                >
                                    <ThumbsDown className="w-4 h-4" /> Invalid
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
