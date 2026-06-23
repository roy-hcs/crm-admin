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
import { RrhSelect } from '@/components/common/RrhSelect';
import { cn } from '@/lib/utils';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import { RrhButton } from '@/components/common/RrhButton';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormCrmUserMultiSelect } from '@/components/form/FormCrmUserMultiSelect';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { FormCrmTagMultiSelect } from '@/components/form/FormCrmTagMultiSelect';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import {
  applyInputNormalizer,
  normalizePositiveDecimalTwoPlacesInput,
  normalizeSortInput,
} from '../../shared/value';

export function StepOne({
  bonusOptions,
  selectedUserOptions = [],
  selectedRoleOptions = [],
  selectedAccountOptions = [],
  selectedTagOptions = [],
}: {
  bonusOptions: SelectOption[];
  selectedUserOptions?: BaseOption[];
  selectedRoleOptions?: BaseOption[];
  selectedAccountOptions?: BaseOption[];
  selectedTagOptions?: BaseOption[];
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'triggers',
  });

  const { fields: levelAmountFields } = useFieldArray({
    control: form.control,
    name: 'levelAmounts',
  });

  const triggers =
    useWatch({
      control: form.control,
      name: 'triggers',
    }) || [];

  const triggerEventOptions = useMemo<SelectOption[]>(
    () => [
      {
        label: t('rewardConfigPage.triggersEventOptions.1'),
        value: '1',
      },
      {
        label: t('rewardConfigPage.triggersEventOptions.2'),
        value: '2',
      },
      {
        label: t('rewardConfigPage.triggersEventOptions.3'),
        value: '3',
      },
      {
        label: t('rewardConfigPage.triggersEventOptions.4'),
        value: '4',
      },
    ],
    [t],
  );

  const RewardConfigList = useMemo(
    () => [
      {
        label: t('rewardConfigPage.RewardConfigOptions.label1'),
        value: t('rewardConfigPage.RewardConfigOptions.value1'),
      },
      {
        label: t('rewardConfigPage.RewardConfigOptions.label2'),
        value: t('rewardConfigPage.RewardConfigOptions.value2'),
      },
      {
        label: t('rewardConfigPage.RewardConfigOptions.label3'),
        value: t('rewardConfigPage.RewardConfigOptions.value3'),
      },
    ],
    [t],
  );

  const triggerEventOrder = useMemo(() => ['1', '2', '3', '4'], []);

  const handleAddTrigger = () => {
    if (fields.length >= 4) return;
    const nextEvent = triggerEventOrder[fields.length] || '4';
    append({
      id: '',
      rewardId: '',
      event: nextEvent,
      symbol: nextEvent === '1' ? '=' : '>=',
      value: '',
    });
  };

  const handleRemoveTrigger = () => {
    if (fields.length <= 0) return;
    remove(fields.length - 1);
  };

  const accountLimitTypeValue = form.watch('accountLimitType');

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
        verticalLabel={false}
        options={bonusOptions}
        name="businessType"
        showRowValue={false}
        placeholder={t('common.pleaseSelect')}
        disabled
      />

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
            value: '3',
            label: t('rewardConfigPage.accountLimitTypeOptions.3'),
          },
          {
            value: '4',
            label: t('rewardConfigPage.accountLimitTypeOptions.4'),
          },
          {
            value: '5',
            label: t('rewardConfigPage.accountLimitTypeOptions.5'),
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
      {accountLimitTypeValue === '3' && (
        <FormCrmUserMultiSelect<FormValues>
          verticalLabel
          name="userIds"
          label={t('rewardConfigPage.accountLimitTypeOptions.3')}
          initialOptions={selectedUserOptions}
        />
      )}
      {accountLimitTypeValue === '4' && (
        <FormCrmUserMultiSelect<FormValues>
          verticalLabel
          name="accounts"
          label={t('rewardConfigPage.accountLimitTypeOptions.4')}
          initialOptions={selectedAccountOptions}
        />
      )}
      {accountLimitTypeValue === '5' && (
        <FormCrmTagMultiSelect<FormValues>
          verticalLabel
          name="tagIds"
          label={t('rewardConfigPage.accountLimitTypeOptions.5')}
          initialOptions={selectedTagOptions}
        />
      )}

      <FormDateRangeInput
        name="activityTime"
        label={t('rewardConfigPage.activityTime')}
        control={form.control}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.activityTimeDesc')}
          </div>
        }
      />

      <FormItem>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FormLabel>{t('rewardConfigPage.triggers')}</FormLabel>
            <div className="text-muted-foreground text-xs leading-4">
              {t('rewardConfigPage.triggersDesc')}
            </div>
          </div>
          <div className="flex gap-2">
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTrigger}
              disabled={fields.length >= 4}
            >
              +
            </RrhButton>
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveTrigger}
              disabled={fields.length <= 0}
            >
              -
            </RrhButton>
          </div>
        </div>
        <FormControl>
          <div className="grid gap-4 rounded-md border p-4">
            {/* 为了复用ui使用的选择组件 写死的数据 */}
            <RrhSelect
              options={[
                {
                  label: t('rewardConfigPage.registerSuccess'),
                  value: '1',
                },
              ]}
              value="1"
              className={cn(
                'w-full',
                'data-[disabled]:bg-muted data-[disabled]:text-muted-foreground data-[disabled]:border-muted-foreground/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-100',
              )}
              showRowValue={false}
              disabled
            />
            <div className="grid gap-2">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <FormSelect
                      verticalLabel={false}
                      options={triggerEventOptions.filter(
                        event => event.value === triggers[index]?.event,
                      )}
                      name={`triggers.${index}.event`}
                      showRowValue={false}
                      placeholder={t('common.pleaseSelect')}
                      disabled
                    />
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      options={
                        triggers[index]?.event === '1'
                          ? [
                              {
                                label: '=',
                                value: '=',
                              },
                            ]
                          : [
                              {
                                label: '>=',
                                value: '>=',
                              },
                              {
                                label: '=',
                                value: '=',
                              },
                            ]
                      }
                      name={`triggers.${index}.symbol`}
                      showRowValue={false}
                      placeholder={t('common.pleaseSelect')}
                    />
                  </div>
                  <div className="flex-1">
                    {triggers[index]?.event === '1' && (
                      <FormSelect
                        verticalLabel={false}
                        options={[
                          {
                            label: t('table.pass'),
                            value: '1',
                          },
                          {
                            label: t('table.pending'),
                            value: '-1',
                          },
                        ]}
                        name={`triggers.${index}.value`}
                        showRowValue={false}
                        placeholder={t('common.pleaseSelect')}
                      />
                    )}
                    {triggers[index]?.event === '2' && (
                      <FormInput
                        name={`triggers.${index}.value`}
                        placeholder={t('rules.enterPositiveInteger')}
                      />
                    )}
                    {(triggers[index]?.event === '3' || triggers[index]?.event === '4') && (
                      <FormInputWithUnit
                        verticalLabel={false}
                        name={`triggers.${index}.value`}
                        unit="USD"
                        placeholder={t('rules.enterAmount')}
                        onInput={event =>
                          applyInputNormalizer(
                            event.currentTarget,
                            normalizePositiveDecimalTwoPlacesInput,
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>{t('rewardConfigPage.RewardConfig')}</FormLabel>
        <FormControl>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {RewardConfigList.map((it, index) => {
              return (
                <div className="flex flex-col gap-2" key={index}>
                  <div className="flex items-center justify-between">
                    <div className="text-card-foreground text-sm leading-5 font-normal">
                      {it.label}
                    </div>
                  </div>
                  <div className="text-card-foreground truncate text-base leading-4 font-semibold">
                    {it.value}
                  </div>
                </div>
              );
            })}
          </div>
        </FormControl>
      </FormItem>

      <FormItem>
        <div className="flex items-center gap-2">
          <FormLabel>{t('table.rewardAmount')}</FormLabel>
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.rewardAmountDesc')}
          </div>
        </div>
        <FormControl>
          <div>
            {levelAmountFields.map((i, index) => (
              <div className="flex items-center gap-2" key={i.id}>
                <RrhButton className="h-10" type="button" variant="outline" size="sm" disabled>
                  {`Level${i.level}`}
                </RrhButton>
                <FormInputWithUnit
                  className="flex-1"
                  verticalLabel={false}
                  name={`levelAmounts.${index}.amount`}
                  unit="USD"
                  placeholder={t('rules.enterAmount')}
                  onInput={event =>
                    applyInputNormalizer(
                      event.currentTarget,
                      normalizePositiveDecimalTwoPlacesInput,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </FormControl>
      </FormItem>

      <FormItem>
        <div className="flex items-center gap-2">
          <FormLabel>{t('rewardConfigPage.maximumRewardLimit')}</FormLabel>
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.maximumRewardLimitDesc')}
          </div>
        </div>
        <FormControl>
          <div className="flex items-center gap-2">
            <FormInputWithUnit
              className="flex-1"
              label={t('rewardConfigPage.amountCapped')}
              name="amountCapped"
              unit="USD"
              placeholder={t('rules.enterAmount')}
              onInput={event =>
                applyInputNormalizer(event.currentTarget, normalizePositiveDecimalTwoPlacesInput)
              }
            />
            <FormSelect
              className="flex-1"
              label={t('rewardConfigPage.period')}
              options={[
                {
                  label: t('rewardConfigPage.periodOptions.1'),
                  value: '1',
                },
                {
                  label: t('rewardConfigPage.periodOptions.2'),
                  value: '2',
                },
                {
                  label: t('rewardConfigPage.periodOptions.3'),
                  value: '3',
                },
              ]}
              name="period"
              showRowValue={false}
              placeholder={t('common.pleaseSelect')}
            />
          </div>
        </FormControl>
      </FormItem>
    </div>
  );
}
