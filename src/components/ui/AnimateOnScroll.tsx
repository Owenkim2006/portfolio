'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 18, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
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

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate={hasAnimated.current ? 'animate' : 'initial'}
      transition={{ delay }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
