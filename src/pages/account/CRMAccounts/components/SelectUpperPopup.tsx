import { CrmUserItem } from '@/api/hooks/system/types';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { AccountDialog } from './AccountDialog';

export const SelectUpperPopup = ({
  field,
}: {
  field: ControllerRenderProps<FieldValues, 'inviter'>;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  return (
    <FormItem className="flex items-center text-sm">
      <FormLabel className="basis-3/12">上级:</FormLabel>
      <FormControl>
        <AccountDialog
          trigger={
            <div className="flex h-9 basis-9/12 items-center border">
              <input
                className="flex-1"
                type="text"
                disabled
                value={selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : ''}
              />
              <button type="button" className="h-9 cursor-pointer bg-blue-500 px-4 text-white">
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
