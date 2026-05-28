import { useMamFollowDetail } from '@/api/hooks/copyTrading';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhDialog } from '@/components/common/RrhDialog';
import { arrivalStatusOptions } from '@/lib/const';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const OrderDetailDialog = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
}) => {
  const { t } = useTranslation();
  const { data: detail, isLoading: initLoading } = useMamFollowDetail(String(id), {
    enabled: !!id && open,
  });

  const infoList = useMemo(() => {
    if (!detail?.data?.id) return [];
    const detailData = detail.data;

    const arrivalStatusText = arrivalStatusOptions.find(
      i => i.value === String(detailData.arrivalStatus || 0),
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
        label: t('signals.signalSourceAuthor'),
        value: detailData.traderName || '-',
      },
      {
        label: t('performanceFeeRebatePage.subscriber'),
        value: detailData.userName || '-',
      },
      {
        label: t('table.subscriberAccount'),
        value: `${detailData.clientServer || ''} - ${detailData.client || ''}`,
      },
      {
        label: t('signals.subscribeFee'),
        value: `${detailData.subscribeFee || 0} USD`,
      },
      {
        label: t('orderManagementTable.managementFeeRatio'),
        value: `${detailData.estimatedManagementFee || 0} USD`,
      },
      {
        label: t('orderManagementTable.payAccountName'),
        value: detailData.payAccountName || '-',
      },
      {
        label: t('table.subscriptionTime'),
        value: detailData.followEndTime || '-',
      },
      {
        label: t('table.arrivalStatus'),
        value: arrivalStatusText ? t(arrivalStatusText.label) : '-',
      },
      {
        label: t('table.amountOfReceipt'),
        value: detailData.actualSubscribeFee || '-',
      },
      {
        label: t('table.managementFee'),
        value: detailData.managementFee || '-',
      },
      {
        label: t('table.arrivalTime'),
        value: detailData.stopTime || '-',
      },
      {
        label: t('table.remarks'),
        value: detailData.remark || '-',
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
