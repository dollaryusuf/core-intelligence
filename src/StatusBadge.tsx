/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { cn } from './lib/utils';

interface StatusBadgeProps {
  label: string;
  tone: 'danger' | 'accent' | 'amber';
}

const TONE_CLASSES: Record<StatusBadgeProps['tone'], string> = {
  danger: 'text-danger bg-danger/10 border-danger/30',
  accent: 'text-accent bg-accent/10 border-accent/30',
  amber: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

/** "At-a-Glance" plain-English status badge — e.g. [ OVERHEATED ], [ OUTPERFORMING ], [ INSTITUTIONAL EXIT ]. */
export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border',
      TONE_CLASSES[tone]
    )}>
      [ {label} ]
    </span>
  );
}
