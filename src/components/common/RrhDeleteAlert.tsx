import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { RrhAlert } from '@/components/common/RrhAlert';

export function RrhDeleteAlert<T>({
  open,
  setOpen,
  onSuccess,
  confirmFunction,
  params,
  tipsText,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  confirmFunction: (params: T) => Promise<{ code: number; msg: string }>;
  params: T;
  tipsText: string;
}) {
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await confirmFunction(params);
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess();
    } else {
      toast.error(res.msg);
    }
  }, [confirmFunction, params, t, onSuccess]);
  return (
    <RrhAlert
      trigger={null}
      open={open}
      onOpenChange={setOpen}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      title={t('common.SystemPrompt')}
      content={tipsText}
      onConfirm={onConfirm}
    />
  );
}
