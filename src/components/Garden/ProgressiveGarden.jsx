import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressiveGarden({ progress }) {
    // Determine unlock stages based on progress
    const unlocks = {
        baseColor: progress >= 0, // maybe base color starts at 0% or stays gray until > 0
        flower: progress >= 10,
        bench: progress >= 25,
        tree: progress >= 40,
        fountain: progress >= 60,
        arch: progress >= 80,
        full: progress === 100,
    };

    // Helper to get color filter based on whether the element is colored or not
    const getStyle = (isUnlocked) => ({
        filter: isUnlocked ? 'grayscale(0%) saturate(1.2)' : 'grayscale(100%) opacity(0.5)',
        transition: 'all 1.5s ease-in-out',
    });

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto rounded-[40px] overflow-hidden" 
             style={{ 
                background: unlocks.full 
                    ? 'linear-gradient(135deg, #a7cc7c 0%, #86ab5d 100%)' 
                    : 'linear-gradient(135deg, #d3d3d3 0%, #b0b0b0 100%)',
                boxShadow: 'inset 0 10px 30px rgba(255,255,255,0.3)',
                transition: 'background 2s ease-in-out'
             }}>
            
            {/* The base ground (animated color change) */}
            <motion.div 
                className="absolute inset-0 opacity-40"
                style={{
                    background: unlocks.baseColor ? 'radial-gradient(circle at center, #fff 0%, transparent 70%)' : 'transparent',
                    opacity: progress > 0 ? (progress / 100) : 0,
                    transition: 'opacity 2s ease-in-out'
                }}
            />

            {/* Stage element: Flower (10%) */}
            <motion.div 
                className="absolute text-5xl z-10"
                style={{ bottom: '20%', left: '20%', ...getStyle(unlocks.flower) }}
                initial={{ scale: 0.8 }}
                animate={{ scale: unlocks.flower ? [0.8, 1.2, 1] : 0.8 }}
            >
                🌸
            </motion.div>

            {/* Stage element: Bench (25%) */}
            <motion.div 
                className="absolute text-6xl z-10"
                style={{ top: '40%', right: '15%', ...getStyle(unlocks.bench) }}
                initial={{ scale: 0.8 }}
                animate={{ scale: unlocks.bench ? [0.8, 1.1, 1] : 0.8 }}
            >
                🪑
            </motion.div>

            {/* Stage element: Tree (40%) */}
            <motion.div 
                className="absolute text-7xl z-20"
                style={{ top: '15%', left: '10%', ...getStyle(unlocks.tree) }}
                initial={{ scale: 0.8 }}
                animate={{ scale: unlocks.tree ? [0.8, 1.05, 1] : 0.8 }}
            >
                🌳
            </motion.div>

            {/* Stage element: Fountain (60%) */}
            <motion.div 
                className="absolute text-7xl z-20"
                style={{ bottom: '30%', right: '35%', ...getStyle(unlocks.fountain) }}
                initial={{ scale: 0.8 }}
                animate={{ scale: unlocks.fountain ? [0.8, 1.1, 1] : 0.8 }}
            >
                ⛲
            </motion.div>

            {/* Stage element: Decorative Arch (80%) */}
            <motion.div 
                className="absolute text-[5rem] z-30"
                style={{ top: '5%', right: '30%', ...getStyle(unlocks.arch) }}
                initial={{ scale: 0.8 }}
                animate={{ scale: unlocks.arch ? [0.8, 1.1, 1] : 0.8 }}
            >
                ⛩️
            </motion.div>

            {/* Stage element: Full Garden Vibes (100%) */}
            {unlocks.full && (
                <motion.div 
                    className="absolute inset-0 pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-xs"
                            initial={{
                                x: Math.random() * 300 + 20,
                                y: Math.random() * 300 + 20,
                                opacity: 0
                            }}
                            animate={{
                                y: [null, Math.random() * 300, Math.random() * 300],
                                opacity: [0, 0.8, 0]
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            ✨
                        </motion.div>
                    ))}
                </motion.div>
            )}
            
            {/* Overlay Progress text, subtle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <h1 className="text-white/20 text-6xl font-black blend-overlay" style={{ fontFamily: 'Outfit' }}>
                   {progress}%
                 </h1>
            </div>
        </div>
    );
}
