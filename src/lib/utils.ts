import { TotalItem } from '@/api/hooks/pamm/type';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
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

type TransformedItem = {
  amount: string;
  currency: string;
};

type TransformedData = Array<{
  commissionToatl?: TransformedItem[];
  businessAmountToatl?: TransformedItem[];
  rewardAmountToatl?: TransformedItem[];
}>;

/**
 * 数据格式处理
 */
export const transformTotalList = (
  data: TotalItem[] | undefined,
  fileds: Array<'commissionToatl' | 'businessAmountToatl' | 'rewardAmountToatl'>,
): TransformedData => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const result: TransformedData = [];

  fileds.forEach(field => {
    const fieldData: TransformedItem[] = [];

    data.forEach(item => {
      const value = item[field];
      if (value !== null) {
        fieldData.push({
          amount: String(value),
          currency: item.currency,
        });
      }
    });

    if (fieldData.length > 0) {
      result.push({
        [field]: fieldData,
      });
    }
  });

  return result;
};

export const formatDate = (date?: Date | string, format = 'YYYY-MM-DD') => {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
};

export const percentageFormat = (value: number) => {
  return (value >= 0 ? '+' : '') + (value * 100).toFixed(0) + '%';
};

export const getCssVar = (name: string, fallback: string) => {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v && v.trim() ? v.trim() : fallback;
  } catch {
    return fallback;
  }
};
