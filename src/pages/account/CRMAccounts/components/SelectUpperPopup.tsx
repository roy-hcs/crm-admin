import { CrmUserItem } from '@/api/hooks/system/types';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { AccountDialog } from './AccountDialog';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';

export const SelectUpperPopup = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'inviter'>;
  verticalLabel?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const { t } = useTranslation();
  return (
    <FormItem>
      <div
        className={cn(
          'flex items-center text-sm',
          verticalLabel ? 'flex-col items-start gap-2' : '',
        )}
      >
        <FormLabel className="basis-3/12">{t('CRMAccountPage.Superior')}:</FormLabel>
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
                <RrhButton className="rounded-l-none" type="button">
                  {t('common.pleaseSelect')}
                </RrhButton>
              </div>
            }
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            title={t('CRMAccountPage.SelectSuperior')}
            onConfirm={string => field.onChange(string)}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
