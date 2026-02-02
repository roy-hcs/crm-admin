import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { GoodsListItem } from '@/api/hooks/pointsMall/types';
import { useRemoveGoods } from '@/api/hooks/pointsMall';
import { RrhAlert } from '@/components/common/RrhAlert';

export const DeleteAlert = ({
  open,
  setOpen,
  row,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  row: GoodsListItem | undefined;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteFunc } = useRemoveGoods();

  const onConfirm = useCallback(async () => {
    const res = await deleteFunc({
      ids: row?.id || '',
    });
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess();
    } else {
      toast.error(res.msg);
    }
  }, [deleteFunc, row?.id, t, onSuccess]);
  return (
    <RrhAlert
      trigger={null}
      open={open}
      onOpenChange={setOpen}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      title={t('common.SystemPrompt')}
      content={t('products.confirmDeleteTips')}
      onConfirm={onConfirm}
    />
  );
};
