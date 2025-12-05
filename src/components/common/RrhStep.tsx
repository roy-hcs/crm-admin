import { cn } from '@/lib/utils';

export type RrhStepProps = {
  steps: {
    label: string;
    status: 'complete' | 'pending' | 'error';
    content: React.ReactNode;
  }[];
};

export const RrhStep = ({
  steps,
}: {
  steps: {
    label: string;
    status: 'complete' | 'pending' | 'error';
    content: React.ReactNode;
  }[];
}) => {
  const isOnlyOneStep = steps.length === 1;
  return (
    <div>
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={cn('relative border-l pb-7 pl-4 text-sm', {
            'border-emerald-600': step.status === 'complete' && !isOnlyOneStep,
            'border-border': step.status === 'pending' || isOnlyOneStep,
            'border-red-600': step.status === 'error',
            'border-l-0': steps.length > 1 && index === steps.length - 1,
          })}
        >
          <div
            className={cn('absolute -top-0 -left-1.5 size-3 rounded-full', {
              'bg-emerald-600': step.status === 'complete',
              'bg-border': step.status === 'pending',
              'bg-red-600': step.status === 'error',
            })}
          ></div>
          <div>{step.label}</div>
          <div className="text-muted-foreground">{step.content}</div>
        </div>
      ))}
    </div>
  );
};
