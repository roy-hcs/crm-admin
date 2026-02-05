import { RrhAlert } from '@/components/common/RrhAlert';
import { Switch } from '@/components/ui/switch';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function RrhStatusAlert<T>({
  confirmFunction,
  params,
  tipsText,
  checked,
  onSuccess,
}: {
  confirmFunction: (params: T) => Promise<{ code: number; msg: string }>;
  params: T;
  tipsText: string;
  checked: boolean;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await confirmFunction(params);
    if (res.code === 0) {
      onSuccess();
      toast.success(t('common.success'));
    } else {
      toast.error(res.msg);
    }
  }, [confirmFunction, onSuccess, params, t]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={checked}
        onClick={() => setIsOpen(true)}
      />
      <RrhAlert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={tipsText}
        onConfirm={onConfirm}
      />
    </>
  );
}
