import { RrhCard } from '@/components/common/RrhCard';
import { crmAccountTypeOptions } from '@/lib/const';
import { useCrmFormContext } from '@/contexts/form';
import { useTranslation } from 'react-i18next';
import { SelectOption } from '@/api/types';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormCheckBoxGroup } from '@/components/form/FormCheckBoxGroup';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormStepper } from '@/components/form/FormStepper';
import { BaseConfigCard4 } from './BaseConfigCard4';
import { BaseConfigCard3 } from './BaseConfigCard3';
import { GroupItem } from '../NetBonusRewardConfigPage';

type BaseConfigFormValues = {
  rewardTarget: string[];
  status: string;
  selected: string[];
  depositSubType: string[];
  withdrawSelected: string[];
  withdrawSubType: string[];
  dataStatisticsTimeRange: number;
  autoReview: number;
  fixedParams: Array<{
    userId: string;
    userLabel?: string;
    rewardParam: string;
    type: string;
  }>;
  agentRewardIntervals: GroupItem[];
  salesRewardIntervals: GroupItem[];
  businessRewardIntervals: GroupItem[];
};

export function BaseConfig({
  editable,
  sysDepositOptions,
  sysWithdrawOptions,
}: {
  editable: boolean;
  sysDepositOptions: SelectOption[];
  sysWithdrawOptions: SelectOption[];
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<BaseConfigFormValues>();
  const selected = form.watch('selected') || [];
  const hasSysDeposit = selected.includes('2');
  const withdrawSelected = form.watch('withdrawSelected') || [];
  const hasSysWithdraw = withdrawSelected.includes('2');

  return (
    <div className="grid gap-6">
      <RrhCard>
        <div className="grid gap-4">
          <div className="text-secondary-foreground text-lg leading-7 font-semibold">
            {t('netBonusRewardConfig.baseInfo')}
          </div>
          <div className="grid gap-6">
            <FormMultiSelect
              verticalLabel
              name="rewardTarget"
              label={t('netBonusRewardConfig.rewardTarget')}
              placeholder={t('common.pleaseSelect')}
              disabled={!editable}
              options={crmAccountTypeOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  {t('netBonusRewardConfig.rewardTargetDesc')}
                </div>
              }
            />
            <FormSwitch name="status" label={t('common.enable')} disabled={!editable} />
          </div>
        </div>
      </RrhCard>

      <RrhCard>
        <div className="grid gap-4">
          <div className="text-secondary-foreground text-lg leading-7 font-semibold">
            {t('netBonusRewardConfig.fundsStatisticsRewards')}
          </div>
          <div className="grid gap-6">
            <FormCheckBoxGroup
              label={t('netBonusRewardConfig.fundDepositStatistics')}
              name="selected"
              valueType="array"
              options={[
                {
                  label: t('netBonusRewardConfig.crmDeposit'),
                  value: '1',
                  disabled: !editable,
                },
                {
                  label: t('netBonusRewardConfig.sysDeposit'),
                  value: '2',
                  disabled: !editable,
                },
              ]}
              checkGroupClassName="grid grid-cols-2 gap-x-0 gap-y-4"
              checkItemClassName="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 size-3.5"
            />
            {hasSysDeposit && (
              <FormMultiSelect
                verticalLabel
                name="depositSubType"
                placeholder={t('common.pleaseSelect')}
                disabled={!editable}
                options={sysDepositOptions}
              />
            )}
            <FormCheckBoxGroup
              label={t('netBonusRewardConfig.fundWithdrawalStatistics')}
              name="withdrawSelected"
              valueType="array"
              options={[
                {
                  label: t('netBonusRewardConfig.crmWithdraw'),
                  value: '1',
                  disabled: !editable,
                },
                {
                  label: t('netBonusRewardConfig.sysWithdraw'),
                  value: '2',
                  disabled: !editable,
                },
              ]}
              checkGroupClassName="grid grid-cols-2 gap-x-0 gap-y-4"
              checkItemClassName="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 size-3.5"
            />
            {hasSysWithdraw && (
              <FormMultiSelect
                verticalLabel
                name="withdrawSubType"
                placeholder={t('common.pleaseSelect')}
                disabled={!editable}
                options={sysWithdrawOptions}
              />
            )}
            <FormStepper
              name="dataStatisticsTimeRange"
              label={t('netBonusRewardConfig.dataStatisticsTimeRange')}
              min={1}
              max={12}
              disabled={!editable}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  {t('customerTracking.statisticMonthStr')}
                </div>
              }
            />

            <FormSwitch
              name="autoReview"
              label={t('netBonusRewardConfig.autoReview')}
              disabled={!editable}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  {t('netBonusRewardConfig.autoReviewDesc')}
                </div>
              }
            />
          </div>
        </div>
      </RrhCard>

      <BaseConfigCard3 editable={editable} />
      <BaseConfigCard4 editable={editable} />
    </div>
  );
}
