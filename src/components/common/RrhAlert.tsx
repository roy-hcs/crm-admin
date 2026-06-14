import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export interface AlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  content: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** 确认按钮加载状态，loading 时禁用按钮防止重复提交 */
  confirmLoading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RrhAlert = ({
  trigger,
  title,
  content,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmVariant = 'default',
  confirmLoading = false,
  onCancel,
  onConfirm,
  open,
  onOpenChange,
}: AlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={confirmLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              confirmVariant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
            disabled={confirmLoading}
            onClick={onConfirm}
          >
            {confirmLoading && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
