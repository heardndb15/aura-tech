import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sprout, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = () => {
        setEmail('demo@aura.app');
        setPassword('demo123');
        setIsLogin(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'var(--aura-bg)' }}>

            {/* Animated background orbs */}
            <div className="garden-bg" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-20 animate-float"
                style={{ background: 'radial-gradient(circle, var(--stem-primary), transparent 70%)' }} />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-15 animate-float"
                style={{ background: 'radial-gradient(circle, var(--root-primary), transparent 70%)', animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-glow)' }}
                    >
                        <Sprout className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Outfit' }}>
                        <span className="text-gradient">Aura</span>
                    </h1>
                    <p style={{ color: 'var(--aura-text-muted)' }} className="text-sm">
                        Your Digital Garden for Personal Growth
                    </p>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-lg)' }}>
                    {/* Toggle */}
                    <div className="flex rounded-xl p-1 mb-6"
                        style={{ background: 'var(--aura-bg-secondary)' }}>
                        {['Login', 'Sign Up'].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => { setIsLogin(i === 0); setError(''); }}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    background: (i === 0 ? isLogin : !isLogin) ? 'var(--aura-surface)' : 'transparent',
                                    color: (i === 0 ? isLogin : !isLogin) ? 'var(--aura-text)' : 'var(--aura-text-muted)',
                                    boxShadow: (i === 0 ? isLogin : !isLogin) ? 'var(--shadow-sm)' : 'none',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative mb-4">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                            style={{ color: 'var(--aura-text-muted)' }} />
                                        <input
                                            id="auth-name"
                                            type="text"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                            style={{
                                                background: 'var(--aura-bg-secondary)',
                                                border: '1px solid var(--aura-border)',
                                                color: 'var(--aura-text)',
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                style={{ color: 'var(--aura-text-muted)' }} />
                            <input
                                id="auth-email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--aura-bg-secondary)',
                                    border: '1px solid var(--aura-border)',
                                    color: 'var(--aura-text)',
                                }}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                style={{ color: 'var(--aura-text-muted)' }} />
                            <input
                                id="auth-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--aura-bg-secondary)',
                                    border: '1px solid var(--aura-border)',
                                    color: 'var(--aura-text)',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--aura-text-muted)' }}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm px-3 py-2 rounded-lg"
                                style={{ background: 'var(--weed-light)', color: 'var(--weed-primary)' }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            id="auth-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-glow)' }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Enter Your Garden' : 'Plant Your Garden'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo login hint */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={fillDemo}
                            className="text-xs transition-colors duration-200 hover:underline"
                            style={{ color: 'var(--stem-primary)' }}
                        >
                            Try demo account →
                        </button>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center text-xs mt-6" style={{ color: 'var(--aura-text-muted)' }}>
                    By continuing, you agree to Aura's Terms & Privacy Policy
                </p>
            </motion.div>
        </div>
    );
}
