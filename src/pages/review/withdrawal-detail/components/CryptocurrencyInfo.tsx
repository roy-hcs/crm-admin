import { FC } from 'react';
import { FormField } from '@/components/ui/form';
import { EditableItem } from './EditableItem';
import { useTranslation } from 'react-i18next';
import { WithdrawalItem } from './WithdrawalItem';
import { InfoItem } from './InfoItem';
import { useEditableFields } from '@/hooks/useEditableFields';
import { WithdrawItem } from '@/api/hooks/review';
import { RrhButton } from '@/components/common/RrhButton';
import { Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhQrCode } from '@/components/common/RrhQrCode';

type CryptocurrencyInfoField = 'dealTicket';

interface Props {
  withdrawalInfo: WithdrawItem;
  isAudit: boolean;
}

export const CryptocurrencyInfo: FC<Props> = ({ withdrawalInfo, isAudit }) => {
  const { t } = useTranslation();
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('common.copied'));
  };

  // 定义该模块的可编辑字段
  const editableKeys: CryptocurrencyInfoField[] = ['dealTicket'];

  // 初始化数据
  const initialData: Record<CryptocurrencyInfoField, string> = {
    dealTicket: withdrawalInfo.dealTicket || '',
  };

  // 使用 hook
  const { startEdit, updateEditingValue, cancelEdit, confirmEdit, getDisplayValue, isEditing } =
    useEditableFields<CryptocurrencyInfoField>(initialData, editableKeys);

  // 字段配置（用于渲染）
  const fieldConfigs: Array<{
    key: CryptocurrencyInfoField;
    label: string;
    name: string;
  }> = [{ key: 'dealTicket', label: t('table.tradeServerOrderNumber'), name: 'dealTicket' }];

  const fixedFieldConfigs: Array<{
    key: string;
    label: string;
    name: string;
    value: string;
    copyable?: boolean;
  }> = [
    {
      key: 'paymentCurrency',
      label: t('table.paymentCurrency'),
      name: 'paymentCurrency',
      value: withdrawalInfo.targetCurrency || '',
      copyable: false,
    },
    {
      key: 'network',
      label: t('table.network'),
      name: 'network',
      value: withdrawalInfo.withdrawBank || '',
      copyable: false,
    },
    {
      key: 'paymentAddress',
      label: t('table.paymentAddress'),
      name: 'paymentAddress',
      value: withdrawalInfo.withdrawBankAddress || '',
      copyable: true,
    },
    {
      key: 'isDeduction',
      label: t('table.isDeduction'),
      name: 'isDeduction',
      value: withdrawalInfo.isWithdraw === 1 ? t('common.yes') : t('common.no'),
      copyable: false,
    },
  ];

  return (
    <>
      {fixedFieldConfigs.map(({ key, label, name, value, copyable }) => (
        <FormField
          key={key}
          name={name}
          render={() => (
            <WithdrawalItem
              label={label}
              ContentDom={
                copyable ? (
                  <div className="flex gap-1">
                    <InfoItem info={value} />
                    <RrhButton variant="ghost" className="size-6" onClick={() => copyText(value)}>
                      <Copy className="size-4" />
                    </RrhButton>
                    <RrhDialog
                      trigger={
                        <RrhButton variant="ghost" className="size-6">
                          <QrCode className="size-4" />
                        </RrhButton>
                      }
                      title={t('common.qrcode')}
                      footerShow={false}
                      className="w-45"
                    >
                      <RrhQrCode value={value} />
                    </RrhDialog>
                  </div>
                ) : (
                  <InfoItem info={value} />
                )
              }
            />
          )}
        />
      ))}
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
    </>
  );
};
