/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  /** Milliseconds per character. Kept fast so a full report doesn't take forever to read. */
  speedMs?: number;
  className?: string;
}

/**
 * Reveals `text` character-by-character to simulate a report being
 * "transmitted" in real time. Resets and re-runs whenever `text` changes
 * (e.g. a fresh Generate Analysis click produces a new report).
 */
export function TypewriterText({ text, speedMs = 12, className }: TypewriterTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    if (!text) return;
    const id = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  const isDone = visibleChars >= text.length;

  return (
    <span className={className}>
      {text.slice(0, visibleChars)}
      {!isDone && <span className="inline-block w-[6px] h-[12px] bg-accent/70 ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}
