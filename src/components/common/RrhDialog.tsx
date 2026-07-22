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
import { RrhButton } from './RrhButton';

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
  onConfirm?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  footerShow?: boolean;
  confirmShow?: boolean;
  cancelShow?: boolean;
  variant?: 'default' | 'small' | 'middle' | 'large' | 'adaptive';
  titleCls?: string;
  formLoading?: boolean;
  type?: 'view' | 'submit';
  leftDom?: React.ReactNode;
  modal?: boolean;
  contentClassName?: string;
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
  cancelShow = true,
  variant = 'default',
  titleCls,
  formLoading = false,
  type = 'view',
  leftDom,
  modal = true,
  contentClassName = '',
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    if (!onOpenChange) return;
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    await onConfirm?.();
    if (!onOpenChange) return;
    onOpenChange(false);
  };
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isAdaptive = variant === 'adaptive';

  // Desktop mode: use Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            {
              'w-md': variant === 'small',
              'w-xl': variant === 'middle',
              //  768 / 1440 = 0.5333
              'flex max-h-[53vh] w-3xl flex-col sm:max-w-full': variant === 'large',
              'flex max-h-[90vh] !w-fit min-w-[320px] flex-col overflow-hidden sm:!max-w-[92vw]':
                isAdaptive,
            },
            '!px-0',
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
                  'border-muted px-6 pb-6 text-lg font-semibold',
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
          <div className={cn('flex flex-1 flex-col overflow-y-auto px-6', contentClassName)}>
            {children}
          </div>
          {footerShow && (
            <DialogFooter
              className={cn(
                'border-muted gap-2 px-6 pt-6 sm:justify-end',
                variant === 'small' ? '' : 'border-t',
              )}
            >
              {leftDom && <div className="mr-auto">{leftDom}</div>}
              {/* 防止非受控模式下 点击取消 无法关闭 */}
              {cancelShow &&
                (onCancel ? (
                  <div
                    className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-[#1E1E1E]"
                    onClick={handleCancel}
                  >
                    {cancelText || t('common.Cancel')}
                  </div>
                ) : (
                  <DialogClose>
                    <div className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-[#1E1E1E]">
                      {cancelText || t('common.Cancel')}
                    </div>
                  </DialogClose>
                ))}
              {confirmShow &&
                (type === 'view' ? (
                  <DialogClose>
                    <div
                      onClick={() => {
                        if (isConfirmDisabled) return;
                        handleConfirm?.();
                      }}
                      className={cn(
                        'bg-primary rounded-sm border px-4 py-2 text-white',
                        isConfirmDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                      )}
                    >
                      {confirmText || t('common.Confirm')}
                    </div>
                  </DialogClose>
                ) : (
                  <RrhButton
                    className="px-4 py-2"
                    disabled={isConfirmDisabled}
                    onClick={() => onConfirm?.()}
                  >
                    {confirmText || t('common.Confirm')}
                  </RrhButton>
                ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile mode: use Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={modal}>
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
        className={cn('w-full max-w-none', className)}
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
        <div className={cn('overflow-auto px-6', contentClassName)}>{children}</div>
        {footerShow && (
          <DrawerFooter className="flex flex-row justify-end gap-2 px-6">
            {leftDom && <div className="mr-auto">{leftDom}</div>}
            {/* 防止非受控模式下 点击取消 无法关闭 */}
            {cancelShow &&
              (onCancel ? (
                <RrhButton variant="outline" className="px-4 py-2" onClick={handleCancel}>
                  {cancelText || t('common.Cancel')}
                </RrhButton>
              ) : (
                <DrawerClose>
                  <RrhButton variant="outline" className="px-4 py-2" onClick={handleCancel}>
                    {cancelText || t('common.Cancel')}
                  </RrhButton>
                </DrawerClose>
              ))}
            {confirmShow &&
              (type === 'view' ? (
                <DrawerClose>
                  <div
                    onClick={() => {
                      if (isConfirmDisabled) return;
                      handleConfirm?.();
                    }}
                    className={cn(
                      'bg-primary w-full rounded-sm border px-4 py-2 text-center text-white',
                      isConfirmDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                    )}
                  >
                    {confirmText || t('common.Confirm')}
                  </div>
                </DrawerClose>
              ) : (
                <RrhButton
                  className="px-4 py-2"
                  disabled={isConfirmDisabled}
                  onClick={() => onConfirm?.()}
                >
                  {confirmText || t('common.Confirm')}
                </RrhButton>
              ))}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
