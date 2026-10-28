import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

/**
 * 收款账户通用手续费设置区块
 * 适用于：加密货币 / PayID / 电汇汇款账户的新增编辑弹窗
 * 依赖表单字段：commissionMod
 */
export const CommissionSection = () => {
  const { t } = useTranslation();
  const commissionMod = useWatch({ name: 'commissionMod' });

  return (
    <div className="rounded-md border p-4 md:col-span-2">
      <div className="mb-4 text-sm font-medium">{t('receiveAccountsPage.commissionSection')}</div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <FormSelect
          name="restrictCurrency"
          label={t('receiveAccountsPage.restrictCurrency')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '0', label: t('receiveAccountsPage.restrictCurrencyNo') },
            { value: '1', label: t('receiveAccountsPage.restrictCurrencyYes') },
          ]}
        />
        <FormInput
          name="minDeposit"
          label={t('receiveAccountsPage.minDeposit')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.minDeposit') })}
        />
        <FormInput
          name="maxDeposit"
          label={t('receiveAccountsPage.maxDeposit')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.maxDeposit') })}
        />
        <FormSelect
          name="commissionMod"
          label={t('receiveAccountsPage.commissionMode')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '1', label: t('receiveAccountsPage.commissionByRate') },
            { value: '2', label: t('receiveAccountsPage.commissionFixed') },
          ]}
        />
        {commissionMod === '1' && (
          <>
            <FormInput
              name="commissionRate"
              label={t('receiveAccountsPage.commissionRate')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.commissionRate'),
              })}
            />
            <FormInput
              name="minCommission"
              label={t('receiveAccountsPage.minCommission')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.minCommission'),
              })}
            />
            <FormInput
              name="maxCommission"
              label={t('receiveAccountsPage.maxCommission')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.maxCommission'),
              })}
            />
          </>
        )}
        {commissionMod === '2' && (
          <FormInput
            name="fixCommission"
            label={t('receiveAccountsPage.fixCommission')}
            placeholder={t('common.pleaseInput', {
              field: t('receiveAccountsPage.fixCommission'),
            })}
          />
        )}
        <FormInput
          name="amountDigits"
          label={t('receiveAccountsPage.amountDigits')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.amountDigits') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
      </div>
    </div>
  );
};
