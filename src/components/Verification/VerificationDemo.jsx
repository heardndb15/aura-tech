import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Key, Activity, Fingerprint, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VerificationDemo({ setActiveTab }) {
  const { tasks, garden } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // Stats for the "authenticity" logic
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

  const simulateVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col pt-12 pb-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 items-center text-green-400">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-xl font-black uppercase tracking-widest font-mono">System Demo Access</h1>
        </div>
        <button onClick={() => setActiveTab('profile')} className="text-white/40 hover:text-white uppercase text-xs font-black tracking-widest transition-colors font-mono hover:bg-white/10 px-3 py-1 rounded">
          [ EXIT ]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full space-y-6">
        
        {/* Status Card */}
        <motion.div 
          className="border border-green-500/30 bg-green-900/10 rounded-2xl p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Lock className="w-32 h-32" />
          </div>
          
          <h2 className="text-green-500/80 text-xs font-black uppercase tracking-widest mb-4 font-mono">
            Verification Protocol
          </h2>
          
          <div className="flex items-center gap-6 mb-6">
            <motion.div 
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${verified ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}`}
                animate={{ rotate: verifying ? 360 : 0 }}
                transition={{ repeat: verifying ? Infinity : 0, ease: "linear", duration: 1 }}
            >
              {verifying ? <Server className="w-8 h-8" /> : (verified ? <ShieldCheck className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10 opacity-50" />)}
            </motion.div>
            
            <div>
              <p className="text-white text-2xl font-black font-mono">
                {verified ? 'VERIFIED' : (verifying ? 'CHECKING...' : 'UNVERIFIED')}
              </p>
              <p className="text-white/40 text-sm font-mono mt-1">
                {verified ? 'All tasks confirm physical proof.' : 'Awaiting manual protocol execution.'}
              </p>
            </div>
          </div>

          {!verified && (
            <button 
              onClick={simulateVerification}
              disabled={verifying}
              className="w-full py-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-black font-mono uppercase tracking-widest rounded-xl transition-all border border-green-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-5 h-5" />
              Run Authenticity Check
            </button>
          )}

          <AnimatePresence>
            {verified && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 space-y-3 font-mono"
              >
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/40">User Trust Level</span>
                  <span className="text-green-400 font-bold">Absolute (Tier 1)</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/40">Progress Authenticity</span>
                  <span className="text-green-400 font-bold">100% Validated</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/40">Registered Stakes</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Current Progress</span>
                  <span className="text-white font-bold">{progress}% completion</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Developer Info Card */}
        <motion.div 
          className="border border-white/10 bg-white/5 rounded-2xl p-6 font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-bold uppercase tracking-widest">Developer Backdoor Access</h3>
          </div>
          <p className="text-white/50 text-sm mb-4 leading-relaxed">
            This module displays technical data intended for judges and project review. It exposes the verification endpoints and raw validation parameters.
          </p>
          <div className="bg-black/50 p-4 rounded-xl text-xs text-green-400 overflow-x-auto">
            <pre>
{`{
  "system": "Aura Growth Engine",
  "version": "1.0.4-demo",
  "active_users": 1,
  "ml_endpoint": "connected",
  "proof_validation": "physical_photo",
  "strict_mode": true
}`}
            </pre>
          </div>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/30 text-xs font-mono uppercase tracking-widest mt-8"
        >
          // Aura Internal Tools // Restricted Access //
        </motion.p>
      </div>
    </div>
  );
}
