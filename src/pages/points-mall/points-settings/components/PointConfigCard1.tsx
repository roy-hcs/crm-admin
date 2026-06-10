import { RrhCard } from '@/components/common/RrhCard';
import { FormControl, FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

export function PointConfigCard1({ editable }: { editable: boolean }) {
  const { t } = useTranslation();

  return (
    <RrhCard>
      <div className="grid gap-6">
        <FormField
          name="productExchangeEnable"
          render={({ field }) => (
            <FormControl>
              <div className="flex items-center gap-4">
                <div className="grid flex-1 gap-1">
                  <div className="text-secondary-foreground text-sm leading-5 font-medium">
                    {t('pointsMallSettings.productExchangeEnable')}
                  </div>
                  <div className="text-muted-foreground text-sm leading-5">
                    {t('pointsMallSettings.productExchangeEnableDesc')}
                  </div>
                </div>
                <div>
                  <Switch
                    className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                    checked={field?.value === '1'}
                    disabled={!editable}
                    onClick={() => {
                      const newValue = field?.value === '1' ? '0' : '1';
                      field.onChange(newValue);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          )}
        />
        <FormField
          name="pointsDigits"
          render={({ field }) => (
            <FormControl>
              <div className="flex items-center gap-4 border-t pt-6">
                <div className="grid flex-1 gap-1">
                  <div className="text-secondary-foreground text-sm leading-5 font-medium">
                    {t('pointsMallSettings.pointsDigits')}
                  </div>
                  <div className="text-muted-foreground text-sm leading-5">
                    {t('pointsMallSettings.pointsDigitsDesc')}
                  </div>
                </div>
                <div>
                  <Switch
                    className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                    checked={field?.value === '1'}
                    disabled={!editable}
                    onClick={() => {
                      const newValue = field?.value === '1' ? '0' : '1';
                      field.onChange(newValue);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          )}
        />
      </div>
    </RrhCard>
  );
}
