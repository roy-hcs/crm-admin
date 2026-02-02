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
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
export const RrhDrawer: FC<
  PropsWithChildren<{
    Trigger: React.ReactNode;
    title?: string;
    description?: string;
    submitText?: string;
    cancelText?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    responsiveDirection?: {
      mobile: 'left' | 'right' | 'top' | 'bottom';
      desktop: 'left' | 'right' | 'top' | 'bottom';
    };
    headerShow?: boolean;
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
  responsiveDirection,
  cancelText,
  children,
  headerShow = true,
  footerShow = true,
  open,
  setOpen,
  asChild,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const finalDirection = responsiveDirection
    ? isMobile
      ? responsiveDirection.mobile
      : responsiveDirection.desktop
    : direction;
  return (
    <Drawer direction={finalDirection} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={asChild} className="cursor-pointer">
        {Trigger}
      </DrawerTrigger>
      <DrawerContent className="flex flex-col data-[vaul-drawer-direction=right]:sm:max-w-1/3">
        <DrawerHeader className={cn(headerShow ? 'block' : 'hidden')}>
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
