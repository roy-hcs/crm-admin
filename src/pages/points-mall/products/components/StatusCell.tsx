import { GoodsListItem, useChangeGoodsStatus } from '@/api/hooks/pointsMall';
import { Alert } from '@/components/common/Alert';
import { Switch } from '@/components/ui/switch';
import { Row } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const StatusCell = ({
  row,
  onSuccess,
}: {
  row: Row<GoodsListItem>;
  onSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: changeFunc } = useChangeGoodsStatus();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeFunc({
      id: row.original.id,
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      onSuccess();
      toast.success(t('common.success'));
    } else {
      toast.error(res.msg);
    }
  }, [changeFunc, onSuccess, row.original.id, row.original.status, t]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.status === 1 ? t('products.confirm.stop') : t('products.confirm.open')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};
