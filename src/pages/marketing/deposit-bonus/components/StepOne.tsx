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
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { RrhButton } from '@/components/common/RrhButton';
import { useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import {
  applyInputNormalizer,
  normalizePositiveDecimalInput,
  normalizePositiveDecimalTwoPlacesInput,
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
  const MIN_LADDER_COUNT = 2;
  const MAX_LADDER_COUNT = 5;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ladderBonusList',
  });

  const serverIdValue = form.watch('serverId');
  const accountLimitTypeValue = form.watch('accountLimitType');
  const timeRangeTypeValue = form.watch('timeRangeType');
  const bonusTypeValue = form.watch('bonusType');
  const bonusModeValue = form.watch('bonusMode');
  const ladderBonusListValue = form.watch('ladderBonusList');

  const createEmptyLadderItem = (): FormValues['ladderBonusList'][number] => ({
    id: '',
    rewardId: '',
    startAmount: '',
    endAmount: '',
    bonusScale: '',
    bonusFixed: '',
  });

  useEffect(() => {
    if (bonusModeValue !== '2') return;
    if (fields.length >= MIN_LADDER_COUNT) return;

    const missingCount = MIN_LADDER_COUNT - fields.length;
    append(Array.from({ length: missingCount }, createEmptyLadderItem));
  }, [append, bonusModeValue, fields.length]);

  useEffect(() => {
    const ladderList = ladderBonusListValue || [];

    if (bonusModeValue !== '2') return;
    if (ladderList.length < 2) return;

    for (let i = 0; i < ladderList.length - 1; i++) {
      const currentEnd = ladderList[i]?.endAmount;
      const nextStart = ladderList[i + 1]?.startAmount;

      if (String(currentEnd ?? '') === String(nextStart ?? '')) continue;

      form.setValue(`ladderBonusList.${i}.endAmount`, nextStart as never, {
        shouldDirty: true,
      });
    }
  }, [bonusModeValue, form, ladderBonusListValue]);

  const canAddLadder = fields.length < MAX_LADDER_COUNT;
  const canRemoveLadder = fields.length > MIN_LADDER_COUNT;

  const handleAddLadder = () => {
    if (!canAddLadder) return;
    append(createEmptyLadderItem());
  };

  const handleRemoveLadder = () => {
    if (!canRemoveLadder) return;
    remove(fields.length - 1);
  };

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
        options={bonusOptions.filter(i => i.value === '1' || i.value === '3')} // 目前仅展示入金相关的业务类型
        name="businessType"
        showRowValue={false}
        placeholder={t('common.pleaseSelect')}
        disabled={mode === 'edit'}
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

      <FormInput
        name="minimumAmount"
        label={t('rewardConfigPage.minimumAmount')}
        placeholder={t('rules.enterPositiveInteger')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.minimumAmountDesc')}
          </div>
        }
        onInput={event => applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)}
      />

      <FormSwitchGroup
        name="limitType"
        label={t('rewardConfigPage.limitType')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.limitTypeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.limitTypeOptions.2'),
          },
        ]}
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
        name="bonusScheme"
        label={t('rewardConfigPage.bonusScheme')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.bonusSchemeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.bonusSchemeOptions.2'),
          },
        ]}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.bonusSchemeDesc')}
          </div>
        }
      />

      <FormSelect
        name="rewardType"
        label={t('rewardConfigPage.rewardType')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          {
            value: '1',
            label: t('rewardConfigPage.rewardTypeOptions.1'),
          },
        ]}
      />

      <FormSwitchGroup
        name="bonusType"
        label={t('rewardConfigPage.bonusType')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.bonusTypeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.bonusTypeOptions.2'),
          },
        ]}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.bonusTypeDesc')}
          </div>
        }
      />

      <FormSwitchGroup
        name="bonusMode"
        label={t('rewardConfigPage.bonusMode')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.bonusModeOptions.1'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.bonusModeOptions.2'),
          },
        ]}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.bonusModeDesc')}
          </div>
        }
      />

      {bonusModeValue === '1' && bonusTypeValue === '1' && (
        <FormInputWithUnit
          label={t('rewardConfigPage.bonusModeOptions.1')}
          name="bonusPercentage"
          unit="%"
          placeholder={t('common.pleaseInput', {
            field: t('rewardConfigPage.bonusTypeOptions.1'),
          })}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('rewardConfigPage.bonusAmountFormula')}
            </div>
          }
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveDecimalTwoPlacesInput)
          }
        />
      )}
      {bonusModeValue === '1' && bonusTypeValue === '2' && (
        <FormInput
          label={t('rewardConfigPage.bonusModeOptions.1')}
          name="bonusAmount"
          placeholder={t('common.pleaseInput', {
            field: t('rewardConfigPage.bonusTypeOptions.2'),
          })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
      )}

      {bonusModeValue === '2' && (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormLabel>{t('rewardConfigPage.bonusModeOptions.2')}</FormLabel>
              <div className="text-muted-foreground text-xs leading-4">
                {t('rewardConfigPage.bonusMode2Desc')}
              </div>
            </div>
            <div className="flex gap-2">
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                disabled={!canAddLadder}
                onClick={handleAddLadder}
              >
                +
              </RrhButton>
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                disabled={!canRemoveLadder}
                onClick={handleRemoveLadder}
              >
                -
              </RrhButton>
            </div>
          </div>
          <FormControl>
            <div className="grid gap-4 rounded-md border p-4">
              <div className="grid gap-2">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-end gap-2">
                    <div className="flex-1">
                      <FormInput
                        name={`ladderBonusList.${index}.startAmount`}
                        label={t('common.amountRange')}
                        placeholder={t('rewardConfigPage.min')}
                        onInput={event =>
                          applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        name={`ladderBonusList.${index}.endAmount`}
                        placeholder={t('rewardConfigPage.max')}
                        disabled={
                          index === fields.length - 1 // 仅最后一个区间的结束金额允许输入，其他区间的结束金额由下一个区间的开始金额决定
                        }
                        onInput={event =>
                          applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      {bonusTypeValue === '1' ? (
                        <FormInputWithUnit
                          label={t('table.percentage')}
                          name={`ladderBonusList.${index}.bonusScale`}
                          unit="%"
                          placeholder={t('common.pleaseInput', {
                            field: t('table.percentage'),
                          })}
                          onInput={event =>
                            applyInputNormalizer(event.currentTarget, value =>
                              normalizePositiveDecimalInput(value, 4),
                            )
                          }
                        />
                      ) : (
                        <FormInput
                          name={`ladderBonusList.${index}.bonusFixed`}
                          placeholder={t('common.pleaseInput', {
                            field: t('rewardConfigPage.bonusTypeOptions.2'),
                          })}
                          onInput={event =>
                            applyInputNormalizer(event.currentTarget, value =>
                              normalizePositiveDecimalInput(value, 4),
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
      )}

      <FormInput
        name="amountCapped"
        label={t('rewardConfigPage.amountCapped')}
        placeholder={t('common.pleaseInput', {
          field: t('rewardConfigPage.amountCapped'),
        })}
        onInput={event =>
          applyInputNormalizer(event.currentTarget, normalizePositiveDecimalTwoPlacesInput)
        }
      />
    </div>
  );
}
