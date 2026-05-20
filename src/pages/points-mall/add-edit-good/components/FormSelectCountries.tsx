import { FieldPath, FieldValues } from 'react-hook-form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { RrhButton } from '@/components/common/RrhButton';
import { ArrowRight } from 'lucide-react';
import { useChooseCountries } from '@/api/hooks/pointsMall';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { useState } from 'react';

interface FormSelectCountriesProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  className?: string;
  labeTipsDom?: React.ReactNode;
  description?: string;
}

export function FormSelectCountries<T extends FieldValues>({
  name,
  label,
  className,
  labeTipsDom,
  description,
}: FormSelectCountriesProps<T>) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<T>();
  const { data: countriesRes } = useChooseCountries();
  const [open, setOpen] = useState(false);
  const [draftCountries, setDraftCountries] = useState<string[]>([]);

  const parseCountries = (value: unknown) =>
    String(value ?? '')
      .split(',')
      .map((c: string) => c.trim())
      .filter((c: string) => c);

  const resetDraftFromField = () => {
    const currentValue = form.getValues(name);
    setDraftCountries(parseCountries(currentValue));
  };

  const onCancel = () => {
    resetDraftFromField();
    setOpen(false);
  };
  const onConfirm = (onChange: (value: string) => void) => {
    onChange(draftCountries.join(','));
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedCountries = parseCountries(field.value);
        const allCountryIds = Array.from(
          new Set(
            (countriesRes?.data?.dataList ?? []).flatMap(continent =>
              continent.country.map(item => item.id.toString()),
            ),
          ),
        );

        return (
          <FormItem className={cn(className)}>
            {label && (
              <div className="flex gap-2">
                {label && <FormLabel>{label}</FormLabel>}
                {labeTipsDom && <div>{labeTipsDom}</div>}
              </div>
            )}
            <FormControl>
              <RrhDialog
                title={t('products.countryIdPlaceholder')}
                onCancel={onCancel}
                onConfirm={() => onConfirm(field.onChange)}
                open={open}
                onOpenChange={nextOpen => {
                  if (nextOpen) {
                    resetDraftFromField();
                    setOpen(true);
                    return;
                  }

                  onCancel();
                }}
                trigger={
                  <div className={cn('flex h-9 basis-9/12 items-center rounded-md border')}>
                    <Input
                      className="flex-1 border-0 ring-0 outline-0"
                      type="text"
                      readOnly
                      placeholder={t('common.pleaseSelect')}
                      value={t('products.countryIdSelected', {
                        fields: selectedCountries.length,
                      })}
                    />
                    <RrhButton variant="ghost" className="rounded-l-none" type="button">
                      {t('common.select')}
                      <ArrowRight />
                    </RrhButton>
                  </div>
                }
                variant="large"
              >
                <div className="grid gap-2">
                  <div className="flex items-center justify-end gap-2">
                    <RrhButton
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDraftCountries(allCountryIds)}
                    >
                      {t('common.selectAll')}
                    </RrhButton>
                    <RrhButton
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDraftCountries([])}
                    >
                      {t('common.Reset')}
                    </RrhButton>
                  </div>
                  {countriesRes?.data?.dataList.map((i, index) => {
                    return (
                      <div key={index} className="grid gap-2">
                        <div className="text-foreground font-medium">{i.continent}</div>
                        <div>
                          <RrhSwitchGroup
                            multiple
                            values={draftCountries}
                            onValuesChange={nextValues => {
                              setDraftCountries(nextValues);
                            }}
                            labelClassName="font-medium"
                            switchItems={i.country.map(j => ({
                              label: j.countryName,
                              value: j.id.toString(),
                            }))}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RrhDialog>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
