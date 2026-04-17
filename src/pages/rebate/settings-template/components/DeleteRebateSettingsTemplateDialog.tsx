import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { RrhAlert } from '@/components/common/RrhAlert';
import { RebateSettingsTemplate, useDeleteRebateSettingsTemplate } from '@/api/hooks/rebate';

export const DeleteRebateSettingsTemplateDialog = ({
  open,
  setOpen,
  type,
  currentTemplate,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: number;
  currentTemplate?: RebateSettingsTemplate;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteFunc } = useDeleteRebateSettingsTemplate(type);

  const onConfirm = useCallback(async () => {
    const res = await deleteFunc({
      ids: currentTemplate?.id || '',
    });
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess();
    }
  }, [deleteFunc, currentTemplate?.id, t, onSuccess]);
  return (
    <RrhAlert
      trigger={null}
      open={open}
      onOpenChange={setOpen}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      title={t('common.SystemPrompt')}
      content={t('RebateTemplate.deleteMsg')}
      onConfirm={onConfirm}
    />
  );
};
