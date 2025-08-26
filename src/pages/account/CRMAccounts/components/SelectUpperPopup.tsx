import { CrmUserItem } from '@/api/hooks/system/types';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { AccountDialog } from './AccountDialog';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export const SelectUpperPopup = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'inviter'>;
  verticalLabel?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  return (
    <FormItem
      className={cn('flex items-center text-sm', verticalLabel ? 'flex-col items-start gap-2' : '')}
    >
      <FormLabel className="basis-3/12 text-[#757F8D]">上级:</FormLabel>
      <FormControl>
        <AccountDialog
          trigger={
            <div
              className={cn(
                'flex h-9 basis-9/12 items-center rounded-md border',
                verticalLabel ? 'w-full' : '',
              )}
            >
              <Input
                className="flex-1"
                type="text"
                disabled
                value={selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : ''}
              />
              <button
                type="button"
                className="h-9 cursor-pointer rounded-md bg-blue-500 px-4 text-white"
              >
                请选择
              </button>
            </div>
          }
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          title="选择上级"
          onConfirm={string => field.onChange(string)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
