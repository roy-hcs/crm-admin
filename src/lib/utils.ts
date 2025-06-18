import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateColorfulColor = (index: number) => {
  const colorPalette = [
    '#FF6384', // pink/red
    '#36A2EB', // blue
    '#FFCE56', // yellow
    '#4BC0C0', // teal
    '#9966FF', // purple
    '#FF9F40', // orange
    '#32CD32', // lime green
    '#BA55D3', // medium orchid
    '#20B2AA', // light sea green
    '#FF6347', // tomato
  ];

  if (index < colorPalette.length) {
    return colorPalette[index];
  }

  // Generate a random vibrant color if we're out of palette colors
  const h = Math.floor(Math.random() * 360); // hue (0-360)
  const s = Math.floor(70 + Math.random() * 30); // saturation (70-100%)
  const l = Math.floor(45 + Math.random() * 10); // lightness (45-55%)
  return `hsl(${h}, ${s}%, ${l}%)`;
};
