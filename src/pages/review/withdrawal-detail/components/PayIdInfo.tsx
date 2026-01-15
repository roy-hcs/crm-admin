import { FC } from 'react';
import { FormField } from '@/components/ui/form';
import { EditableItem } from '@/components/common/EditableItem';
import { useTranslation } from 'react-i18next';
import { InfoItem } from '../../../../components/common/InfoItem';
import { useEditableFields } from '@/hooks/useEditableFields';
import { WithdrawItem } from '@/api/hooks/review';
import { LabelItem } from '@/components/common/LabelItem';

type PayIdInfoField = 'dealTicket';

interface Props {
  withdrawalInfo: WithdrawItem;
  isAudit: boolean;
}

export const PayIdInfo: FC<Props> = ({ withdrawalInfo, isAudit }) => {
  const { t } = useTranslation();

  // 定义该模块的可编辑字段
  const editableKeys: PayIdInfoField[] = ['dealTicket'];

  // 初始化数据
  const initialData: Record<PayIdInfoField, string> = {
    dealTicket: withdrawalInfo.dealTicket || '',
  };

  // 使用 hook
  const { startEdit, updateEditingValue, cancelEdit, confirmEdit, getDisplayValue, isEditing } =
    useEditableFields<PayIdInfoField>(initialData, editableKeys);

  // 字段配置（用于渲染）
  const fieldConfigs: Array<{
    key: PayIdInfoField;
    label: string;
    name: string;
  }> = [{ key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' }];

  const fixedFieldConfigs: Array<{
    key: string;
    label: string;
    name: string;
    value: string;
  }> = [
    {
      key: 'paymentCurrency',
      label: t('table.paymentCurrency'),
      name: 'paymentCurrency',
      value: withdrawalInfo.targetCurrency || '',
    },
    {
      key: 'payIdPhone',
      label: t('table.payIdPhone'),
      name: 'payIdPhone',
      value: withdrawalInfo.accountMobile || '',
    },
    {
      key: 'payIdEmail',
      label: t('table.payIdEmail'),
      name: 'payIdEmail',
      value: withdrawalInfo.accountEmail || '',
    },
    {
      key: 'payIdABN',
      label: t('table.payIdABN'),
      name: 'payIdABN',
      value: withdrawalInfo.abnCode || '',
    },
    {
      key: 'isDeduction',
      label: t('table.isDeduction'),
      name: 'isDeduction',
      value: withdrawalInfo.isWithdraw === 1 ? t('common.yes') : t('common.no'),
    },
  ];

  return (
    <>
      {fixedFieldConfigs.map(({ key, label, name, value }) => (
        <FormField
          key={key}
          name={name}
          render={() => <LabelItem label={label} ContentDom={<InfoItem info={value} />} />}
        />
      ))}
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
    </>
  );
};
