import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

type RrhLeverProps = {
  level?: 'low' | 'medium' | 'high' | null;
  text: string;
  className?: string;
};

const leverClassMap = {
  low: {
    border: 'border-blue-600',
    text: 'text-blue-600',
  },
  medium: {
    border: 'border-amber-500',
    text: 'text-amber-500',
  },
  high: {
    border: 'border-red-500',
    text: 'text-red-500',
  },
};

export function RrhLever({ level, text = '-', className }: RrhLeverProps) {
  if (!level || !leverClassMap[level]) {
    return <div className={cn('text-xs leading-4 font-medium', className)}>{text}</div>;
  }

  const levelStyle = leverClassMap[level];

  return (
    <div className={cn('inline-block', className)}>
      <div
        className={cn(
          'bg-background flex items-center justify-center gap-1 rounded-2xl border px-2 py-0.5',
          levelStyle.border,
        )}
      >
        <CircleCheck className={cn('size-2.5', levelStyle.text)} />
        <div className={cn('text-xs leading-4 font-medium', levelStyle.text)}>{text}</div>
      </div>
    </div>
  );
}
