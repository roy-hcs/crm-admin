import * as React from 'react';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: (value: string) => void;
  onRightIconClick?: (value: string) => void;
  wrapperClassName?: string;
}

// 支持左右图标与点击事件的 Input 组件（向后兼容：无图标时行为不变）
const RrhInputWithIcon = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      onLeftIconClick,
      onRightIconClick,
      wrapperClassName,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const hasLeft = !!leftIcon;
    const hasRight = !!rightIcon;
    const inputRef = React.useRef<HTMLInputElement>(null);
    // Combine refs
    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Handle icon clicks with current input value
    const handleLeftIconClick = () => {
      if (onLeftIconClick && inputRef.current) {
        onLeftIconClick(inputRef.current.value);
      }
    };

    const handleRightIconClick = () => {
      if (onRightIconClick && inputRef.current) {
        onRightIconClick(inputRef.current.value);
      }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }

      // Trigger right icon click when Enter is pressed
      if (e.key === 'Enter' && onRightIconClick && inputRef.current) {
        e.preventDefault();
        onRightIconClick(inputRef.current.value);
      }
    };

    const inputElement = (
      <Input
        ref={combinedRef}
        type={type}
        className={cn(hasLeft && 'pl-8', hasRight && 'pr-8', className)}
        onKeyDown={handleKeyDown}
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
            onClick={handleLeftIconClick}
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
            onClick={handleRightIconClick}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

RrhInputWithIcon.displayName = 'RrhInputWithIcon';

export { RrhInputWithIcon };
