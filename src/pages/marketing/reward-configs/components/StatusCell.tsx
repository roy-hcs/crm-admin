import { useBonusSettingSwitch } from '@/api/hooks/marketing';
import { BonusSettingListItem } from '@/api/hooks/marketing/types';
import { RrhAlert } from '@/components/common/RrhAlert';
import { Switch } from '@/components/ui/switch';
import { Row } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const StatusCell = ({
  row,
  onSuccess,
}: {
  row: Row<BonusSettingListItem>;
  onSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: changeFunc } = useBonusSettingSwitch();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeFunc({
      id: row.original.id,
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess();
    }
  }, [changeFunc, row.original.id, row.original.status, t, onSuccess]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <RrhAlert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.status === 1
            ? t('rewardConfigPage.confirmStopTips')
            : t('rewardConfigPage.confirmRunTips')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};
