import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RrhCircleLoading } from './RrhCircleLoading';

interface DialogProps {
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
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
  confirmShow?: boolean;
  variant?: 'default' | 'small' | 'middle' | 'large';
  titleCls?: string;
  formLoading?: boolean;
}

export const RrhDialog: React.FC<DialogProps> = ({
  title,
  description,
  trigger,
  children,
  cancelText,
  confirmText,
  isConfirmDisabled = false,
  className = '',
  onCancel,
  onConfirm,
  open,
  onOpenChange,
  footerShow = true,
  confirmShow = true,
  variant = 'default',
  titleCls,
  formLoading = false,
}) => {
  const handleCancel = () => {
    onCancel?.();
    if (!onOpenChange) return;
    onOpenChange(false);
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    await onConfirm?.(e);
    if (!onOpenChange) return;
    onOpenChange(false);
  };
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Desktop mode: use Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            {
              'w-md': variant === 'small',
              'w-xl': variant === 'middle',
              //  768 / 1440 = 0.5333
              'flex max-h-[53vh] w-3xl flex-col sm:max-w-full': variant === 'large',
            },
            className,
          )}
          showCloseButton={false}
          onInteractOutside={e => {
            if (formLoading) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={e => {
            if (formLoading) {
              e.preventDefault(); // Also prevent Escape key
            }
          }}
        >
          {formLoading && (
            <div className="bg-accent-foreground/8 absolute inset-0 flex items-center justify-center">
              <RrhCircleLoading />
            </div>
          )}
          <DialogClose
            onClick={() => {
              onOpenChange?.(false);
            }}
            className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-7.5 right-6 cursor-pointer rounded-sm border-none opacity-70 transition-opacity outline-none hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-4 w-4 cursor-pointer" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {title && (
            <DialogHeader>
              <DialogTitle
                className={cn(
                  'border-muted -mx-6 px-6 pb-6 text-lg font-semibold',
                  variant === 'small' ? '' : 'border-b',
                  titleCls,
                )}
              >
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription>{description || title || ''}</DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  {description || title || ''}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
          {footerShow && (
            <DialogFooter
              className={cn(
                'border-muted -mx-6 gap-2 px-6 pt-6 sm:justify-end',
                variant === 'small' ? '' : 'border-t',
              )}
            >
              <DialogClose>
                <div
                  className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-[#1E1E1E]"
                  onClick={handleCancel}
                >
                  {cancelText || t('common.Cancel')}
                </div>
              </DialogClose>
              {confirmShow && (
                <DialogClose>
                  <div
                    onClick={e => {
                      if (isConfirmDisabled) return;
                      handleConfirm?.(e);
                    }}
                    className={cn(
                      'bg-primary rounded-sm border px-4 py-2 text-white',
                      isConfirmDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                    )}
                  >
                    {confirmText || t('common.Confirm')}
                  </div>
                </DialogClose>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile mode: use Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        onInteractOutside={e => {
          if (formLoading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={e => {
          if (formLoading) {
            e.preventDefault(); // Also prevent Escape key
          }
        }}
      >
        {formLoading && (
          <div className="bg-accent-foreground/8 absolute inset-0 flex items-center justify-center">
            <RrhCircleLoading />
          </div>
        )}
        <DrawerClose className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-sm border-none opacity-70 transition-opacity outline-none hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <X className="h-4 w-4 cursor-pointer" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        {title && (
          <DrawerHeader>
            <DrawerTitle className={cn('text-lg font-semibold', titleCls)}>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description || title || ''}</DrawerDescription>
            ) : (
              <DrawerDescription className="sr-only">
                {description || title || ''}
              </DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="overflow-y-auto px-6">{children}</div>
        {footerShow && (
          <DrawerFooter className="flex flex-row justify-end gap-2 px-6">
            <DrawerClose>
              <div
                className="w-full cursor-pointer rounded-sm border bg-white px-4 py-2 text-center text-[#1E1E1E]"
                onClick={handleCancel}
              >
                {cancelText || t('common.Cancel')}
              </div>
            </DrawerClose>
            {confirmShow && (
              <DrawerClose>
                <div
                  onClick={e => {
                    if (isConfirmDisabled) return;
                    handleConfirm?.(e);
                  }}
                  className={cn(
                    'bg-primary w-full rounded-sm border px-4 py-2 text-center text-white',
                    isConfirmDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  )}
                >
                  {confirmText || t('common.Confirm')}
                </div>
              </DrawerClose>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
