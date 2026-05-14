import * as React from 'react';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { CornerDownLeft } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
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
    const [hasValue, setHasValue] = React.useState(() => !!props.defaultValue);

    // Stable merged ref — wrapped in useCallback to avoid detach/reattach on every render
    const combinedRef = React.useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
    }, []);

    const handleLeftIconClick = React.useCallback(() => {
      if (onLeftIconClick && inputRef.current) {
        onLeftIconClick(inputRef.current.value);
      }
    }, [onLeftIconClick]);

    const handleRightIconClick = React.useCallback(() => {
      if (onRightIconClick && inputRef.current) {
        onRightIconClick(inputRef.current.value);
      }
    }, [onRightIconClick]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);

        if (e.key === 'Enter' && (onRightIconClick || onLeftIconClick) && inputRef.current) {
          e.preventDefault();
          onRightIconClick?.(inputRef.current.value);
          onLeftIconClick?.(inputRef.current.value);
        }
      },
      [onKeyDown, onRightIconClick, onLeftIconClick],
    );

    const inputElement = (
      <Input
        ref={combinedRef}
        type={type}
        className={cn('bg-white', hasLeft && 'pl-8', hasRight && 'pr-8', className)}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
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
        {!hasValue && (
          <span className="text-muted-foreground bg-muted absolute right-2 hidden items-center gap-1 rounded-sm px-2 py-1 text-xs md:flex">
            <span>Enter</span>
            <CornerDownLeft className="size-3" />
          </span>
        )}
      </div>
    );
  },
);

RrhInputWithIcon.displayName = 'RrhInputWithIcon';

export { RrhInputWithIcon };
