import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function getDifficultyColor(difficulty: string): string {
  const colors = {
    EASY: 'bg-sky-400',
    MEDIUM: 'bg-blue-500',
    HARD: 'bg-purple-500',
    IMPOSSIBLE: 'bg-fuchsia-600',
  }
  return colors[difficulty as keyof typeof colors] || 'bg-gray-500'
}

export function getGradientColor(difficulty: string): string {
  const gradients = {
    EASY: '#38bdf8',
    MEDIUM: '#3b82f6',
    HARD: '#8b5cf6',
    IMPOSSIBLE: '#a855f7',
  }
  return gradients[difficulty as keyof typeof gradients] || '#f97316'
}
