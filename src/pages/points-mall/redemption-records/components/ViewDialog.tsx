import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { GoodDetailInfo, useExchangeDetailInfo } from '@/api/hooks/pointsMall';
import { pointsHistoryPayType } from '@/lib/const';
import { RrhTag } from '@/components/common/RrhTag';
import { withdrawalReviewStatusMap } from '@/lib/constant';

export const ViewDialog = ({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getDetailInfo } = useExchangeDetailInfo();
  const [detailsData, setDetailsData] = useState<GoodDetailInfo>();

  useEffect(() => {
    if (open && id) {
      async function fetchData() {
        const res = await getDetailInfo({ id: id || '' });
        if (res.code === 0) {
          setDetailsData(res.data);
        }
      }
      fetchData();
    }
  }, [getDetailInfo, open, id]);

  const dataList = useMemo(() => {
    const payMentPlan = pointsHistoryPayType.find(i => i.value === detailsData?.payType)?.label;

    return [
      {
        label: t('marketing.rewardRecords.rewardTarget'),
        value: `${detailsData?.userName}(${detailsData?.showId}) - ${detailsData?.email}`,
      },
      {
        label: t('redemptionRecords.goodsName'),
        value: `${detailsData?.goodsName} / ${detailsData?.goodsId}`,
      },
      {
        label: t('redemptionRecords.exchangeAccount'),
        value: detailsData?.exchangeAccount || '-',
        visible: detailsData?.goodsType === '1' && detailsData?.virtualGoodsType !== '1',
      },
      {
        label: t('redemptionRecords.payMent'),
        value: payMentPlan ? t(payMentPlan) : '-',
      },
      {
        label: t('redemptionRecords.pay'),
        type: 'pointsPayment',
        visible: detailsData?.payType === '1',
      },
      {
        label: t('redemptionRecords.pay'),
        type: 'combinedPayment',
        visible: detailsData?.payType === '2',
      },
      {
        label: t('redemptionRecords.receiveAddress'),
        value: `${detailsData?.receiveName} - ${detailsData?.receivePhone} / ${detailsData?.receiveAddress}`,
        visible: detailsData?.goodsType === '2',
      },
      {
        label: t('redemptionRecords.redemptionStatus'),
        type: 'redemptionStatus',
      },
      {
        label: t('table.remarks'),
        value: detailsData?.remark,
      },
    ].filter(item => item.visible !== false);
  }, [detailsData, t]);

  return (
    <RrhDialog
      title={t('common.View')}
      cancelText={t('common.close')}
      confirmShow={false}
      open={open}
      onOpenChange={setOpen}
      variant="middle"
    >
      <div className="grid grid-cols-1">
        {dataList.map((item, index) => {
          if (item.type === 'pointsPayment' || item.type === 'combinedPayment') {
            if (item.type === 'pointsPayment') {
              // 积分支付
              return (
                <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                  <div className="text-foreground text-sm leading-5 font-medium">{item.label}</div>
                  <div className="text-muted-foreground text-sm leading-5">
                    {detailsData?.exchangeType === '1'
                      ? `+${detailsData?.exchangePoints} / ${detailsData?.exchangeTime}`
                      : `-${detailsData?.exchangePoints} / ${detailsData?.exchangeTime}`}
                  </div>
                </div>
              );
            } else {
              // 组合支付
              return (
                <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                  <div className="text-foreground text-sm leading-5 font-medium">{item.label}</div>
                  <div className="bg-primary-foreground grid grid-cols-3 rounded-sm px-6 py-4">
                    <div className="grid gap-2">
                      <div className="text-muted-foreground text-xs leading-3">
                        {t('redemptionRecords.pointsDeduction')}
                      </div>
                      <div className="text-accent-foreground text-sm leading-5">
                        {detailsData?.exchangeType === '1'
                          ? `+${detailsData?.exchangePoints}`
                          : `-${detailsData?.exchangePoints}`}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="text-muted-foreground text-xs leading-3">
                        {t('redemptionRecords.paymentAmount')}
                      </div>
                      <div className="text-accent-foreground text-sm leading-5">
                        {detailsData?.paymentAmount
                          ? `${detailsData?.paymentAmount} ${detailsData?.currency || 'USD'}`
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          } else if (item.type === 'redemptionStatus') {
            // 审核状态
            const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info' | 'default'> = {
              0: 'error',
              1: 'success',
              2: 'warning',
              '-1': 'info',
              '-2': 'default',
            };
            return (
              <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                <div className="text-foreground text-sm leading-5 font-medium">{item.label}</div>
                <div>
                  <RrhTag
                    type={typeMap[Number(detailsData?.verifyStatus) || 0]}
                    key={`${item.label}-${index}`}
                  >
                    {t(`table.${withdrawalReviewStatusMap[detailsData?.verifyStatus || 0]}`)}
                  </RrhTag>
                </div>
              </div>
            );
          } else {
            // 其他
            return (
              <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                <div className="text-foreground text-sm leading-5 font-medium">{item.label}</div>
                <div className="text-muted-foreground text-sm leading-5">{item.value || '-'}</div>
              </div>
            );
          }
        })}
      </div>
    </RrhDialog>
  );
};
