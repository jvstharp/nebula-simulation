import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function trustColor(score: number): string {
  if (score >= 0.7) return '#22c55e';
  if (score >= 0.45) return '#f59e0b';
  return '#ef4444';
}

export function trustLabel(score: number): string {
  if (score >= 0.75) return 'Strong';
  if (score >= 0.55) return 'Neutral';
  if (score >= 0.35) return 'Strained';
  return 'Critical';
}
