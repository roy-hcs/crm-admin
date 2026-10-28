import { useRiskControlOrderDetail } from '@/api/hooks/review';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  RiskOrderDialogTarget,
  formatDurationWithUnit,
  formatMoney,
  splitDuration,
} from './riskControlUtils';

export const RiskOrderDetailDialog = ({
  open,
  onOpenChange,
  target,
  periodLabel,
  startTime,
  endTime,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: RiskOrderDialogTarget | null;
  periodLabel: string;
  startTime: string;
  endTime: string;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useRiskControlOrderDetail(
    target
      ? {
          serverId: target.serverId,
          account: target.account,
          startTime,
          endTime,
          resultFilter: target.resultFilter,
        }
      : null,
    { enabled: open && !!target },
  );

  const titleMap: Record<RiskOrderDialogTarget['resultFilter'], string> = {
    all: t('riskControlPage.orderModalFilterAll'),
    profit: t('riskControlPage.orderModalFilterProfit'),
    loss: t('riskControlPage.orderModalFilterLoss'),
    breakeven: t('riskControlPage.orderModalFilterBreakeven'),
  };

  const subtitle = target
    ? `${target.customerName} · CRM ${target.crmShowId} · ${t('table.account')} ${target.account} · ${periodLabel}`
    : '';

  const ordersUnit = t('riskControlPage.unitOrders');
  const lotsUnit = t('riskControlPage.unitLots');

  const profitCls = (value: number) =>
    value > 0 ? 'text-emerald-600' : value < 0 ? 'text-red-600' : '';

  const truncated =
    data && Number(data.shownCount) < Number(data.totalCount)
      ? t('riskControlPage.orderModalTruncated', {
          total: data.totalCount,
          shown: data.shownCount,
        })
      : null;

  return (
    <RrhDialog
      title={target ? titleMap[target.resultFilter] : t('riskControlPage.orderModalDefaultTitle')}
      description={subtitle}
      open={open}
      onOpenChange={onOpenChange}
      variant="adaptive"
      confirmShow={false}
      cancelText={t('common.close')}
      contentClassName="pb-2"
    >
      <div className="flex min-w-0 flex-col gap-3">
        {isLoading && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t('common.loading')}
          </div>
        )}
        {isError && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t('riskControlPage.commonLoadFailed', {
              msg: error?.message || t('riskControlPage.commonUnknownError'),
            })}
          </div>
        )}
        {data && (
          <>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="border-border rounded-lg border px-3 py-2">
                <span className="text-muted-foreground block text-xs">
                  {target?.label || t('riskControlPage.orderModalDefaultCountLabel')}
                </span>
                <strong className="text-sm">
                  {data.orderCount} {ordersUnit}
                </strong>
              </div>
              <div className="border-border rounded-lg border px-3 py-2">
                <span className="text-muted-foreground block text-xs">
                  {t('riskControlPage.orderModalTotalProfit')}
                </span>
                <strong className={cn('text-sm', profitCls(Number(data.totalProfit)))}>
                  {formatMoney(data.totalProfit, data.currency) || '-'}
                </strong>
              </div>
              <div className="border-border rounded-lg border px-3 py-2">
                <span className="text-muted-foreground block text-xs">
                  {t('riskControlPage.orderModalTotalRebate')}
                </span>
                <strong className="text-sm">
                  {formatMoney(data.totalRebate, data.rebateCurrency) || '-'}
                </strong>
              </div>
            </div>
            {truncated && (
              <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {truncated}
              </div>
            )}
            {data.orders?.length ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b">
                      {[
                        t('riskControlPage.orderTableTicket'),
                        t('table.symbol'),
                        t('riskControlPage.orderTableDirection'),
                        t('table.perLot'),
                        t('table.openTime'),
                        t('table.closeTime'),
                        t('riskControlPage.orderTableDuration'),
                        t('riskControlPage.orderTableProfit'),
                        t('table.rebate'),
                      ].map(header => (
                        <th
                          key={header}
                          className="bg-muted/40 px-2 py-1.5 text-left font-semibold whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order, index) => {
                      const duration = splitDuration(order.durationSeconds);
                      return (
                        <tr key={`${order.ticket}-${index}`} className="border-b">
                          <td className="px-2 py-1.5 whitespace-nowrap">{order.ticket}</td>
                          <td className="px-2 py-1.5 whitespace-nowrap">{order.symbol}</td>
                          <td className="px-2 py-1.5">
                            <span
                              className={cn(
                                'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                                order.direction === 'SELL'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-emerald-50 text-emerald-600',
                              )}
                            >
                              {order.direction}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 whitespace-nowrap">
                            {order.volume !== null && order.volume !== undefined
                              ? `${order.volume} ${lotsUnit}`
                              : '-'}
                          </td>
                          <td className="px-2 py-1.5 whitespace-nowrap">{order.openTime || '-'}</td>
                          <td className="px-2 py-1.5 whitespace-nowrap">
                            {order.closeTime || '-'}
                          </td>
                          <td className="px-2 py-1.5 whitespace-nowrap">
                            {formatDurationWithUnit(duration, t)}
                          </td>
                          <td
                            className={cn(
                              'px-2 py-1.5 whitespace-nowrap',
                              profitCls(Number(order.profit)),
                            )}
                          >
                            {formatMoney(order.profit, data.currency) || '-'}
                          </td>
                          <td className="px-2 py-1.5 whitespace-nowrap">
                            {formatMoney(order.rebate, data.rebateCurrency) || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground py-6 text-center text-sm">
                {t('riskControlPage.orderModalNoOrders')}
              </div>
            )}
          </>
        )}
      </div>
    </RrhDialog>
  );
};
