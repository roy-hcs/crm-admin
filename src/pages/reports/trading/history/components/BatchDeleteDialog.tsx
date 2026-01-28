import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { useBatchDeleteTradingHistory } from '@/api/hooks/report/report';

export const BatchDeleteDialog = ({
  onSuccess,
  ids,
  serverId,
}: {
  onSuccess?: () => void;
  ids: string[];
  serverId: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: batchDeleteFunc } = useBatchDeleteTradingHistory();

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const param = {
        ids: ids.join(','),
        serverId: serverId,
        type: 'd',
      };
      const res = await batchDeleteFunc(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton
          onClick={e => {
            if (ids && ids?.length > 0) {
              setOpen(true);
            } else {
              toast.error(t('tradingHistoryPage.atLeastOneOrder'));
              e.preventDefault();
            }
          }}
          variant="outline"
        >
          {t('table.batchDelete')}
        </RrhButton>
      }
      title={t('table.batchDelete')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <div className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('tradingHistoryPage.selectedOrders', {
            count: ids.length,
          })}
        </div>
        <div>{t('tradingHistoryPage.deleteOrderConfirm')}</div>
        <div className="flex justify-end gap-4 pb-4 md:pb-0">
          <RrhButton variant="outline" onClick={() => setOpen(false)}>
            {t('common.Cancel')}
          </RrhButton>
          <RrhButton variant="default" onClick={handleConfirm}>
            {t('common.Confirm')}
          </RrhButton>
        </div>
      </div>
    </RrhDialog>
  );
};
