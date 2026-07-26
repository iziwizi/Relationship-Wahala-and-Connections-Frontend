"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
}

/**
 * Reveals children with a fade-up entrance animation on scroll.
 * Respects prefers-reduced-motion.
 */
export function FadeUp({ children, delay = 0, className, amount = 0.2 }: FadeUpProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Simple fade-in on scroll.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Wraps children as a stagger container — use with StaggerItem.
 */
export function Stagger({ children, className, staggerDelay = 0.1 }: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={
        reduce
          ? {}
          : {
              hidden: {},
              visible: { transition: { staggerChildren: staggerDelay } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual item inside a Stagger container.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? {}
          : {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
            }
      }
    >
      {children}
    </motion.div>
  );
}
