import { CrmUserDealListDetailRes } from '@/api/hooks/report';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const TradingAccountTransactionDetailDialog = ({
  open,
  setOpen,
  transactionDetail,
  isLoading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  transactionDetail: CrmUserDealListDetailRes;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const dealAccountInfo = transactionDetail.dealAccount;
  const userDealInfo = transactionDetail.userDeal;
  const serverType = useMemo(() => {
    switch (dealAccountInfo.serviceType) {
      case 1:
        return 'MT5';
      case 2:
        return 'MT4';
      case 3:
        return 'Sirix';
      case 4:
        return 'XForce';
      case 5:
        return 'XOH';
      default:
        return '';
    }
  }, [dealAccountInfo.serviceType]);
  const accountInfo = [
    {
      label: t('walletTransactions.lastName'),
      value: dealAccountInfo.name || '',
    },
    {
      label: t('table.tradingAccount'),
      value: userDealInfo.login || '',
    },
    {
      label: t('table.server'),
      value: (
        <div>
          <span className="bg-primary text-background mr-1 inline-block rounded-md px-1.5 py-0.5 text-xs">
            {dealAccountInfo.serviceProperty === 1 ? t('common.live') : t('common.demo')}
          </span>
          <span className="bg-background border-border mr-2 inline-block rounded-md border px-1.5 py-0.5 text-xs">
            {serverType}
          </span>
          <span>{userDealInfo.server}</span>
        </div>
      ),
    },
    {
      label: t('table.groups'),
      value: dealAccountInfo.serverGroup || '',
    },
    {
      label: t('table.accountGroup'),
      value: dealAccountInfo.accountGroupName || '',
    },
  ];
  const flowInfo = [
    {
      label: t('table.operationType'),
      value: transactionDetail.typeName || '',
    },
    {
      label: t('tradingAccountTransactions.profit'),
      value: (
        <div>
          {`${userDealInfo.profit > 0 ? '+' : ''}${userDealInfo.profit} ${userDealInfo.currency}`}
        </div>
      ),
    },
    {
      label: t('walletTransactions.operationTimeTable'),
      value: userDealInfo.timeStr || '',
    },
    {
      label: t('table.orderNumber'),
      value: userDealInfo.ticket || '',
    },
    {
      label: t('table.comments'),
      value: userDealInfo.comment || '',
    },
    {
      label: t('tradingAccountTransactions.order_num'),
      value: userDealInfo.orderNum || '',
    },
    {
      label: `CRM${t('table.remarks')}`,
      value: userDealInfo.remark || '',
    },
  ];
  return (
    <RrhDialog
      title={t('common.detail', { field: t('tradingAccountTransactions.title') })}
      open={open}
      onOpenChange={setOpen}
      confirmShow={false}
      formLoading={isLoading}
      variant="large"
    >
      <div className="overflow-y-auto">
        <div className="mb-3">
          <h3 className="text-card-foreground font-semibold">{t('table.accountInformation')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {accountInfo.map(item => (
              <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-card-foreground font-semibold">{t('table.flowInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {flowInfo.map(item => (
              <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
            ))}
          </div>
        </div>
      </div>
    </RrhDialog>
  );
};
