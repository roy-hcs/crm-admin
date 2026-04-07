import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';

export const SelectType = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'serviceProperty'>;
  verticalLabel?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <FormItem>
      <div className={cn('text-foreground text-sm', verticalLabel ? '' : 'flex items-center')}>
        <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>
          {t('common.type')}
        </FormLabel>
        <FormControl>
          <RrhRadioGroup
            value={field.value ?? '1'}
            orientation="horizontal"
            onValueChange={value => {
              field.onChange(value);
            }}
            labelClassName="font-medium"
            radioItems={[
              {
                value: '1',
                label: t('common.live'),
              },
              {
                value: '2',
                label: t('common.demo'),
              },
            ]}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
