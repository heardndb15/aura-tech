import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Heart, Sprout, Sparkles } from 'lucide-react';

const IslandPlot = ({ zone, data, active, onHover }) => {
    const isRoots = zone.key === 'roots';
    const isStems = zone.key === 'stems';
    const isBuds = zone.key === 'buds';

    // Different positions for each plot on the island
    const positions = {
        roots: { top: '30%', left: '20%' },
        stems: { top: '20%', left: '55%' },
        buds: { top: '55%', left: '40%' }
    };

    const plantIcons = {
        roots: '🧘',
        stems: '🌱',
        buds: '🌸'
    };

    return (
        <motion.div
            className="absolute cursor-pointer group"
            style={{ ...positions[zone.key] }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.5 }}
            onMouseEnter={() => onHover(zone.key)}
            onMouseLeave={() => onHover(null)}
        >
            {/* The Plot Base */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: zone.color }}
                />

                {/* The "Soil" or base of the plot */}
                <div className="w-16 h-8 bg-black/10 rounded-[100%] absolute bottom-2 blur-[2px]" />

                {/* The Plant/Icon */}
                <motion.div
                    animate={{
                        y: [0, -4, 0],
                        scale: active ? 1.2 : 1
                    }}
                    transition={{
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        scale: { type: 'spring', stiffness: 300 }
                    }}
                    className="text-4xl z-10 select-none"
                >
                    {plantIcons[zone.key]}
                </motion.div>

                {/* Level indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    <span className="aura-micro font-bold text-white whitespace-nowrap">Lvl {data.level}</span>
                </div>

                {/* Growth Glow */}
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <Sparkles className="w-full h-full text-white/40" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default function Island({ garden }) {
    const [hoveredZone, setHoveredZone] = React.useState(null);

    const zones = [
        {
            key: 'roots',
            label: 'Roots',
            color: 'var(--root-primary)',
            icon: Brain,
            emoji: '🧘'
        },
        {
            key: 'stems',
            label: 'Stems',
            color: 'var(--stem-primary)',
            icon: TrendingUp,
            emoji: '🌱'
        },
        {
            key: 'buds',
            label: 'Buds',
            color: 'var(--bud-primary)',
            icon: Heart,
            emoji: '🌸'
        }
    ];

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto mb-4 sm:mb-6 p-3 sm:p-4">
            {/* Water/Shadow underneath */}
            <div className="absolute top-[80%] left-1/4 right-1/4 h-12 bg-blue-400/10 blur-2xl rounded-[100%] z-0 animate-pulse" />

            {/* The Main Island Body */}
            <motion.div
                className="absolute inset-4 rounded-[40%_60%_70%_30%/50%_40%_60%_50%] overflow-hidden border-b-[12px] border-black/20"
                style={{
                    background: 'linear-gradient(180deg, #a7cc7c 0%, #86ab5d 60%, #5d4037 100%)',
                    boxShadow: 'inset 0 10px 30px rgba(255,255,255,0.3), 0 25px 50px -12px rgba(0,0,0,0.25)',
                }}
                animate={{
                    y: [0, -12, 0],
                    rotate: [0, 1.5, 0, -1.5, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Grass texture/detail */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-black rounded-full blur-3xl" />
                </div>

                {/* Decorative Flowers */}
                <div className="absolute top-[20%] left-[30%] aura-micro opacity-60">🌸</div>
                <div className="absolute top-[60%] right-[25%] aura-micro opacity-60">🌼</div>
                <div className="absolute bottom-[20%] left-[45%] aura-micro opacity-60">🌸</div>

                {/* Purchased Decorations */}
                {garden.decorations?.map((decor, i) => (
                    <motion.div
                        key={decor.id + i}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="absolute text-2xl z-20 pointer-events-auto filter drop-shadow-md"
                        style={{ top: decor.position.top, left: decor.position.left }}
                        whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                    >
                        {decor.emoji}
                    </motion.div>
                ))}
            </motion.div>

            {/* Floating Particles/Butterflies */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-[8px] z-20 pointer-events-none"
                    initial={{
                        x: Math.random() * 300 + 50,
                        y: Math.random() * 300 + 50,
                        opacity: 0
                    }}
                    animate={{
                        x: [null, Math.random() * 300, Math.random() * 300],
                        y: [null, Math.random() * 300, Math.random() * 300],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    ✨
                </motion.div>
            ))}

            {/* Island Plots */}
            <div className="absolute inset-0 z-10">
                {zones.map((zone) => {
                    const zoneData = garden?.[zone.key] || { level: 1, xp: 0 };
                    return (
                        <IslandPlot
                            key={zone.key}
                            zone={zone}
                            data={zoneData}
                            active={hoveredZone === zone.key}
                            onHover={setHoveredZone}
                        />
                    );
                })}
            </div>

            {/* Clouds */}
            <motion.div
                className="absolute -top-4 -right-8 text-4xl opacity-40 select-none pointer-events-none"
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 10, repeat: Infinity }}
            >
                ☁️
            </motion.div>
            <motion.div
                className="absolute top-12 -left-4 text-3xl opacity-30 select-none pointer-events-none"
                animate={{ x: [20, -20, 20] }}
                transition={{ duration: 12, repeat: Infinity }}
            >
                ☁️
            </motion.div>

            {/* Tooltip-like Info */}
            <AnimatePresence>
                {hoveredZone && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-xl min-w-[200px]"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{zones.find(z => z.key === hoveredZone).emoji}</span>
                            <span className="font-bold text-sm">{zones.find(z => z.key === hoveredZone).label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full"
                                style={{ background: zones.find(z => z.key === hoveredZone).color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(garden[hoveredZone].xp % 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="aura-micro text-muted-foreground">Lvl {garden[hoveredZone].level}</span>
                            <span className="aura-micro text-muted-foreground">{garden[hoveredZone].xp % 100}/100 XP</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
