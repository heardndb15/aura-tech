import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { calculateGardenHealth, getStreakLabel, xpForLevel } from '../../utils/economy';
import { Sprout, Brain, Dumbbell, Heart, Skull, TrendingUp, Flame } from 'lucide-react';
import MoodCheckIn from './MoodCheckIn';
import ProgressiveGarden from './ProgressiveGarden';
import ShopModal from './ShopModal';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';


const ZONES = [
    {
        key: 'roots',
        label: 'Roots',
        subtitle: 'Mental Health',
        icon: Brain,
        color: 'var(--root-primary)',
        light: 'var(--root-light)',
        glow: 'var(--root-glow)',
        emoji: '🧘',
        description: 'Sleep, journaling, mindful habits',
    },
    {
        key: 'stems',
        label: 'Stems',
        subtitle: 'Skills & Growth',
        icon: TrendingUp,
        color: 'var(--stem-primary)',
        light: 'var(--stem-light)',
        glow: 'var(--stem-glow)',
        emoji: '📚',
        description: 'Study, sports, reading goals',
    },
    {
        key: 'buds',
        label: 'Buds',
        subtitle: 'Social Bonds',
        icon: Heart,
        color: 'var(--bud-primary)',
        light: 'var(--bud-light)',
        glow: 'var(--bud-glow)',
        emoji: '🤝',
        description: 'Volunteering, helping others',
    },
];

export default function GardenView({ setActiveTab }) {
    const { garden, tasks, fears, wallet } = useApp();
    const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const health = calculateGardenHealth(garden);

    const activeTasks = tasks.filter(t => t.status === 'active' || t.status === 'pending_proof').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeFears = fears.filter(f => f.status === 'active').length;
    const conqueredFears = fears.filter(f => f.status === 'conquered').length;

    // Calculate progress for the garden
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="pb-4 stagger-children">
            {/* Immersive Garden Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden mb-8 rounded-3xl"
                style={{
                    background: 'var(--accent-gradient)',
                    minHeight: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    boxShadow: 'var(--shadow-glow)',
                }}
            >
                {/* Visual Background Elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-10 left-10 text-4xl animate-float">☁️</div>
                    <div className="absolute top-20 right-20 text-5xl animate-float" style={{ animationDelay: '2s' }}>☁️</div>
                    <div className="absolute bottom-10 left-1/4 text-2xl animate-float" style={{ animationDelay: '4s' }}>✨</div>
                </div>

                {/* The Garden Island */}
                <div className="relative z-10 w-full mb-4">
                    <ProgressiveGarden progress={progress} />
                </div>

                <div className="z-10 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/40 mb-4 shadow-lg text-center">
                    <p className="text-xl font-bold text-white tracking-widest uppercase">Progress: {progress}%</p>
                </div>

                {/* Shop Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShop(true)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border border-white/20 z-20"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                >
                    💎
                </motion.button>

                {/* Garden Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent flex items-end justify-between text-white">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Overall Vitality</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-black" style={{ fontFamily: 'Outfit' }}>{health}%</h2>
                            <Sprout className="w-5 h-5 text-white/60 bounce" />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex gap-4 text-[10px] font-bold">
                            <span className="bg-white/20 px-2 py-1 rounded-lg">📋 {activeTasks} TASKS</span>
                            <span className="bg-white/20 px-2 py-1 rounded-lg">🪙 {wallet.balance} TOKENS</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Daily Check-in Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMoodCheckIn(true)}
                className="w-full rounded-xl p-4 mb-6 flex items-center gap-3 transition-all duration-200 btn-game"
                style={{
                    background: 'var(--aura-surface)',
                }}
            >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'var(--root-light)' }}>
                    🧘
                </div>
                <div className="text-left flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--aura-text)' }}>Daily Mood Check-in</p>
                    <p className="text-xs" style={{ color: 'var(--aura-text-muted)' }}>
                        {garden.roots.lastCheckIn
                            ? `Last check-in: ${new Date(garden.roots.lastCheckIn).toLocaleDateString()}`
                            : 'Start your reflection journey'}
                    </p>
                </div>
                <Flame className="w-5 h-5" style={{ color: 'var(--bud-primary)' }} />
            </motion.button>

            {/* Modals */}
            {showMoodCheckIn && <MoodCheckIn onClose={() => setShowMoodCheckIn(false)} />}
            <AnimatePresence>
                {showShop && <ShopModal onClose={() => setShowShop(false)} />}
            </AnimatePresence>

            {/* Garden Zones Grid */}
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--aura-text-secondary)', fontFamily: 'Outfit' }}>
                🌱 Your Garden Zones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {ZONES.map((zone, i) => {
                    const data = garden[zone.key];
                    const xpNeeded = xpForLevel(data.level);
                    const progress = Math.min((data.xp % 100) / 100 * 100, 100);
                    const Icon = zone.icon;

                    return (
                        <motion.div
                            key={zone.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-xl p-4 cursor-pointer transition-all duration-200 card-game"
                            style={{
                                background: 'var(--aura-surface)',
                            }}
                            onClick={() => setActiveTab('tasks')}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                                    style={{ background: zone.light }}
                                >
                                    {zone.emoji}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--aura-text)' }}>
                                        {zone.label}
                                    </p>
                                    <p className="text-[10px]" style={{ color: 'var(--aura-text-muted)' }}>
                                        {zone.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Level + XP */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold" style={{ color: zone.color }}>
                                    Lvl {data.level}
                                </span>
                                <span className="text-[10px]" style={{ color: 'var(--aura-text-muted)' }}>
                                    {data.xp % 100}/{100} XP
                                </span>
                            </div>

                            {/* XP Progress bar */}
                            <div className="w-full h-1.5 rounded-full mb-2"
                                style={{ background: zone.light }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                    className="h-full rounded-full"
                                    style={{ background: zone.color }}
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                <Flame className="w-3 h-3" style={{ color: zone.color }} />
                                <span className="text-[10px] font-medium" style={{ color: 'var(--aura-text-muted)' }}>
                                    {getStreakLabel(data.streak)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Weeds Section */}
            <motion.div
                className="rounded-xl p-4 cursor-pointer transition-all duration-200 card-game"
                style={{
                    background: 'var(--aura-surface)',
                }}
                onClick={() => setActiveTab('fears')}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: 'var(--weed-light)' }}>
                            🌾
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--aura-text)' }}>Weeds</p>
                            <p className="text-xs" style={{ color: 'var(--aura-text-muted)' }}>Face your fears</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: 'var(--weed-primary)' }}>{activeFears}</p>
                        <p className="text-[10px]" style={{ color: 'var(--aura-text-muted)' }}>
                            {conqueredFears} conquered
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
