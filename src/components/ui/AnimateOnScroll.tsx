'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

// damping 1.0 / response 0.4, critically damped, no overshoot.
// Cards are scroll-revealed, not gesture-thrown, so bounce would feel wrong.
const CARD_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.4 }
const REDUCED_TRANSITION = { duration: 0.2 }

const FULL_VARIANTS = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

const REDUCED_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function AnimateOnScroll({ children, delay = 0, className }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const hasAnimated = useRef(false)
  if (isInView) hasAnimated.current = true
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      variants={prefersReduced ? REDUCED_VARIANTS : FULL_VARIANTS}
      initial="initial"
      animate={hasAnimated.current ? 'animate' : 'initial'}
      transition={prefersReduced ? REDUCED_TRANSITION : { ...CARD_SPRING, delay }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
