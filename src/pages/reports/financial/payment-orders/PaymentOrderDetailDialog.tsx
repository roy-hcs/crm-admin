import { PaymentOrderDepositItem } from '@/api/hooks/report';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export const PaymentOrderDetailDialog = ({
  open,
  setOpen,
  paymentOrderItem,
  isLoading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentOrderItem: PaymentOrderDepositItem;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const orderInfo = paymentOrderItem.order;
  const accountInfo = [
    {
      label: t('walletTransactions.lastName'),
      value: paymentOrderItem.userName || '',
    },
    {
      label: t('table.userShowId'),
      value: paymentOrderItem.showId || '',
    },
  ];
  const orderInfos = [
    {
      label: t('table.depositAccount'),
      value: paymentOrderItem.accountName || '',
    },
    {
      label: t('table.paymentChannel'),
      value: paymentOrderItem.channelName || '',
    },
    {
      label: t('table.depositAmount'),
      value: `${orderInfo.depositAmount} ${orderInfo.orderType === 1 ? orderInfo.destCurrency : orderInfo.baseCurrency}`,
    },
    {
      label: t('common.exchangeRate'),
      value: `${orderInfo.currencyPair}=${orderInfo.exchangeRate}`,
    },
    {
      label: t('table.commission'),
      value: `${orderInfo.commission || 0} ${orderInfo.orderType === 1 ? orderInfo.baseCurrency : orderInfo.destCurrency}`,
    },
    {
      label: t('table.payAmount'),
      value: `${orderInfo.payAmount || 0} ${orderInfo.orderType === 1 ? orderInfo.baseCurrency : orderInfo.destCurrency}`,
    },
    {
      label: t('table.receiptAmount'),
      value: `${orderInfo.receiptAmount ? orderInfo.receiptAmount + ' ' + orderInfo.receiptCurrency : '-'}`,
    },
    {
      label: t('table.remarks'),
      value: orderInfo.remark || '-',
    },
    {
      label: t('paymentOrders.orderStatus'),
      value: <RrhOrderStatusTag status={String(orderInfo.orderStatus)} />,
    },
    {
      label: t('table.orderTime'),
      value: orderInfo.createTime,
    },
    {
      label: t('table.orderNumber'),
      value: orderInfo.orderId,
    },
    {
      label: t('table.paymentLink'),
      value:
        (orderInfo.payUrl || '').length > 40 ? (
          <span title={orderInfo.payUrl || ''}>{orderInfo.payUrl?.substring(0, 40) + '...'}</span>
        ) : (
          orderInfo.payUrl
        ),
    },
    {
      label: t('table.outerOrderNo'),
      value: orderInfo.payOrder || '',
    },
    {
      label: t('performanceFeeRecord.payTime'),
      value: orderInfo.payTime || '',
    },
    {
      label: t('table.payResult'),
      value:
        orderInfo?.payResult === true
          ? t('table.paySuccess')
          : orderInfo?.payResult === false
            ? t('table.payFailed')
            : '',
    },
  ];
  return (
    <RrhDialog
      title={t('common.detail', { field: t('paymentOrders.title') })}
      open={open}
      onOpenChange={setOpen}
      confirmShow={false}
      formLoading={isLoading}
      variant="large"
    >
      <div>
        <div className="mb-3">
          <h3 className="text-card-foreground font-semibold">{t('table.accountInformation')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {accountInfo.map(item => (
              <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-card-foreground font-semibold">{t('table.orderInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {orderInfos.map(item => (
              <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
            ))}
          </div>
        </div>
      </div>
    </RrhDialog>
  );
};
