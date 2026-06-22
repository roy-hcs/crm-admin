import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { useCrmFormContext } from '@/contexts/form';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import type { FormValues } from '../types';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { useEffect, useState } from 'react';
import { serverMap } from '@/lib/constant';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { SelectMtTypeGroup } from '@/components/common/SelectMtTypeGroup';
import { RrhButton } from '@/components/common/RrhButton';
import { useFieldArray } from 'react-hook-form';

type ServerOptionsType = BaseOption & {
  serviceProperty: number;
  serviceType: number;
};

export function StepTwo({ serverOptions = [] }: { serverOptions: ServerOptionsType[] }) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();

  const MIN_LADDER_COUNT = 2;
  const MAX_LADDER_COUNT = 5;

  const createEmptyLadderItem = () => ({
    startAmount: '',
    endAmount: '',
    bonusScale: '',
    bonusFixed: '',
    dealNum: '',
    dealBasis: '',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ladderBonusList',
  });

  const [dealBreed, setDealBreed] = useState('1');
  const [stepRewardMode, setStepRewardMode] = useState('1');
  const ladderBonusListValue = form.watch('ladderBonusList');
  const limitTypeValue = form.watch('limitType');
  const dealBreedValue = form.watch('dealBreed');
  const dealServerValue = form.watch('dealServer');
  const bonusTypeValue = form.watch('bonusType');

  useEffect(() => {
    const ladderList = ladderBonusListValue || [];
    if (ladderList.length) {
      // 当存在阶梯奖励配置时，默认启用阶梯奖励模式
      setStepRewardMode('1');
    } else {
      setStepRewardMode('2');
    }
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

  useEffect(() => {
    setDealBreed(dealBreedValue ? '2' : '1');
  }, [dealBreedValue]);

  const handleDealBreedToggle = () => {
    if (dealBreed === '1') {
      setDealBreed('2');
      return;
    }

    form.setValue('dealBreed', '');
    setDealBreed('1');
  };

  const handleStepRewardModeToggle = () => {
    if (stepRewardMode === '1') {
      setStepRewardMode('2');
    } else {
      setStepRewardMode('1');
      // 切换到阶梯模式时，至少补齐到2条
      const needAppendCount = Math.max(MIN_LADDER_COUNT - fields.length, 0);
      if (needAppendCount > 0) {
        append(Array.from({ length: needAppendCount }, createEmptyLadderItem) as never);
      }
    }
  };

  const handleAddLadder = () => {
    if (fields.length >= MAX_LADDER_COUNT) return;
    append(createEmptyLadderItem() as never);
  };

  const handleRemoveLadder = () => {
    if (fields.length <= MIN_LADDER_COUNT) return;
    remove(fields.length - 1);
  };

  return (
    <div className="grid gap-6">
      <FormSelect
        label={t('table.server')}
        options={serverOptions}
        name="dealServer"
        showRowValue={false}
        placeholder={t('common.pleaseSelect')}
        renderItem={option => {
          return (
            <div>
              <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
              {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
              <span>{option.label}</span>
            </div>
          );
        }}
      />

      <div className="text-primary text-xs leading-4" onClick={handleDealBreedToggle}>
        {t(`rewardConfigPage.dealBreedOptions.${dealBreed}`)}
      </div>

      {dealBreed === '2' && (
        <FormField
          name="dealBreed"
          render={({ field }) => (
            <SelectMtTypeGroup
              defaultValue={field.value ?? ''}
              verticalLabel
              field={field}
              serverId={dealServerValue}
              disabled={!dealServerValue}
              emptyDisplayText={t('TradingRebateSettings.allRebateGroupType')}
            />
          )}
        />
      )}

      <FormSwitchGroup
        name="limitType"
        label={t('rewardConfigPage.minimumAmount')}
        switchItems={[
          {
            value: '1',
            label: t('rewardConfigPage.dailyTradingVolume'),
          },
          {
            value: '2',
            label: t('rewardConfigPage.totalTradingVolume'),
          },
        ]}
      />

      <FormInputWithUnit
        label={
          limitTypeValue === '1'
            ? t('rewardConfigPage.dailyTradingVolume')
            : t('rewardConfigPage.totalTradingVolume')
        }
        name="minimumAmount"
        unit="Lot"
        placeholder={t('rules.enterPositiveInteger')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('rewardConfigPage.tradingVolumeDesc')}
          </div>
        }
      />

      <FormSwitchGroup
        name="rewardType"
        label={t('rewardConfigPage.rewardType')}
        switchItems={[
          {
            value: '1',
            label: t('table.creditDeposit'),
          },
          {
            value: '2',
            label: t('table.balance'),
          },
        ]}
      />

      <FormSwitchGroup
        name="bonusScheme"
        label={t('rewardConfigPage.bonusType')}
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
      />

      <FormSwitchGroup
        name="bonusType"
        label={t('rewardConfigPage.bonusAmount')}
        switchItems={[
          {
            value: '2',
            label: t('table.fixedAmount'),
          },
          {
            value: '3',
            label: t('table.tradingVolume'),
          },
        ]}
      />
      {/* 奖励金额 分为 固定金额和交易量 2 3 还要区分阶梯模式 2 1 */}
      {bonusTypeValue === '2' && stepRewardMode === '2' && (
        <FormInputWithUnit
          label={t('table.fixedAmount')}
          name="bonusAmount"
          unit="USD"
          placeholder={t('rules.enterPositiveInteger')}
        />
      )}

      {bonusTypeValue === '3' && stepRewardMode === '2' && (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormLabel>{t('table.tradingVolume')}</FormLabel>
            </div>
          </div>
          <FormControl>
            <div className="grid gap-4 rounded-md border p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FormInputWithUnit
                    name="dealNum"
                    unit="USD"
                    placeholder={t('common.pleaseInput', {
                      field: t('table.rewardAmount'),
                    })}
                  />
                </div>
                <div className="flex-1">
                  <FormInputWithUnit
                    name="dealBasis"
                    unit="LOT"
                    placeholder={t('common.pleaseInput', {
                      field: '',
                    })}
                  />
                </div>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}

      {bonusTypeValue === '2' && stepRewardMode === '1' && (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormLabel>{t('table.fixedAmount')}</FormLabel>
              <div className="text-muted-foreground text-xs leading-4">
                {t('rewardConfigPage.stepRewardModeDesc')}
              </div>
            </div>
            <div className="flex gap-2">
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLadder}
                disabled={fields.length >= MAX_LADDER_COUNT}
              >
                +
              </RrhButton>
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveLadder}
                disabled={fields.length <= MIN_LADDER_COUNT}
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
                        label={t('rewardConfigPage.tradingVolumeRange')}
                        placeholder={t('rewardConfigPage.min')}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        name={`ladderBonusList.${index}.endAmount`}
                        placeholder={t('rewardConfigPage.max')}
                        disabled={
                          index === fields.length - 1 // 仅最后一个区间的结束金额允许输入，其他区间的结束金额由下一个区间的开始金额决定
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <FormInputWithUnit
                        label={t('rewardConfigPage.bonusAmount')}
                        name={`ladderBonusList.${index}.bonusFixed`}
                        unit="USD"
                        placeholder={t('common.pleaseInput', {
                          field: t('rewardConfigPage.bonusAmount'),
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}

      {bonusTypeValue === '3' && stepRewardMode === '1' && (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FormLabel>{t('table.tradingVolume')}</FormLabel>
              <div className="text-muted-foreground text-xs leading-4">
                {t('rewardConfigPage.stepRewardModeDesc')}
              </div>
            </div>
            <div className="flex gap-2">
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLadder}
                disabled={fields.length >= MAX_LADDER_COUNT}
              >
                +
              </RrhButton>
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveLadder}
                disabled={fields.length <= MIN_LADDER_COUNT}
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
                        label={t('rewardConfigPage.tradingVolumeRange')}
                        placeholder={t('rewardConfigPage.min')}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        name={`ladderBonusList.${index}.endAmount`}
                        placeholder={t('rewardConfigPage.max')}
                        disabled={
                          index === fields.length - 1 // 仅最后一个区间的结束金额允许输入，其他区间的结束金额由下一个区间的开始金额决定
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <FormInputWithUnit
                        label={t('rewardConfigPage.bonusAmount')}
                        name={`ladderBonusList.${index}.dealNum`}
                        unit="UDS"
                        placeholder={t('common.pleaseInput', {
                          field: t('rewardConfigPage.bonusAmount'),
                        })}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInputWithUnit
                        name={`ladderBonusList.${index}.dealBasis`}
                        unit="LOT"
                        placeholder={t('common.pleaseInput', {
                          field: t('rewardConfigPage.bonusAmount'),
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}

      <div className="text-primary text-xs leading-4" onClick={handleStepRewardModeToggle}>
        {t(`rewardConfigPage.stepRewardModeOptions.${stepRewardMode}`)}
      </div>

      <FormInput
        name="amountCapped"
        label={t('rewardConfigPage.amountCapped')}
        placeholder={t('common.pleaseInput', {
          field: t('rewardConfigPage.amountCapped'),
        })}
      />

      <FormItem>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FormLabel>{t('rewardConfigPage.bonusIssueTime')}</FormLabel>
            <div className="text-muted-foreground text-xs leading-4">
              {t('rewardConfigPage.bonusIssueTimeDesc')}
            </div>
          </div>
        </div>
        <FormControl>
          <div className="grid gap-4 rounded-md border p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FormSelect
                  options={[
                    {
                      label: t('rewardConfigPage.everyDay'),
                      value: '1',
                    },
                  ]}
                  name="issueTimeUnit"
                  showRowValue={false}
                  placeholder={t('common.pleaseSelect')}
                />
              </div>
              <div className="flex-1">
                <FormInputWithUnit
                  name="bonusIssueTime"
                  unit={t('common.hour')}
                  placeholder={t('common.pleaseInput', {
                    field: t('common.hour'),
                  })}
                />
              </div>
            </div>
          </div>
        </FormControl>
      </FormItem>
    </div>
  );
}
