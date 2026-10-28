import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { useCancelWithdrawOrder } from '@/api/hooks/review';

const MAX_REMARK_LENGTH = 500;

export const CancelWithdrawOrderDialog = ({ withdrawalId }: { withdrawalId: string }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const { mutateAsync: cancelOrder, isPending } = useCancelWithdrawOrder();

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    setOpen(next);
    if (!next) setRemark('');
  };

  const handleConfirm = async () => {
    const value = remark.trim();
    if (!value) {
      toast.error(t('review.cancelOrderReasonRequired'));
      return;
    }
    try {
      const res = await cancelOrder({ id: withdrawalId, remark: value });
      if (res.code !== 0) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }
      toast.success(t('common.success'));
      setOpen(false);
      setRemark('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('review.cancelOrderTitle')}
      description={t('review.cancelOrderTip')}
      open={open}
      onOpenChange={handleOpenChange}
      variant="small"
      footerShow={false}
      trigger={
        <RrhButton variant="outline" className="text-destructive w-full">
          {t('review.cancelOrderAction')}
        </RrhButton>
      }
    >
      <div className="text-destructive text-sm">{t('review.cancelOrderConfirmTip')}</div>
      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-medium">
          <span className="text-destructive">*</span>
          {t('review.cancelOrderReason')}
        </label>
        <textarea
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
          maxLength={MAX_REMARK_LENGTH}
          value={remark}
          placeholder={t('review.cancelOrderReasonPlaceholder')}
          onChange={e => setRemark(e.target.value)}
        />
        <div className="text-muted-foreground text-right text-xs">
          {remark.length}/{MAX_REMARK_LENGTH}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <RrhButton
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => handleOpenChange(false)}
        >
          {t('review.cancelOrderDontCancel')}
        </RrhButton>
        <RrhButton type="button" variant="destructive" loading={isPending} onClick={handleConfirm}>
          {t('review.cancelOrderConfirm')}
        </RrhButton>
      </div>
    </RrhDialog>
  );
};
