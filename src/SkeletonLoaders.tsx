/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { cn } from '../lib/utils';

export function SkeletonChart({ height, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      style={height ? { height } : undefined}
      className={cn(
        "w-full min-w-0 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden relative transform-gpu",
        !height && "h-[250px] md:h-[300px]",
        className
      )}
    >
      <div className="absolute inset-0 flex items-end gap-2 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-white/5 rounded-t animate-pulse"
            style={{ height: `${20 + ((i * 13) % 60)}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={cn("p-4 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse", className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="h-2.5 w-32 bg-white/10 rounded" />
        <div className="h-2.5 w-16 bg-white/10 rounded" />
      </div>
      <div className="flex justify-between items-end">
        <div className="h-5 w-20 bg-white/10 rounded" />
        <div className="h-2.5 w-24 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={cn("bg-white/10 rounded animate-pulse", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
      <SkeletonBlock className="h-3 w-40" />
      <SkeletonBlock className="h-10 w-24" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-3/4" />
    </div>
  );
}
