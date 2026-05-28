import { usePerformanceFeeDetail } from '@/api/hooks/copyTrading';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhDialog } from '@/components/common/RrhDialog';
import { PerformanceFeePayStatusOptions } from '@/lib/const';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const PerformanceFeeRecordDetailDialog = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
}) => {
  const { t } = useTranslation();
  const { data: detail, isLoading: initLoading } = usePerformanceFeeDetail(String(id), {
    enabled: !!id && open,
  });

  const infoList = useMemo(() => {
    if (!detail?.data?.id) return [];
    const detailData = detail.data;

    const payStatusText = PerformanceFeePayStatusOptions.find(
      i => i.value === String(detailData.payStatus),
    );

    return [
      {
        label: t('table.orderNumber'),
        value: detailData.orderNo || '-',
      },
      {
        label: t('signals.name'),
        value: detailData.signalSourceName || '-',
      },
      {
        label: t('performanceFeeRebatePage.subscriber'),
        value: `${detailData.clientName || ''} ${detailData.clientEmail || ''}`,
      },
      {
        label: t('table.subscriberAccount'),
        value: `${detailData.clientServer || ''} - ${detailData.client || ''}`,
      },
      {
        label: t('performanceFeeRecord.performanceFee'),
        value: `${detailData.performanceFee || 0} USD`,
      },
      {
        label: t('performanceFeeRecord.managementFee'),
        value: `${detailData.managementFee || 0} USD`,
      },
      {
        label: t('performanceFeeRecord.payAccount'),
        value: detailData.payAccountName || '-',
      },
      {
        label: t('table.subscriptionTime'),
        value: detailData.createTime || '-',
      },
      {
        label: t('table.payResult'),
        value: payStatusText ? t(payStatusText.label) : '-',
      },
    ];
  }, [detail, t]);

  return (
    <RrhDialog
      title={t('messageManagement.detail')}
      open={open}
      onOpenChange={setOpen}
      confirmShow={false}
      formLoading={initLoading}
      variant="large"
    >
      <div>
        {infoList.map((item, index) => (
          <LabelItem
            key={item.label + index}
            label={item.label}
            ContentDom={<div>{item.value}</div>}
          />
        ))}
      </div>
    </RrhDialog>
  );
};
