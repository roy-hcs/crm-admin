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
import { Button } from '../ui/button';
import { FC, PropsWithChildren } from 'react';
export const RrhDrawer: FC<
  PropsWithChildren<{
    Trigger: React.ReactNode;
    title?: string;
    description?: string;
    submitText?: string;
    cancelText?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    footerShow?: boolean;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    asChild?: boolean;
  }>
> = ({
  Trigger,
  title,
  description,
  submitText,
  direction,
  cancelText,
  children,
  footerShow = true,
  open,
  setOpen,
  asChild,
}) => {
  return (
    <Drawer direction={direction} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={asChild} className="cursor-pointer">
        {Trigger}
      </DrawerTrigger>
      <DrawerContent className="flex flex-col">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="scrollbar-none flex-1 overflow-auto">{children}</div>
        {footerShow && (
          <DrawerFooter>
            <Button>{submitText || 'Confirm'}</Button>
            <DrawerClose>
              <Button variant="outline">{cancelText || 'Cancel'}</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
