import { CrmUserItem } from '@/api/hooks/account';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { ArrowRight } from 'lucide-react';
import { UserDialog } from '@/pages/account/trading-accounts/components/UserDialog';

export const SelectAccount = ({
  field,
  verticalLabel = false,
  optional = false,
  title,
}: {
  field: ControllerRenderProps<FieldValues>;
  verticalLabel?: boolean;
  optional?: boolean;
  title: string;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const { t } = useTranslation();
  return (
    <FormItem>
      <div className={cn('text-foreground text-sm', verticalLabel ? '' : 'flex items-center')}>
        <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>
          {`${title}${optional ? ` (${t('common.optional')})` : ''}`}
        </FormLabel>
        <FormControl>
          <UserDialog
            trigger={
              <div
                className={cn(
                  'flex h-9 basis-9/12 items-center rounded-md border',
                  verticalLabel ? 'w-full' : '',
                )}
              >
                <Input
                  className="flex-1 border-0 ring-0 outline-0"
                  type="text"
                  readOnly
                  placeholder={t('common.pleaseSelect')}
                  value={selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : ''}
                />
                <RrhButton variant="ghost" className="rounded-l-none" type="button">
                  {t('common.select')}
                  <ArrowRight />
                </RrhButton>
              </div>
            }
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            title={t('common.selectUser')}
            onConfirm={string => field.onChange(string)}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
