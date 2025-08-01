import React from 'react';
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  title?: string;
  description?: string;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  isConfirmDisabled?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  footerShow?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  trigger,
  children,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  isConfirmDisabled = false,
  className = '',
  onCancel,
  onConfirm,
  open,
  onOpenChange,
  footerShow = true,
}) => {
  const handleCancel = () => {
    onCancel?.();
    if (!onOpenChange) return;
    onOpenChange(false);
  };

  const handleConfirm = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onConfirm?.(e);
    if (!onOpenChange) return;
    onOpenChange(false);
  };

  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogClose className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
          <X className="h-4 w-4 cursor-pointer" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footerShow && (
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose>
              <div
                className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-blue-500"
                onClick={handleCancel}
              >
                {cancelText}
              </div>
            </DialogClose>
            <DialogClose>
              <div
                onClick={e => {
                  if (isConfirmDisabled) return;
                  handleConfirm?.(e);
                }}
                className={cn(
                  'rounded-sm border bg-blue-500 px-4 py-2 text-white',
                  isConfirmDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
              >
                {confirmText}
              </div>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;
