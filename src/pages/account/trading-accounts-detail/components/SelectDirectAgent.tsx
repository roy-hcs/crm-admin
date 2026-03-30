import { CrmUserItem } from '@/api/hooks/account';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { ArrowRight } from 'lucide-react';
import { UserDialog } from '../../trading-accounts/components/UserDialog';

export const SelectDirectAgent = ({
  onConfirm,
  valueLabel,
}: {
  onConfirm: (payload: { value: string; label: string }) => void;
  valueLabel?: string;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const { t } = useTranslation();
  const selectedLabel = selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : '';
  return (
    <UserDialog
      trigger={
        <div className="flex h-9 w-full basis-9/12 items-center rounded-md border">
          <Input
            className="flex-1 border-0 ring-0 outline-0"
            type="text"
            readOnly
            placeholder={t('common.pleaseSelect')}
            value={selectedLabel || valueLabel || ''}
          />
          <RrhButton variant="ghost" className="rounded-l-none" type="button">
            {t('common.select')}
            <ArrowRight />
          </RrhButton>
        </div>
      }
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      title={t('CRMAccountPage.SelectSuperior')}
      onConfirm={value => {
        onConfirm({
          value,
          label: selectedLabel,
        });
      }}
    />
  );
};
