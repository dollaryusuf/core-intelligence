/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  /** Plain-English explanation shown in the popover. */
  children: string;
  /** Optional alignment of the popover relative to the icon. Defaults to left-aligned. */
  align?: 'left' | 'right';
}

/**
 * The "Institutional Translator" — a small (?) icon that reveals a plain-
 * English explanation of a technical term on hover (desktop) or tap
 * (mobile), without cluttering the terminal aesthetic when closed.
 */
export function InfoTooltip({ children, align = 'left' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="What does this mean?"
        className="w-3.5 h-3.5 rounded-full grid place-items-center text-muted/70 hover:text-accent border border-white/10 hover:border-accent/40 transition-colors shrink-0"
      >
        <HelpCircle size={9} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 z-50 w-56 p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <p className="text-[11px] leading-relaxed text-white/90 font-sans normal-case tracking-normal">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
