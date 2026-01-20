import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';

export const SelectMethod = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'operationType'>;
  verticalLabel?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <FormItem>
      <div className={cn('text-foreground text-sm', verticalLabel ? '' : 'flex items-center')}>
        <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>
          {t('table.inMethod')}
        </FormLabel>
        <FormControl>
          <RrhSwitchGroup
            value={field.value ?? '0'}
            onValueChange={value => {
              field.onChange(value);
            }}
            labelClassName="font-medium"
            switchItems={[
              {
                value: '0',
                label: t('table.Deposit'),
              },
              {
                value: '1',
                label: t('table.Withdrawal'),
              },
              {
                value: '2',
                label: t('table.creditAmountDeposit'),
              },
              {
                value: '3',
                label: t('table.creditAmountWithdrawal'),
              },
            ]}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
