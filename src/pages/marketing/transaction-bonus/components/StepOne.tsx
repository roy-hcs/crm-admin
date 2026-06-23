import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { FormSwitch } from '@/components/form/FormSwitch';
import { SelectOption } from '@/api/types';
import { useCrmFormContext } from '@/contexts/form';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import type { FormValues } from '../types';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { FormCrmGroupMultiSelect } from '@/components/form/FormCrmGroupMultiSelect';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { useEffect } from 'react';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
  normalizeSortInput,
} from '../../shared/value';

type ServerOptionsType = BaseOption & {
  serviceProperty: number;
  serviceType: number;
};

export function StepOne({
  bonusOptions,
  selectedRoleOptions = [],
  serverOptions = [],
  businessTimeTypeOptions = [],
  mode,
}: {
  bonusOptions: SelectOption[];
  selectedUserOptions?: BaseOption[];
  selectedRoleOptions?: BaseOption[];
  selectedAccountOptions?: BaseOption[];
  selectedTagOptions?: BaseOption[];
  serverOptions?: ServerOptionsType[];
  businessTimeTypeOptions: SelectOption[];
  mode: string;
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();

  const serverIdValue = form.watch('serverId');
  const accountLimitTypeValue = form.watch('accountLimitType');
  const timeRangeTypeValue = form.watch('timeRangeType');
  const ladderBonusListValue = form.watch('ladderBonusList');

  useEffect(() => {
    const ladderList = ladderBonusListValue || [];

    if (ladderList.length < 2) return;

    for (let i = 0; i < ladderList.length - 1; i++) {
      const currentEnd = ladderList[i]?.endAmount;
      const nextStart = ladderList[i + 1]?.startAmount;

      if (String(currentEnd ?? '') === String(nextStart ?? '')) continue;

      form.setValue(`ladderBonusList.${i}.endAmount`, nextStart as never, {
        shouldDirty: true,
      });
    }
  }, [form, ladderBonusListValue]);

  return (
    <div className="grid gap-6">
      <FormInput
        name="rewardTitle"
        label={t('rewardConfigPage.activityName', { field: t('productCategories.zhName') })}
        placeholder={t('rules.limitLength', {
          field: 12,
        })}
        maxLength={12}
      />
      <FormInput
        name="sort"
        label={t('table.sort')}
        placeholder="0-9999"
        onInput={event => applyInputNormalizer(event.currentTarget, normalizeSortInput)}
      />
      <FormSwitch name="status" label={t('table.status')} />
      <FormSwitch
        name="toClientStatus"
        label={t('rewardConfigPage.toClientStatus')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.toClientStatusDesc')}
          </div>
        }
      />
      <FormSelect
        label={t('table.triggerBusiness')}
        options={bonusOptions.filter(i => i.value === '2')} // 目前仅展示交易相关的业务类型
        name="businessType"
        showRowValue={false}
        placeholder={t('common.pleaseSelect')}
        disabled={mode === 'edit'}
      />
      <FormSwitchGroup
        name="timeRangeType"
        label={t('rewardConfigPage.timeRangeType')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.timeRangeTypeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.timeRangeTypeOptions.2'),
          },
        ]}
      />

      {timeRangeTypeValue === '1' && (
        <div className="flex items-center gap-2">
          <FormSelect
            className="flex-1"
            name="businessTimeType"
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={businessTimeTypeOptions}
          />
          <FormInput
            className="flex-1"
            name="expire"
            placeholder={t('common.pleaseInput', {
              field: '',
            })}
            onInput={event =>
              applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
            }
          />
          <FormSelect
            className="flex-1"
            name="timeUnit"
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('rewardConfigPage.timeUnitOptions.1'),
                value: '1',
              },
              {
                label: t('rewardConfigPage.timeUnitOptions.2'),
                value: '2',
              },
              {
                label: t('rewardConfigPage.timeUnitOptions.3'),
                value: '3',
              },
            ]}
          />
        </div>
      )}

      {timeRangeTypeValue === '2' && (
        <FormDateRangeInput name="activityTime" control={form.control} />
      )}
      <FormSwitchGroup
        name="accountLimitType"
        label={t('rewardConfigPage.accountLimitType')}
        switchItems={[
          {
            value: '0',
            label: t('rewardConfigPage.accountLimitTypeOptions.0'),
          },
          {
            value: '1',
            label: t('rewardConfigPage.accountLimitTypeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.accountLimitTypeOptions.2'),
          },
        ]}
      />
      {accountLimitTypeValue === '1' && (
        <FormCrmRoleMultiSelect<FormValues>
          verticalLabel
          name="crmRoleIds"
          label={t('rewardConfigPage.accountLimitTypeOptions.1')}
          initialOptions={selectedRoleOptions}
        />
      )}
      {accountLimitTypeValue === '2' && (
        <FormItem>
          <FormLabel>{t('rewardConfigPage.accountLimitTypeOptions.2')}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <FormSelect
                className="flex-1"
                name="serverId"
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={serverOptions}
              />
              <FormCrmGroupMultiSelect<FormValues>
                className="flex-1"
                name="serverGroupIds"
                label=""
                verticalLabel={false}
                placeholder={t('common.pleaseSelect')}
                serverId={serverIdValue || ''}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    </div>
  );
}
