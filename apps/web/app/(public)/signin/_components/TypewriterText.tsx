"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypewriterText({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseTime = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTyping = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        setDisplayText(prev => prev + currentPhrase.charAt(displayText.length));
      } else {
        setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(prev => prev.slice(0, -1));
      } else {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, isDeleting, phraseIndex, phrases, pauseTime]);

  useEffect(() => {
    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, handleTyping, deletingSpeed, typingSpeed]);

  return (
    <div className="flex min-h-[32px] items-center justify-center space-x-[2px] overflow-hidden text-center">
      <span className="text-lg tracking-wide text-[var(--zayon-text-muted)] dark:text-[var(--zayon-text-secondary)] xl:text-xl">
        {displayText}
      </span>
      <motion.div
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className="mb-[2px] h-[20px] w-[2px] bg-[var(--zayon-text-muted)] dark:bg-[var(--zayon-text-secondary)]"
      />
    </div>
  );
}
