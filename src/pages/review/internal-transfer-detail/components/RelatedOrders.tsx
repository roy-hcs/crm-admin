import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { PencilLine } from 'lucide-react';
import { OrderDialog } from './OrderDialog';
import { InternalTransferDealTicketItem } from '@/api/hooks/review/types';

export const RelatedOrders = ({ field }: { field: ControllerRenderProps<FieldValues> }) => {
  const [selectedUser, setSelectedUser] = useState<InternalTransferDealTicketItem | null>(null);
  const { t } = useTranslation();
  return (
    <FormItem className="w-full">
      <FormControl>
        <OrderDialog
          trigger={
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm leading-5 font-normal">
                {field.value || '-'}
              </div>
              <RrhButton variant="ghost" className="rounded-l-none" type="button">
                <PencilLine className="size-4" />
              </RrhButton>
            </div>
          }
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          title={t('internalTransferReview.selectWithOrder')}
          onConfirm={string => field.onChange(string)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
