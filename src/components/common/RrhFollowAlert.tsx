import { RrhAlert } from '@/components/common/RrhAlert';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function RrhFollowAlert<T>({
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

  const handleClick = () => {
    /**
     * 如果是取关弹出二次确认
     * 否则直接关注
     */
    if (checked) {
      setIsOpen(true);
    } else {
      onConfirm();
    }
  };

  return (
    <>
      <Star onClick={handleClick} className={cn(checked ? 'text-yellow-400' : '', 'size-3.5')} />
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
