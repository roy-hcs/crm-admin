import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ToolTipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  maxWidth?: string;
};

export const ToolTip: React.FC<ToolTipProps> = ({
  children,
  content,
  delayDuration = 300,
  side = 'bottom',
  align = 'center',
  disabled = false,
  maxWidth = '300px',
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          style={{ maxWidth }}
          side={side}
          align={align}
          className="text-sm break-words whitespace-normal"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
