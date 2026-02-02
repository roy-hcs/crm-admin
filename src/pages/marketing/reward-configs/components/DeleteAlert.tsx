import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { BonusSettingListItem, useBonusSettingRemove } from '@/api/hooks/marketing';
import { Alert } from '@/components/common/Alert';

export const DeleteAlert = ({
  open,
  setOpen,
  row,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  row: BonusSettingListItem | undefined;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteFunc } = useBonusSettingRemove();

  const onConfirm = useCallback(async () => {
    const res = await deleteFunc({
      ids: row?.id || '',
    });
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess();
    }
  }, [deleteFunc, row?.id, t, onSuccess]);
  return (
    <Alert
      trigger={null}
      open={open}
      onOpenChange={setOpen}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      title={t('common.SystemPrompt')}
      content={t('rewardConfigPage.confirmDeleteTips')}
      onConfirm={onConfirm}
    />
  );
};
