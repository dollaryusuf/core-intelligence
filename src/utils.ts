import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard Tailwind classname merge helper. Every component in this project
 * imports `cn` from here — this file was missing from the upload set, so
 * it's reconstructed as the conventional shadcn/ui-style implementation.
 * If your original had extra logic beyond clsx + tailwind-merge, restore
 * that here.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
