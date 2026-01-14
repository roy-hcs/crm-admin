import { FC } from 'react';
import { FormField } from '@/components/ui/form';
import { EditableItem } from '@/components/common/EditableItem';
import { useTranslation } from 'react-i18next';
import { InfoItem } from '../../../../components/common/InfoItem';
import { useEditableFields } from '@/hooks/useEditableFields';
import { WithdrawItem } from '@/api/hooks/review';
import { LabelItem } from '@/components/common/LabelItem';

type InternationalTransferField =
  | 'paymentCurrency'
  | 'payee'
  | 'withdrawAccount'
  | 'withdrawAddress'
  | 'withdrawBank'
  | 'withdrawBankAddress'
  | 'swiftCode'
  | 'dealTicket';

interface Props {
  withdrawalInfo: WithdrawItem;
  isAudit: boolean;
}

export const InternationalTransferInfo: FC<Props> = ({ withdrawalInfo, isAudit }) => {
  const { t } = useTranslation();

  // 定义该模块的可编辑字段
  const editableKeys: InternationalTransferField[] = [
    'paymentCurrency',
    'payee',
    'withdrawAccount',
    'withdrawAddress',
    'withdrawBank',
    'withdrawBankAddress',
    'swiftCode',
    'dealTicket',
  ];

  // 初始化数据
  const initialData: Record<InternationalTransferField, string> = {
    paymentCurrency: withdrawalInfo.targetCurrency || '',
    payee: withdrawalInfo.withdrawUser || '',
    withdrawAccount: withdrawalInfo.withdrawAccount || '',
    withdrawAddress: withdrawalInfo.withdrawAddress || '',
    withdrawBank: withdrawalInfo.withdrawBank || '',
    withdrawBankAddress: withdrawalInfo.withdrawBankAddress || '',
    swiftCode: withdrawalInfo.swift || '',
    dealTicket: withdrawalInfo.dealTicket || '',
  };

  // 使用 hook
  const { startEdit, updateEditingValue, cancelEdit, confirmEdit, getDisplayValue, isEditing } =
    useEditableFields<InternationalTransferField>(initialData, editableKeys);

  // 字段配置（用于渲染）
  const fieldConfigs: Array<{
    key: InternationalTransferField;
    label: string;
    name: string;
  }> = [
    { key: 'paymentCurrency', label: t('table.paymentCurrency'), name: 'paymentCurrency' },
    { key: 'payee', label: t('table.payee'), name: 'payee' },
    { key: 'withdrawAccount', label: t('table.paymentAccount'), name: 'paymentAccount' },
    { key: 'withdrawAddress', label: t('table.payeeAddress'), name: 'payeeAddress' },
    { key: 'withdrawBank', label: t('table.paymentBank'), name: 'paymentBank' },
    {
      key: 'withdrawBankAddress',
      label: t('table.paymentBankAddress'),
      name: 'paymentBankAddress',
    },
    { key: 'swiftCode', label: t('table.swiftCode'), name: 'swiftCode' },
    { key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' },
  ];

  return (
    <>
      {fieldConfigs.map(({ key, label, name }) => (
        <FormField
          key={key}
          name={name}
          render={({ field }) => (
            <LabelItem
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
          <LabelItem
            label={t('table.isDeduction')}
            ContentDom={
              <InfoItem info={withdrawalInfo.isWithdraw === 1 ? t('common.yes') : t('common.no')} />
            }
          />
        )}
      />
    </>
  );
};
