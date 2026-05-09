import { DepositReviewDetailRes, DepositDetail, DepositVerifyParams } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { FormField } from '@/components/ui/form';
import { CircleAlert, Repeat } from 'lucide-react';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { UseFormReturn } from 'react-hook-form';
import { ImageZoom } from '@/components/common/ImageZoom';
import { ToolTip } from '@/components/common/ToolTip';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';

export const DepositInfoCard: FC<{
  depositData: DepositReviewDetailRes['data'];
  isAudit: boolean;
  form: UseFormReturn<DepositVerifyParams>;
}> = ({ depositData, isAudit, form }) => {
  const depositInfo: DepositDetail = depositData.detail;
  const directBroker = depositData.directBroker;

  const { t } = useTranslation();

  const depositChannelsInfo = useMemo(() => {
    // 入金账户信息
    return [
      {
        label: 'table.fullName',
        value: `${depositInfo.userLastName} ${depositInfo.userName}`,
      },
      {
        label: 'table.userShowId',
        value: depositInfo.userShowId,
      },
    ];
  }, [depositInfo]);

  return (
    <RrhCard title={t('depositReview.depositInfo')} className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <FormField
          name="depositAccount"
          disabled
          render={() => (
            <LabelItem
              label={
                <span className="flex items-center justify-between">
                  {t('table.depositAccount')}
                  <a href="#">{t('review.fundFlow')}</a>
                </span>
              }
              ContentDom={
                <>
                  {depositInfo.walletId && (
                    <InfoItem info={`${t('table.wallet')}(${depositData.walletCurrency})`} />
                  )}
                  {depositInfo.login && (
                    <InfoItem info={`${depositInfo.aliasName}/${depositInfo.login}`} />
                  )}
                </>
              }
            />
          )}
        />

        <FormField
          name="depositWay"
          disabled
          render={() => (
            <LabelItem
              label={t('table.depositWay')}
              ContentDom={<InfoItem info={depositInfo?.method} />}
            />
          )}
        />

        <div className="flex flex-col gap-2 py-3">
          <label className="text-sm font-medium">{t('table.payAmount')}</label>
          <div className="flex items-center gap-3">
            <FormField
              name="deposit"
              render={({ field }) => (
                <RrhInputWithUnit
                  unit={depositInfo.depositCurrency}
                  disabled
                  {...field}
                  value={field.value || 0}
                />
              )}
            />
            <Repeat className="size-4" />
            <FormField
              name="expectDeposit"
              render={({ field }) => (
                <>
                  <RrhInputWithUnit
                    unit={depositInfo.feeCurrency}
                    disabled
                    value={field.value || 0}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 py-3">
          <label className="text-sm font-medium">{t('table.receiptAmount')}</label>
          <div className="flex items-center gap-3">
            <FormField
              name="receiptAmount"
              render={({ field }) => (
                <RrhInputWithUnit
                  unit={depositInfo.depositCurrency}
                  disabled
                  {...field}
                  value={field.value ?? 0}
                />
              )}
            />
            <Repeat className="size-4" />
            <FormField
              name="receiptAmount"
              render={({ field }) => (
                <>
                  <RrhInputWithUnit
                    unit={depositInfo.feeCurrency}
                    disabled
                    value={field.value ?? 0}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>
        </div>

        <FormField
          name="factDeposit"
          render={({ field }) => (
            <LabelItem
              label={
                <span className="flex items-center gap-1">
                  {t('table.depositAmount')}
                  <ToolTip content={t('table.factDepositOfReceiptTip')}>
                    <CircleAlert className="text-muted-foreground size-4" />
                  </ToolTip>
                </span>
              }
              ContentDom={
                <RrhInputWithUnit
                  unit={depositInfo.feeCurrency}
                  value={field.value || 0}
                  disabled={!isAudit}
                  onChange={e => {
                    field.onChange(e.target.value);
                    form.setValue('factDeposit', e.target.value);
                  }}
                />
              }
            />
          )}
        />

        <FormField
          name="fee"
          render={({ field }) => (
            <LabelItem
              label={t('table.commission')}
              ContentDom={
                <RrhInputWithUnit
                  unit={depositInfo.feeCurrency}
                  disabled={true}
                  value={field.value}
                />
              }
            />
          )}
        />

        <FormField
          name="rate"
          render={({ field }) => (
            <LabelItem
              label={t('common.exchangeRate')}
              ContentDom={
                <RrhInputWithUnit
                  unit={depositInfo.currencyPair}
                  disabled={true}
                  value={field.value}
                />
              }
            />
          )}
        />

        <FormField
          name="remarks"
          disabled
          render={() => (
            <LabelItem
              label={t('table.remarks')}
              ContentDom={<InfoItem info={depositInfo.subRemark || '-'} />}
            />
          )}
        />

        <FormField
          name="voucher"
          disabled
          render={() => (
            <LabelItem
              label={t('table.voucher')}
              ContentDom={
                depositInfo.voucher ? (
                  <ImageZoom src={depositInfo.voucher} thumbnailClassName="w-10 h-10" />
                ) : (
                  <div>-</div>
                )
              }
            />
          )}
        />

        <FormField
          name="orderNumber"
          disabled
          render={() => (
            <LabelItem
              label={t('table.orderNumber')}
              ContentDom={<InfoItem info={depositInfo.orderNum || '-'} />}
            />
          )}
        />

        <FormField
          name="orderId"
          disabled
          render={() => (
            <LabelItem
              label={t('table.orderId')}
              ContentDom={<InfoItem info={depositInfo.orderId || '-'} />}
            />
          )}
        />

        <FormField
          name="channelName"
          disabled
          render={() => (
            <LabelItem
              label={t('table.channelName')}
              ContentDom={<InfoItem info={depositInfo.channelName || '-'} />}
            />
          )}
        />

        {depositInfo?.login && (
          <FormField
            name="directBroker"
            disabled
            render={() => (
              <LabelItem
                label={t('table.directAgent')}
                ContentDom={<InfoItem info={directBroker || '-'} />}
              />
            )}
          />
        )}

        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('table.accountInformation')}
          </h2>
          <FormField
            name="accountInfoPaymentCurrency"
            disabled
            render={() => (
              <LabelItem
                label={t('table.paymentCurrency')}
                ContentDom={<InfoItem info={depositInfo.depositCurrency} />}
              />
            )}
          />
          {depositChannelsInfo.map(item => (
            <LabelItem label={t(item.label)} ContentDom={<InfoItem info={item.value || '-'} />} />
          ))}
        </div>
      </div>
    </RrhCard>
  );
};
