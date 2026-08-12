"use client"

import { motion, type Variants } from "framer-motion"
import { type ReactNode } from "react"

// M3 Motion: decelerate 进入 / accelerate 退出 / standard 交互
const EASE_DECELERATE: [number, number, number, number] = [0, 0, 0.2, 1]
const EASE_ACCELERATE: [number, number, number, number] = [0.4, 0, 1, 1]
const EASE_STANDARD: [number, number, number, number] = [0.2, 0, 0, 1]

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_DECELERATE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_ACCELERATE } },
}

const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: EASE_STANDARD } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_ACCELERATE } },
}

const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: EASE_DECELERATE } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: EASE_ACCELERATE } },
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={scaleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export const cardHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: EASE_STANDARD } },
  whileTap: { scale: 0.98 },
}

export const buttonTap = {
  whileTap: { scale: 0.95 },
}

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_DECELERATE } },
}
