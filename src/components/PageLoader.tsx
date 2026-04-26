'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Glow */}
          <div className="absolute w-40 h-40 bg-[radial-gradient(circle,rgba(55,168,255,0.3),transparent_70%)] blur-[30px] animate-pulse" />

          {/* Orbit ring */}
          <div className="absolute w-32 h-32 border border-[#37a8ff]/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#37a8ff] shadow-[0_0_10px_rgba(55,168,255,0.6)]" />
          </div>

          {/* Second orbit */}
          <div className="absolute w-24 h-24 border border-[#37a8ff]/10 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#37a8ff]/60" />
          </div>

          {/* Logo */}
          <motion.img
            src="/nodez-logo.png"
            alt="NodeZ"
            className="relative w-16 h-16 drop-shadow-[0_0_30px_rgba(55,168,255,0.4)]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
