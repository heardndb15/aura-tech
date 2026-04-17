import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Sprout,
    Zap,
    Shield,
    Compass,
    ArrowRight,
    Play,
    Sparkles,
    CheckCircle2,
    Gamepad2,
    Waves,
    Flame,
    Smartphone,
    Layers,
    HeartPulse
} from 'lucide-react';
import './Landing.css';

const FeatureCard = ({ icon: Icon, title, description, delay = 0, color = 'emerald' }) => {
    const colorMap = {
        emerald: 'from-emerald-400/20 to-emerald-600/10 border-emerald-500/20',
        blue: 'from-blue-400/20 to-indigo-600/10 border-blue-500/20',
        purple: 'from-purple-400/20 to-fuchsia-600/10 border-purple-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            whileHover={{ y: -5 }}
            className={`p-8 rounded-[32px] glass-morphism border ${colorMap[color]} relative overflow-hidden group`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${colorMap[color]}`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 italic tracking-tight uppercase" style={{ fontFamily: 'Outfit' }}>{title}</h3>
            <p className="text-white/60 leading-relaxed font-medium">{description}</p>
        </motion.div>
    );
};

export default function LandingPage({ onStart }) {
    const { scrollY } = useScroll();
    const islandY = useTransform(scrollY, [0, 500], [0, -100]);
    const islandScale = useTransform(scrollY, [0, 500], [1, 1.1]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="min-h-screen bg-[#070d09] text-white selection:bg-emerald-500 selection:text-white overflow-hidden">
            {/* Ambient Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="firefly-particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Clouds */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="cloud-layer top-[10%] left-[-10%] w-[120%] h-[40%] bg-emerald-500/5 rotate-[-5deg]" />
                <div className="cloud-layer bottom-[10%] right-[-10%] w-[120%] h-[40%] bg-blue-500/5 rotate-[5deg]" />
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
                <motion.div
                    style={{ y: islandY, scale: islandScale }}
                    className="absolute top-[20%] w-full max-w-4xl opacity-40 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                >
                    <img src="/aura_hero.png" alt="Aura Island" className="w-full h-auto animate-float mask-gradient" />
                </motion.div>

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="aura-micro font-black uppercase tracking-[0.2em] text-emerald-400">Геймификация саморазвития</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.95] drop-shadow-2xl"
                        style={{ fontFamily: 'Outfit' }}
                    >
                        РАСТИ НАД СОБОЙ, <br />
                        <span className="text-gradient">УКРАШАЯ СВОЙ</span> <br />
                        ВНУТРЕННИЙ МИР
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-[1.6]"
                    >
                        Преврати свою жизнь в захватывающее RPG-приключение.
                        Выполняй квесты, побеждай страхи и наблюдай за ростом своего острова ментального здоровья.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            type="button"
                            onClick={onStart}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 sm:px-10 py-4 sm:py-5 min-h-14 rounded-[24px] text-white font-black text-base sm:text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all group inline-flex items-center justify-center gap-3 w-full sm:w-auto"
                        >
                            НАЧАТЬ ПРИКЛЮЧЕНИЕ
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button type="button" className="px-8 sm:px-10 py-4 sm:py-5 min-h-14 rounded-[24px] bg-white/5 border border-white/10 text-white font-black text-base sm:text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center gap-3 w-full sm:w-auto">
                            <Play className="w-5 h-5 fill-white" />
                            СМОТРЕТЬ ДЕМО
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 animate-bounce text-white/20"
                >
                    <Waves className="w-6 h-6" />
                </motion.div>
            </section>

            {/* 2. CONCEPT SECTION */}
            <section className="py-32 px-6 container mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black italic mb-8 leading-[0.9] uppercase" style={{ fontFamily: 'Outfit' }}>
                            AURA — ЭТО НЕ ПРОСТО <br /> ТРЕКЕР ПРИВЫЧЕК
                        </h2>
                        <div className="space-y-12">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Sprout className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2 italic">ТВОИ ДЕЙСТВИЯ = РОСТ ОСТРОВА</h4>
                                    <p className="text-white/40 font-medium">Каждая выполненная задача буквально меняет ландшафт твоего сада.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <Layers className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2 italic">ТВОИ ЭМОЦИИ = СИЛА КОРНЕЙ</h4>
                                    <p className="text-white/40 font-medium">Система Mood Check-in питает корни твоего острова, делая его устойчивым.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Zap className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2 italic">ДИСЦИПЛИНА = ВАЛЮТА</h4>
                                    <p className="text-white/40 font-medium">Стабильность вознаграждается Гемами, которые оживляют твое пространство.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-square glass-morphism rounded-[64px] relative overflow-hidden flex items-center justify-center border-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                        >
                            <img src="/aura_hero.png" alt="Visual" className="w-[80%] h-auto animate-float" />
                        </motion.div>
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-10 w-32 h-32 glass-morphism rounded-3xl p-6 border-white/10 text-center"
                        >
                            <span className="text-4xl block mb-2">🏮</span>
                            <span className="aura-micro font-black uppercase text-emerald-400">+10 XP</span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURE GRID */}
            <section className="py-32 px-6 container mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={Compass}
                        title="ЖИВОЙ ОСТРОВ"
                        description="Наблюдай за 3D-визуализацией своего прогресса. Каждый уровень открывает новые зоны и декорации."
                        delay={0.1}
                        color="emerald"
                    />
                    <FeatureCard
                        icon={Flame}
                        title="SLAYER MODE"
                        description="Твои страхи — это сорняки. Вступай в битву с внутренними барьерами и очищай свой сад."
                        delay={0.2}
                        color="purple"
                    />
                    <FeatureCard
                        icon={Gamepad2}
                        title="КВЕСТЫ И ГЕМЫ"
                        description="Геймифицируй дисциплину. Получай редкие артефакты за непрерывную серию побед."
                        delay={0.3}
                        color="blue"
                    />
                    <FeatureCard
                        icon={HeartPulse}
                        title="ЗЕРКАЛО ДУШИ"
                        description="Отслеживай эмоциональный уровень «корней». Находи баланс в ежедневных практиках."
                        delay={0.4}
                        color="emerald"
                    />
                </div>
            </section>

            {/* 4. SLAYER PREVIEW */}
            <section className="py-32 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
                <div className="container mx-auto max-w-5xl glass-morphism p-12 rounded-[64px] border-purple-500/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                        <Shield className="w-64 h-64 text-purple-400" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black italic mb-8 uppercase tracking-tighter" style={{ fontFamily: 'Outfit' }}>SLAYER MODE</h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto italic">Путь к гармонии лежит через победу над тенями внутри себя. Сделай первый шаг навстречу смелости.</p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="px-8 py-4 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-black italic">
                                ⚔️ БИТВА С ПРОКРАСТИНАЦИЕЙ
                            </div>
                            <div className="px-8 py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black italic">
                                🔥 РОСТ УВЕРЕННОСТИ
                            </div>
                            <div className="px-8 py-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-black italic">
                                🛡️ ЗАЩИТА ГРАНИЦ
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-32 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-6xl md:text-8xl font-black italic mb-12 uppercase leading-[1]" style={{ fontFamily: 'Outfit' }}>
                        ГОТОВ ПОСАДИТЬ <br /> <span className="text-gradient">СВОЕ ПЕРВОЕ СЕМЯ?</span>
                    </h2>
                    <button
                        onClick={onStart}
                        className="relative group bg-white text-black px-16 py-8 rounded-[32px] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_40px_80px_rgba(255,255,255,0.1)]"
                    >
                        НАЧАТЬ ПРИКЛЮЧЕНИЕ
                        <div className="absolute inset-x-0 bottom-[-20px] h-[40px] bg-emerald-400/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="mt-16 flex items-center justify-center gap-12 text-white/30 uppercase font-black tracking-widest text-[11px]">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" /> IOS & ANDROID
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" /> 60FPS UI
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> NO ADS
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-white/5 opacity-40">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500" />
                        <span className="text-xl font-black italic" style={{ fontFamily: 'Outfit' }}>AURA</span>
                    </div>
                    <p className="text-[11px] font-medium tracking-widest uppercase">© 2026 Aura Tech. Powered by Magic & Discipline.</p>
                </div>
            </footer>
        </div>
    );
}
