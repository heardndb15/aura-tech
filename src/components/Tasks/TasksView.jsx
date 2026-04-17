import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { generateProofChallenge } from '../../utils/proofSystem';
import { calculateReward } from '../../utils/economy';
import {
    Plus, Clock, CheckCircle2, XCircle, Camera, Brain,
    TrendingUp, Heart, AlertTriangle, Coins, X, Timer
} from 'lucide-react';

const CATEGORIES = [
    { id: 'root', label: 'Root', icon: Brain, color: 'var(--root-primary)', light: 'var(--root-light)', emoji: '🧘' },
    { id: 'stem', label: 'Stem', icon: TrendingUp, color: 'var(--stem-primary)', light: 'var(--stem-light)', emoji: '📚' },
    { id: 'bud', label: 'Bud', icon: Heart, color: 'var(--bud-primary)', light: 'var(--bud-light)', emoji: '🤝' },
];

export default function TasksView() {
    const { tasks, addTask, updateTask, completeTask, failTask, placeStake, wallet, garden } = useApp();
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('all');
    const [proofTask, setProofTask] = useState(null);

    const filtered = tasks.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'active') return t.status === 'active' || t.status === 'pending_proof';
        return t.status === filter;
    });

    return (
        <div className="aura-view">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Tasks</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-black btn-game shadow-lg"
                    style={{ background: 'var(--accent-gradient)' }}
                >
                    <Plus className="w-5 h-5" /> New Quest
                </motion.button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                {['all', 'active', 'completed', 'failed'].map(f => (
                    <button
                        type="button"
                        key={f}
                        onClick={() => setFilter(f)}
                        className="px-3 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 shrink-0"
                        style={{
                            background: filter === f ? 'var(--stem-light)' : 'var(--aura-bg-secondary)',
                            color: filter === f ? 'var(--stem-primary)' : 'var(--aura-text-muted)',
                            border: `1px solid ${filter === f ? 'var(--stem-primary)' : 'var(--aura-border)'}`,
                        }}
                    >
                        {f} {f !== 'all' && `(${tasks.filter(t => f === 'active' ? (t.status === 'active' || t.status === 'pending_proof') : t.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4">
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-4xl mb-3">🌿</div>
                            <p className="text-sm" style={{ color: 'var(--aura-text-muted)' }}>
                                No tasks yet. Plant some seeds!
                            </p>
                        </motion.div>
                    ) : (
                        filtered.map((task, i) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={i}
                                onProof={() => setProofTask(task)}
                                onComplete={() => completeTask(task.id)}
                                onFail={() => failTask(task.id)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create Task Modal */}
            {showCreate && (
                <CreateTaskModal
                    onClose={() => setShowCreate(false)}
                    onSubmit={(task) => {
                        const newTask = addTask(task);
                        if (task.stakeAmount > 0) {
                            placeStake(newTask.id, task.stakeAmount);
                        }
                        setShowCreate(false);
                    }}
                    balance={wallet.balance}
                />
            )}

            {/* Proof Modal */}
            {proofTask && (
                <ProofModal
                    task={proofTask}
                    onClose={() => setProofTask(null)}
                    onSubmit={(photoData) => {
                        updateTask(proofTask.id, {
                            status: 'pending_review',
                            proofPhoto: photoData,
                            proofChallenge: generateProofChallenge(proofTask.category),
                        });
                        setProofTask(null);
                    }}
                />
            )}
        </div>
    );
}

// ============ TASK CARD ============
function TaskCard({ task, index, onProof, onComplete, onFail }) {
    const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[1];
    const isActive = task.status === 'active' || task.status === 'pending_proof';

    const statusConfig = {
        active: { label: 'Active', color: 'var(--stem-primary)', bg: 'var(--stem-light)' },
        pending_proof: { label: 'Proof needed', color: 'var(--bud-primary)', bg: 'var(--bud-light)' },
        pending_review: { label: 'Under review', color: 'var(--root-primary)', bg: 'var(--root-light)' },
        completed: { label: 'Completed ✓', color: 'var(--stem-primary)', bg: 'var(--stem-light)' },
        failed: { label: 'Failed', color: 'var(--weed-primary)', bg: 'var(--weed-light)' },
    };
    const status = statusConfig[task.status] || statusConfig.active;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl p-4 sm:p-5 transition-all duration-200 card-game"
            style={{
                background: 'var(--aura-surface)',
            }}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 mt-0.5"
                    style={{ background: cat.light }}
                >
                    {cat.emoji}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--aura-text)' }}>
                            {task.title}
                        </h4>
                        <span
                            className="aura-micro font-medium px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: status.bg, color: status.color }}
                        >
                            {status.label}
                        </span>
                    </div>

                    {task.description && (
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--aura-text-muted)' }}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                        {task.deadline && (
                            <span className="flex items-center gap-1 aura-micro" style={{ color: 'var(--aura-text-muted)' }}>
                                <Clock className="w-3 h-3" />
                                {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        )}
                        {task.stake > 0 && (
                            <span className="flex items-center gap-1 aura-micro font-semibold" style={{ color: 'var(--accent-gold)' }}>
                                <Coins className="w-3 h-3" />
                                {task.stake} tokens staked
                            </span>
                        )}
                    </div>

                    {/* Action buttons */}
                    {isActive && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            <button
                                type="button"
                                onClick={onProof}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105 min-h-9"
                                style={{ background: 'var(--stem-primary)' }}
                            >
                                <Camera className="w-3 h-3" /> Submit Proof
                            </button>
                            <button
                                type="button"
                                onClick={onComplete}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 min-h-9"
                                style={{ background: 'var(--stem-light)', color: 'var(--stem-primary)' }}
                            >
                                <CheckCircle2 className="w-3 h-3" /> Complete
                            </button>
                            <button
                                type="button"
                                onClick={onFail}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 min-h-9"
                                style={{ background: 'var(--weed-light)', color: 'var(--weed-primary)' }}
                            >
                                <XCircle className="w-3 h-3" /> Fail
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ============ CREATE TASK MODAL ============
function CreateTaskModal({ onClose, onSubmit, balance }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('stem');
    const [deadline, setDeadline] = useState('');
    const [stakeAmount, setStakeAmount] = useState(0);

    const handleCreate = () => {
        if (!title.trim()) return;
        onSubmit({
            title: title.trim(),
            description: description.trim(),
            category,
            deadline: deadline || null,
            stakeAmount,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-5"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-md rounded-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
                style={{
                    background: 'var(--aura-surface)',
                    boxShadow: 'var(--shadow-lg)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3 mb-6">
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>New Task</h3>
                    <button type="button" onClick={onClose} className="aura-icon-btn rounded-xl shrink-0" style={{ color: 'var(--aura-text-muted)' }} aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--aura-text-secondary)' }}>
                            Task Title *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Study SAT Math for 2 hours"
                            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                            style={{
                                background: 'var(--aura-bg-secondary)',
                                border: '1px solid var(--aura-border)',
                                color: 'var(--aura-text)',
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--aura-text-secondary)' }}>
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What do you need to do?"
                            rows={2}
                            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                            style={{
                                background: 'var(--aura-bg-secondary)',
                                border: '1px solid var(--aura-border)',
                                color: 'var(--aura-text)',
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--aura-text-secondary)' }}>
                            Garden Zone
                        </label>
                        <div className="flex gap-2 sm:gap-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    type="button"
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 min-h-11 rounded-xl text-xs font-medium transition-all duration-200"
                                    style={{
                                        background: category === cat.id ? cat.light : 'var(--aura-bg-secondary)',
                                        border: `2px solid ${category === cat.id ? cat.color : 'var(--aura-border)'}`,
                                        color: category === cat.id ? cat.color : 'var(--aura-text-muted)',
                                    }}
                                >
                                    {cat.emoji} {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--aura-text-secondary)' }}>
                            Deadline
                        </label>
                        <input
                            id="task-deadline"
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                            style={{
                                background: 'var(--aura-bg-secondary)',
                                border: '1px solid var(--aura-border)',
                                color: 'var(--aura-text)',
                            }}
                        />
                    </div>

                    {/* Stake */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--aura-text-secondary)' }}>
                            Stake ({balance} tokens available)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[0, 5, 10, 25, 50].map(amount => (
                                <button
                                    type="button"
                                    key={amount}
                                    onClick={() => setStakeAmount(amount)}
                                    disabled={amount > balance}
                                    className="flex-1 min-w-[3.25rem] py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-30"
                                    style={{
                                        background: stakeAmount === amount ? 'var(--accent-gold)' : 'var(--aura-bg-secondary)',
                                        color: stakeAmount === amount ? '#fff' : 'var(--aura-text-muted)',
                                        border: `1px solid ${stakeAmount === amount ? 'var(--accent-gold)' : 'var(--aura-border)'}`,
                                    }}
                                >
                                    {amount === 0 ? 'Free' : `🪙${amount}`}
                                </button>
                            ))}
                        </div>
                        {stakeAmount > 0 && (
                            <p className="aura-micro mt-1.5" style={{ color: 'var(--stem-primary)' }}>
                                ✨ Potential reward: {calculateReward(stakeAmount, 0)} tokens
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        id="task-create"
                        onClick={handleCreate}
                        disabled={!title.trim()}
                        className="w-full min-h-11 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: 'var(--accent-gradient)' }}
                    >
                        Plant This Seed 🌱
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ============ PROOF MODAL ============
function ProofModal({ task, onClose, onSubmit }) {
    const challenge = generateProofChallenge(task.category);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-5"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-sm rounded-2xl p-5 sm:p-6"
                style={{ background: 'var(--aura-surface)', boxShadow: 'var(--shadow-lg)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3 mb-5">
                    <h3 className="font-bold" style={{ fontFamily: 'Outfit' }}>📸 Proof Challenge</h3>
                    <button type="button" onClick={onClose} className="aura-icon-btn rounded-xl shrink-0" style={{ color: 'var(--aura-text-muted)' }} aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                {/* Challenge description */}
                <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--bud-light)', border: '1px solid var(--bud-primary)' }}>
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--bud-primary)' }}>
                        {challenge.challenge}
                    </p>
                    <div className="mt-3 space-y-1.5">
                        {challenge.requirements.map((req, i) => (
                            <p key={i} className="text-xs flex items-center gap-1" style={{ color: 'var(--aura-text-secondary)' }}>
                                ✅ {req}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'var(--weed-light)' }}>
                    <Timer className="w-4 h-4" style={{ color: 'var(--weed-primary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--weed-primary)' }}>
                        5:00 minutes to submit proof
                    </span>
                </div>

                {/* Photo upload */}
                <div>
                    {photoPreview ? (
                        <div className="relative rounded-xl overflow-hidden">
                            <img src={photoPreview} alt="Proof" className="w-full h-48 object-cover" />
                            <button
                                type="button"
                                onClick={() => setPhotoPreview(null)}
                                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
                                aria-label="Remove photo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label
                            className="flex flex-col items-center justify-center h-40 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                border: '2px dashed var(--aura-border-strong)',
                                background: 'var(--aura-bg-secondary)',
                            }}
                        >
                            <Camera className="w-8 h-8 mb-2" style={{ color: 'var(--aura-text-muted)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--aura-text-muted)' }}>
                                Tap to upload photo
                            </span>
                            <input
                                id="proof-photo"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <button
                    type="button"
                    id="proof-submit"
                    onClick={() => onSubmit(photoPreview)}
                    disabled={!photoPreview}
                    className="w-full min-h-11 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                    style={{ background: 'var(--accent-gradient)' }}
                >
                    Submit Proof 📸
                </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
