import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateGardenHealth, formatTokens, getStreakLabel, distributeLostStake } from '../../utils/economy';
import {
    User, Coins, TrendingUp, TrendingDown, ArrowUpRight,
    ArrowDownRight, Flame, Award, Calendar, Target, Lock
} from 'lucide-react';

export default function ProfileView({ setActiveTab }) {
    const { user } = useAuth();
    const { garden, wallet, tasks, moods, fears } = useApp();
    const { theme } = useTheme();
    const health = calculateGardenHealth(garden);

    const stats = {
        totalTasks: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        failed: tasks.filter(t => t.status === 'failed').length,
        fearsConquered: fears.filter(f => f.status === 'conquered').length,
        moodEntries: moods.length,
        successRate: tasks.length > 0
            ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
            : 0,
    };

    return (
        <div className="aura-view stagger-children">
            {/* Character Header */}
            <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white min-h-[160px] flex items-center"
                style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-glow)' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 text-9xl">🌿</div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="w-24 h-24 rounded-[30%] flex items-center justify-center text-4xl font-black bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-2xl"
                    >
                        {user?.displayName?.[0] || '🌱'}
                    </motion.div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-3xl font-black italic tracking-tight" style={{ fontFamily: 'Outfit' }}>
                                {user?.displayName || 'Legendary Gardener'}
                            </h2>
                            <div className="bg-white/20 px-2 py-0.5 rounded-md aura-micro font-black uppercase tracking-widest border border-white/30 truncate">
                                RANK: {health > 80 ? 'Nature Spirit' : health > 50 ? 'Master' : 'Novice'}
                            </div>
                        </div>
                        <p className="text-sm opacity-80 font-medium mb-3">
                            {user?.email}
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                                <Award className="w-4 h-4 text-yellow-300" />
                                <span className="text-xs font-black">{health}% VITALITY</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span className="text-xs font-black">{stats.completed} QUESTS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                    { label: 'Victory Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'var(--bud-primary)', bg: 'var(--bud-light)' },
                    { label: 'Fears Vanquished', value: stats.fearsConquered, icon: Flame, color: 'var(--weed-primary)', bg: 'var(--weed-light)' },
                    { label: 'Mental Clarity', value: stats.moodEntries, icon: Calendar, color: 'var(--root-primary)', bg: 'var(--root-light)' },
                    { label: 'Current Streak', value: getStreakLabel(garden.stems.streak), icon: Award, color: 'var(--stem-primary)', bg: 'var(--stem-light)' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl p-4 sm:p-5 card-game"
                            style={{
                                background: 'var(--aura-surface)',
                            }}
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: stat.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black" style={{ color: 'var(--aura-text)' }}>{stat.value}</p>
                                    <p className="aura-micro font-bold uppercase tracking-wider opacity-60">{stat.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Wallet Section */}
            <div className="rounded-3xl p-5 sm:p-6 relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #1a2e05 0%, #2e5038 100%)',
                boxShadow: 'var(--shadow-lg)',
            }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -right-4 -bottom-4 text-8xl">💰</div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                                <Coins className="w-4 h-4 text-yellow-900" />
                            </div>
                            <span className="text-sm text-white/70 font-black uppercase tracking-widest">Vault Balance</span>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-full aura-micro font-bold text-white border border-white/10">
                            GEM ECONOMY
                        </div>
                    </div>

                    <p className="text-5xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: 'Outfit' }}>
                        {formatTokens(wallet.balance)} <span className="text-xl opacity-50 underline decoration-yellow-400">GEMS</span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { label: 'LOOTED', value: wallet.totalEarned, icon: ArrowUpRight, color: '#4ade80' },
                            { label: 'STAKED', value: wallet.totalStaked, icon: Target, color: '#fbbf24' },
                            { label: 'LOSSES', value: wallet.totalLost, icon: ArrowDownRight, color: '#f87171' },
                        ].map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="rounded-xl p-3 sm:p-4 bg-white/5 border border-white/5 backdrop-blur-sm">
                                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                        <Icon className="w-3 h-3" style={{ color: item.color }} />
                                        <span className="aura-micro font-black text-white uppercase tracking-tighter">{item.label}</span>
                                    </div>
                                    <p className="text-lg font-black text-white">{item.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="aura-subsection">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--aura-text-secondary)', fontFamily: 'Outfit' }}>
                💰 Transaction History
            </h3>
            <div className="space-y-3">
                {wallet.history.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-xs" style={{ color: 'var(--aura-text-muted)' }}>
                            No transactions yet. Start completing tasks!
                        </p>
                    </div>
                ) : (
                    wallet.history.slice(0, 10).map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4"
                            style={{
                                background: 'var(--aura-surface)',
                                border: '1px solid var(--aura-border)',
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: tx.amount > 0 ? 'var(--stem-light)' : 'var(--weed-light)',
                                }}
                            >
                                {tx.amount > 0 ? (
                                    <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--stem-primary)' }} />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" style={{ color: 'var(--weed-primary)' }} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate" style={{ color: 'var(--aura-text)' }}>
                                    {tx.description}
                                </p>
                                <p className="aura-micro" style={{ color: 'var(--aura-text-muted)' }}>
                                    {new Date(tx.date).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="text-sm font-bold" style={{
                                color: tx.amount > 0 ? 'var(--stem-primary)' : 'var(--weed-primary)',
                            }}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Hidden Verification Access */}
            <div className="mt-12 flex justify-center pb-8">
                <button 
                  onClick={() => setActiveTab('verification')}
                  className="opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-mono text-white tracking-widest"
                >
                    <Lock className="w-3 h-3" />
                    DEVKIT // VERIFICATION
                </button>
            </div>
        </div>
    );
}
