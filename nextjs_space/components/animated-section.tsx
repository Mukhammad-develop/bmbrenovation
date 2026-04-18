'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  /** kept for backward-compat but all directions now resolve to a gentle fade+rise */
  direction?: 'up' | 'left' | 'right' | 'none'
}

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: AnimatedSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  /* 
   * Subtle reveal only — a soft opacity fade with a tiny vertical lift (12px).
   * No horizontal movement at all, so nothing feels like it's sliding in
   * from the sides. Content simply "breathes into existence."
   */
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'none' ? 0 : 12,
      scale: direction === 'none' ? 1 : 0.995,
      filter: 'blur(4px)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ 
        duration: 0.85, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94],  // gentle ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
