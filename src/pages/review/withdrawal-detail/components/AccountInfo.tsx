import { ChannelFieldItem } from '@/api/hooks/review';
import { FormField } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { InfoItem } from '../../../../components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';

export const AccountInfo = ({
  targetCurrency,
  withdrawalChannelsInfo = [],
}: {
  targetCurrency: string;
  withdrawalChannelsInfo?: ChannelFieldItem[];
}) => {
  const { t } = useTranslation();
  return (
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
            ContentDom={<InfoItem info={targetCurrency} />}
          />
        )}
      />
      {withdrawalChannelsInfo.map(item => (
        <div key={item.id} className="flex flex-col gap-2 py-3">
          <label className="text-sm font-medium">{item.fieldName}</label>
          <div className="text-muted-foreground flex items-center gap-3">
            {item.type === 2 ? (
              <img
                className="w-37.5"
                src={item.fieldValue}
                alt={item.fieldName || ''}
                loading="lazy"
              />
            ) : (
              <span>{item.fieldValue}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
