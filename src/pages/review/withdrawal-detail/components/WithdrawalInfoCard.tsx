import { useOutMoneyMethodList, WithdrawalReviewDetailRes, WithdrawItem } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { ToolTip } from '@/components/common/ToolTip';
import { FormField } from '@/components/ui/form';
import { CircleAlert, Repeat } from 'lucide-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoItem } from './InfoItem';
import { WithdrawalItem } from './WithdrawalItem';
import { InternationalTransferInfo } from './InternationalTransferInfo';
import { BankTransferInfo } from './BankTransferInfo';
import { CryptocurrencyInfo } from './CryptocurrencyInfo';
import { PayIdInfo } from './PayIdInfo';
import { EditableItem } from './EditableItem';
import { useEditableFields } from '@/hooks/useEditableFields';
import { AccountInfo } from './AccountInfo';
import { UseFormReturn } from 'react-hook-form';
import { WithdrawalFormData } from '../ReviewWithdrawalDetailPage';
type GeneralInfoField = 'dealTicket';
export const WithdrawalInfoCard: FC<{
  withdrawData: WithdrawalReviewDetailRes['data'];
  isAudit: boolean;
  form: UseFormReturn<WithdrawalFormData>;
}> = ({ withdrawData, isAudit, form }) => {
  const withdrawalInfo: WithdrawItem = withdrawData.detail;
  const { t } = useTranslation();
  const [currentRate, setCurrentRate] = useState(withdrawalInfo.rate?.toString() || '');
  const [currentFee, setCurrentFee] = useState(withdrawalInfo.fee);
  const [amountOfReceipt, setAmountOfReceipt] = useState('');
  const { data: outMoneyMethodList } = useOutMoneyMethodList();
  const calculateTargetWithdraw = useCallback(
    (withdraw: string) => {
      if (!currentRate || isNaN(Number(currentRate)) || Number(currentRate) <= 0) {
        return withdraw;
      }
      const originalCurrency = withdrawalInfo.currencyPair.split('/')[0];
      let targetWithdrawal = '';
      if (withdrawalInfo.withdrawCurrency === originalCurrency) {
        targetWithdrawal = (Number(withdraw) * Number(currentRate)).toFixed(5);
      } else {
        targetWithdrawal = (Number(withdraw) / Number(currentRate)).toFixed(5);
      }
      form.setValue('expectWithdraw', targetWithdrawal);
      return targetWithdrawal;
    },
    [currentRate, withdrawalInfo.currencyPair, form, withdrawalInfo.withdrawCurrency],
  );
  useEffect(() => {
    if (currentRate) {
      const originalCurrency = withdrawalInfo.currencyPair.split('/')[0];
      const withdrawal = Number(withdrawalInfo.withdraw);
      const fee = Number(currentFee);
      const rate = Number(currentRate);
      const isMinusFeeFirst = withdrawalInfo.feeCurrency === originalCurrency;
      const rawWithdrawalAmount = isMinusFeeFirst ? withdrawal - fee : withdrawal;
      const rawTargetAmount =
        withdrawalInfo.withdrawCurrency === originalCurrency
          ? rawWithdrawalAmount * rate
          : rawWithdrawalAmount / rate;
      const amountOfReceipt = isMinusFeeFirst ? rawTargetAmount : rawTargetAmount - fee;
      setAmountOfReceipt(amountOfReceipt.toFixed(5));
      form.setValue('amountOfReceipt', amountOfReceipt.toFixed(5));
    }
  }, [
    form,
    currentFee,
    currentRate,
    withdrawalInfo.currencyPair,
    withdrawalInfo.feeCurrency,
    withdrawalInfo.withdraw,
    withdrawalInfo.withdrawCurrency,
  ]);
  const methodName = useMemo(() => {
    return (
      outMoneyMethodList?.data?.find(item => item.id === withdrawalInfo.method?.toString())?.name ||
      '-'
    );
  }, [outMoneyMethodList?.data, withdrawalInfo?.method]);

  // 定义该模块的可编辑字段
  const editableKeys: GeneralInfoField[] = ['dealTicket'];

  // 初始化数据
  const initialData: Record<GeneralInfoField, string> = {
    dealTicket: withdrawalInfo.dealTicket || '',
  };

  // 使用 hook
  const { startEdit, updateEditingValue, cancelEdit, confirmEdit, getDisplayValue, isEditing } =
    useEditableFields<GeneralInfoField>(initialData, editableKeys);

  // 字段配置（用于渲染）
  const fieldConfigs: Array<{
    key: GeneralInfoField;
    label: string;
    name: string;
  }> = [{ key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' }];

  const setRate = (val: string) => {
    // 1. 过滤除了数字和小数点之外的所有字符
    let filtered = val.replace(/[^0-9.]/g, '');

    // 2. 确保只有一个小数点：保留第一个小数点，删除后续的小数点
    const parts = filtered.split('.');
    if (parts.length > 2) {
      filtered = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. 不允许以多个0开头（除非是0.xxx的形式）
    if (filtered.length > 1 && filtered[0] === '0' && filtered[1] !== '.') {
      filtered = filtered.replace(/^0+/, '0');
    }

    setCurrentRate(filtered);
    form.setValue('rate', filtered);
  };
  const handleRateBlur = () => {
    if (!currentRate) return;

    let value = currentRate.toString();

    // 移除开头的小数点
    if (value.startsWith('.')) {
      value = '0' + value;
    }

    // 移除末尾的小数点
    if (value.endsWith('.')) {
      value = value.slice(0, -1);
    }

    // 转换为数字进行验证
    const numValue = Number(value);

    // 确保是正数
    if (numValue <= 0 || isNaN(numValue)) {
      setCurrentRate(withdrawalInfo.rate.toString());
      form.setValue('rate', withdrawalInfo.rate.toString());
      return;
    }
    // 移除首位多余的0
    setCurrentRate(numValue.toString());
    form.setValue('rate', numValue.toString());
  };
  return (
    <RrhCard title={t('review.withdrawalInfo')} className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        {withdrawData.largeWithdrawAmountSingle ||
        withdrawData.orderTipSize ||
        withdrawData.shortorderTipSum ? (
          <div className="text-destructive bg-destructive/5 mb-4 flex gap-3 rounded-lg px-4 py-3">
            <CircleAlert className="text-destructive mt-0.5 size-4" />
            <div>
              <div className="font-medium">{t('review.orderAbnormalWarning')}</div>
              {withdrawData.largeWithdrawAmountSingle && (
                <div>
                  {t('review.largeWithdrawalWarning')}
                  {withdrawData.largeWithdrawAmountSingle}
                </div>
              )}
              {(withdrawData.orderTipSize || withdrawData.orderTipSum) && (
                <div>
                  {t('review.frequentWithdrawalWarning')}
                  {withdrawData.orderTipDays}
                  {t('review.withinDays')}
                  {withdrawData.orderTipSum && (
                    <>
                      ,{t('review.accumulatedWithdrawals')}
                      {withdrawData.orderTipSum}USD
                    </>
                  )}
                  {withdrawData.orderTipSize && (
                    <>
                      ,{t('review.accumulatedApplyWithdrawals')}
                      {withdrawData.orderTipSize}
                      {t('review.times')}
                    </>
                  )}
                </div>
              )}
              {withdrawData.shortorderTipSum && (
                <div>
                  {t('review.shortTimeLargeWithdrawalWarning')}
                  {withdrawData.shortorderTipDays}
                  {t('review.withinDays')}
                  {t('review.accumulatedWithdrawals')}
                  {withdrawData.shortorderTipSum}
                  USD
                </div>
              )}
            </div>
          </div>
        ) : null}
        <FormField
          name="withdrawalAccount"
          disabled
          render={() => (
            <WithdrawalItem
              label={
                <span className="flex items-center justify-between">
                  {t('table.withdrawAccount')}
                  <a href="#">{t('review.fundFlow')}</a>
                </span>
              }
              ContentDom={
                <>
                  {withdrawalInfo.walletId && (
                    <InfoItem info={`${t('table.wallet')}(${withdrawData.walletCurrency})`} />
                  )}
                  {withdrawalInfo.login && (
                    <InfoItem info={`${withdrawalInfo.aliasName}/${withdrawalInfo.login}`} />
                  )}
                </>
              }
            />
          )}
        />
        <FormField
          name="withdrawalWay"
          disabled
          render={() => (
            <WithdrawalItem
              label={t('table.withdrawMethods')}
              ContentDom={<InfoItem info={methodName} />}
            />
          )}
        />

        <div className="flex flex-col gap-2 py-3">
          <label className="text-sm font-medium">{t('table.withdrawAmount')}</label>
          <div className="flex items-center gap-3">
            <FormField
              name="withdrawAmount"
              render={({ field }) => (
                <RrhInputWithUnit
                  unit={withdrawalInfo.withdrawCurrency}
                  disabled
                  {...field}
                  value={field.value}
                />
              )}
            />
            <Repeat className="size-4" />
            <FormField
              name="expectWithdraw"
              render={({ field }) => (
                <>
                  <RrhInputWithUnit
                    unit={withdrawalInfo.targetCurrency}
                    disabled
                    value={field.value || calculateTargetWithdraw(withdrawalInfo.withdraw)}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>
        </div>
        <FormField
          name="commission"
          render={({ field }) => (
            <WithdrawalItem
              label={t('table.commission')}
              ContentDom={
                <RrhInputWithUnit
                  unit={withdrawalInfo.feeCurrency}
                  disabled={withdrawalInfo.status !== 2 || !isAudit}
                  value={field.value ?? currentFee}
                  onChange={e => {
                    field.onChange(e.target.value);
                    setCurrentFee(e.target.value);
                    form.setValue('commission', e.target.value);
                  }}
                />
              }
            />
          )}
        />
        <FormField
          name="rate"
          render={() => (
            <WithdrawalItem
              label={t('common.exchangeRate')}
              ContentDom={
                <RrhInputWithUnit
                  unit={withdrawalInfo.currencyPair}
                  disabled={!isAudit}
                  value={currentRate}
                  onChange={e => setRate(e.target.value)}
                  onBlur={handleRateBlur}
                />
              }
            />
          )}
        />
        <FormField
          name="amountOfReceipt"
          render={() => (
            <WithdrawalItem
              label={
                <span className="flex items-center gap-1">
                  {t('table.amountOfReceipt')}
                  <ToolTip content={t('table.amountOfReceiptTip')}>
                    <CircleAlert className="text-muted-foreground size-4" />
                  </ToolTip>
                </span>
              }
              ContentDom={
                <>
                  <RrhInputWithUnit
                    unit={withdrawalInfo.targetCurrency}
                    disabled={!isAudit}
                    value={!isAudit ? withdrawalInfo.factWithdraw || '' : amountOfReceipt}
                    onChange={e => setAmountOfReceipt(e.target.value)}
                  />
                </>
              }
            />
          )}
        />
        <FormField
          name="remarks"
          disabled
          render={() => (
            <WithdrawalItem
              label={t('table.remarks')}
              ContentDom={<InfoItem info={withdrawalInfo.subRemark || '-'} />}
            />
          )}
        />
        <FormField
          name="orderNumber"
          disabled
          render={() => (
            <WithdrawalItem
              label={t('table.orderNumber')}
              ContentDom={<InfoItem info={withdrawalInfo.orderNum || '-'} />}
            />
          )}
        />
        {withdrawalInfo.method === 1 && (
          <InternationalTransferInfo withdrawalInfo={withdrawalInfo} isAudit={isAudit} />
        )}
        {withdrawalInfo.method === 2 && (
          <BankTransferInfo
            withdrawalInfo={withdrawalInfo}
            isAudit={isAudit}
            directBroker={withdrawData.directBroker}
          />
        )}
        {withdrawalInfo.method === 6 && (
          <CryptocurrencyInfo withdrawalInfo={withdrawalInfo} isAudit={isAudit} />
        )}
        {withdrawalInfo.method === 13 && (
          <PayIdInfo withdrawalInfo={withdrawalInfo} isAudit={isAudit} />
        )}
        {![1, 2, 6, 13].includes(withdrawalInfo.method) &&
          fieldConfigs.map(({ key, label, name }) => (
            <FormField
              key={key}
              name={name}
              render={({ field }) => (
                <WithdrawalItem
                  label={label}
                  ContentDom={
                    <EditableItem
                      infoEditable={isEditing(key)}
                      info={getDisplayValue(key)}
                      isAudit={isAudit}
                      shadowInfo={getDisplayValue(key)}
                      setShadowInfo={val => updateEditingValue(key, val)}
                      onCancel={() => cancelEdit(key)}
                      onConfirm={() => confirmEdit(key)}
                      onEdit={() => startEdit(key)}
                      value={field.value}
                      onValueChange={e => field.onChange(e)}
                    />
                  }
                />
              )}
            />
          ))}
        <AccountInfo
          targetCurrency={withdrawalInfo.targetCurrency}
          withdrawalChannelsInfo={withdrawData.sysWithdrawChannelLanguages}
        />
      </div>
    </RrhCard>
  );
};
