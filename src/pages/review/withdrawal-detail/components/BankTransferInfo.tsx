import { FC, useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { EditableItem } from './EditableItem';
import { useTranslation } from 'react-i18next';
import { WithdrawalItem } from './WithdrawalItem';
import { InfoItem } from './InfoItem';
import { useEditableFields } from '@/hooks/useEditableFields';
import { WithdrawItem } from '@/api/hooks/review';

type BankTransferField = string;

interface Props {
  withdrawalInfo: WithdrawItem;
  isAudit: boolean;
  directBroker: string;
}

export const BankTransferInfo: FC<Props> = ({ withdrawalInfo, isAudit, directBroker }) => {
  const { t } = useTranslation();

  // 根据货币类型动态生成字段配置
  const { editableKeys, initialData, fieldConfigs } = useMemo(() => {
    const currency = withdrawalInfo.targetCurrency;

    // INR货币配置
    if (currency === 'INR') {
      const keys: BankTransferField[] = [
        'paymentCurrency',
        'accountHolderName',
        'IFSCCode',
        'bankCardNumber',
        'dealTicket',
      ];

      const data: Record<BankTransferField, string> = {
        paymentCurrency: withdrawalInfo.targetCurrency || '',
        accountHolderName: withdrawalInfo.accountName || '',
        IFSCCode: withdrawalInfo.ifscCode || '',
        bankCardNumber: withdrawalInfo.cardNo || '',
        dealTicket: withdrawalInfo.dealTicket || '',
      };

      const configs: Array<{
        key: BankTransferField;
        label: string;
        name: string;
      }> = [
        { key: 'paymentCurrency', label: t('table.paymentCurrency'), name: 'paymentCurrency' },
        {
          key: 'accountHolderName',
          label: t('table.accountHolderName'),
          name: 'accountHolderName',
        },
        { key: 'IFSCCode', label: t('table.IFSCCode'), name: 'IFSCCode' },
        { key: 'bankCardNumber', label: t('table.bankCardNumber'), name: 'bankCardNumber' },
        { key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' },
      ];

      return { editableKeys: keys, initialData: data, fieldConfigs: configs };
    }

    // AUD货币配置
    if (currency === 'AUD') {
      const keys: BankTransferField[] = [
        'paymentCurrency',
        'accountHolderName',
        'BSBCode',
        'bankCardNumber',
        'dealTicket',
      ];

      const data: Record<BankTransferField, string> = {
        paymentCurrency: withdrawalInfo.targetCurrency || '',
        accountHolderName: withdrawalInfo.accountName || '',
        BSBCode: withdrawalInfo.bsbCode || '',
        bankCardNumber: withdrawalInfo.cardNo || '',
        dealTicket: withdrawalInfo.dealTicket || '',
      };

      const configs: Array<{
        key: BankTransferField;
        label: string;
        name: string;
      }> = [
        { key: 'paymentCurrency', label: t('table.paymentCurrency'), name: 'paymentCurrency' },
        {
          key: 'accountHolderName',
          label: t('table.accountHolderName'),
          name: 'accountHolderName',
        },
        { key: 'BSBCode', label: t('table.BSBCode'), name: 'BSBCode' },
        { key: 'bankCardNumber', label: t('table.bankCardNumber'), name: 'bankCardNumber' },
        { key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' },
      ];

      return { editableKeys: keys, initialData: data, fieldConfigs: configs };
    }

    // 默认配置（其他货币）
    const keys: BankTransferField[] = [
      'paymentCurrency',
      'accountHolderName',
      'accountHolderBank',
      'bankCardNumber',
      'branchName',
      'dealTicket',
    ];

    const data: Record<BankTransferField, string> = {
      paymentCurrency: withdrawalInfo.targetCurrency || '',
      accountHolderName: withdrawalInfo.accountName || '',
      accountHolderBank: withdrawalInfo.accountBank || '',
      bankCardNumber: withdrawalInfo.cardNo || '',
      branchName: withdrawalInfo.branchBank || '',
      dealTicket: withdrawalInfo.dealTicket || '',
    };

    const configs: Array<{
      key: BankTransferField;
      label: string;
      name: string;
    }> = [
      { key: 'paymentCurrency', label: t('table.paymentCurrency'), name: 'paymentCurrency' },
      { key: 'accountHolderName', label: t('table.accountHolderName'), name: 'accountHolderName' },
      { key: 'accountHolderBank', label: t('table.accountHolderBank'), name: 'accountHolderBank' },
      { key: 'bankCardNumber', label: t('table.bankCardNumber'), name: 'bankCardNumber' },
      { key: 'branchName', label: t('table.branchName'), name: 'branchName' },
      { key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' },
    ];

    return { editableKeys: keys, initialData: data, fieldConfigs: configs };
  }, [withdrawalInfo, t]);

  // 使用 hook
  const { startEdit, updateEditingValue, cancelEdit, confirmEdit, getDisplayValue, isEditing } =
    useEditableFields<BankTransferField>(initialData, editableKeys);

  return (
    <>
      {fieldConfigs.map(({ key, label, name }) => (
        <FormField
          key={key}
          name={name}
          render={({ field }) => (
            <WithdrawalItem
              label={label}
              ContentDom={
                <EditableItem
                  infoEditable={isEditing(key)}
                  info={getDisplayValue(key) || '-'}
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

      <FormField
        name="isDeduction"
        render={() => (
          <WithdrawalItem
            label={t('table.isDeduction')}
            ContentDom={
              <InfoItem info={withdrawalInfo.isWithdraw === 1 ? t('common.yes') : t('common.no')} />
            }
          />
        )}
      />
      <FormField
        name="directAgent"
        render={() => (
          <WithdrawalItem
            label={t('table.directAgent')}
            ContentDom={<InfoItem info={directBroker} />}
          />
        )}
      />
    </>
  );
};
