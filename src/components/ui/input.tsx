import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  wrapperClassName?: string;
}

// 支持左右图标与点击事件的 Input 组件（向后兼容：无图标时行为不变）
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      onLeftIconClick,
      onRightIconClick,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const hasLeft = !!leftIcon;
    const hasRight = !!rightIcon;

    const inputElement = (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          hasLeft && 'pl-8',
          hasRight && 'pr-8',
          className,
        )}
        {...props}
      />
    );

    if (!hasLeft && !hasRight) return inputElement;

    return (
      <div className={cn('relative flex items-center', wrapperClassName)}>
        {hasLeft && (
          <span
            className={cn(
              'text-muted-foreground absolute left-2 inline-flex items-center justify-center',
              onLeftIconClick && 'hover:text-foreground cursor-pointer',
            )}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </span>
        )}
        {inputElement}
        {hasRight && (
          <span
            className={cn(
              'text-muted-foreground absolute right-2 inline-flex items-center justify-center',
              onRightIconClick && 'hover:text-foreground cursor-pointer',
            )}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
