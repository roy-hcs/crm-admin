import { RrhCard } from '@/components/common/RrhCard';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormControl, FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cappedTimeUnitThreeOptions } from '@/lib/const';
import { useTranslation } from 'react-i18next';
import { PointsMallSettingsFormValues } from '../types';
import { CappedPointsWithUnitFields } from './CappedPointsWithUnitFields';

export function PointConfigCard3({ editable }: { editable: boolean }) {
  const { t } = useTranslation();

  return (
    <RrhCard>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.inviteRegister')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.inviteRegisterDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormInputWithUnit<PointsMallSettingsFormValues>
              name="inviteRegister.bonusPoints"
              unit={`${t('common.points')}/${t('common.piece')}`}
              label={t('pointsMallSettings.rewardCalculation')}
              disabled={!editable}
            />
            <CappedPointsWithUnitFields
              cappedPointsName="inviteRegister.cappedPoints"
              cappedTimeUnitName="inviteRegister.cappedTimeUnit"
              timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
              editable={editable}
              pointsUnit={t('common.points')}
            />
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.inviteOpenAccount')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.inviteOpenAccountDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormInputWithUnit<PointsMallSettingsFormValues>
              name="inviteOpenAccount.bonusPoints"
              unit={`${t('common.points')}/${t('common.piece')}`}
              label={t('pointsMallSettings.rewardCalculation')}
              disabled={!editable}
            />
            <CappedPointsWithUnitFields
              cappedPointsName="inviteOpenAccount.cappedPoints"
              cappedTimeUnitName="inviteOpenAccount.cappedTimeUnit"
              timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
              editable={editable}
              pointsUnit={t('common.points')}
            />
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <FormField
              name="inviteOpenAccount.multipleRewards"
              render={({ field }) => (
                <FormControl>
                  <div className="flex items-center gap-4">
                    <div className="grid flex-1 gap-1">
                      <div className="text-secondary-foreground text-sm leading-5 font-medium">
                        {t('pointsMallSettings.multipleRewards')}
                      </div>
                      <div className="text-muted-foreground text-sm leading-5">
                        {t('pointsMallSettings.multipleRewardsDesc')}
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
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.inviteDeposit')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.inviteDepositDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormInputWithUnit<PointsMallSettingsFormValues>
              name="inviteDeposit.bonusPoints"
              unit={`${t('common.points')}/${t('common.piece')}`}
              label={t('pointsMallSettings.rewardCalculation')}
              disabled={!editable}
            />
            <CappedPointsWithUnitFields
              cappedPointsName="inviteDeposit.cappedPoints"
              cappedTimeUnitName="inviteDeposit.cappedTimeUnit"
              timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
              editable={editable}
              pointsUnit={t('common.points')}
            />
          </div>
        </div>
      </div>
    </RrhCard>
  );
}
