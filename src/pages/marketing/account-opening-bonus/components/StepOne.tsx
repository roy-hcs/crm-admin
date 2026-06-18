import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { FormSwitch } from '@/components/form/FormSwitch';
import { SelectOption } from '@/api/types';
import { useCrmAccountType } from '@/api/hooks/system/system';
import { useCrmFormContext } from '@/contexts/form';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import type { FormValues } from '../types';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useEffect, useRef, useState } from 'react';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormCrmUserMultiSelect } from '@/components/form/FormCrmUserMultiSelect';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { FormCrmTagMultiSelect } from '@/components/form/FormCrmTagMultiSelect';
import { FormCrmGroupMultiSelect } from '@/components/form/FormCrmGroupMultiSelect';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { FormCheckBoxGroup } from '@/components/form/FormCheckBoxGroup';
import { SelectMtTypeGroup } from '@/components/common/SelectMtTypeGroup';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

type ServerOptionsType = BaseOption & {
  serviceProperty: number;
  serviceType: number;
};

export function StepOne({
  bonusOptions,
  selectedUserOptions = [],
  selectedRoleOptions = [],
  selectedAccountOptions = [],
  selectedTagOptions = [],
  serverOptions = [],
}: {
  bonusOptions: SelectOption[];
  selectedUserOptions?: BaseOption[];
  selectedRoleOptions?: BaseOption[];
  selectedAccountOptions?: BaseOption[];
  selectedTagOptions?: BaseOption[];
  serverOptions?: ServerOptionsType[];
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();
  const [serverIdLimit, setServerIdLimit] = useState('1');
  const [dealBreed, setDealBreed] = useState('1');
  const [accountTypeOptions, setAccountTypeOptions] = useState<BaseOption[]>([]);

  const { mutateAsync: getAccountType, isPending: accountTypeLoading } = useCrmAccountType();

  const serverIdValue = form.watch('serverId');
  const accountLimitTypeValue = form.watch('accountLimitType');
  const serverGroupIdsValue = form.watch('serverGroupIds');
  const dealBreedValue = form.watch('dealBreed');
  const rewardTypeValue = form.watch('rewardType');
  const unlockLimitValue = form.watch('unlockLimit');

  const unlockLimitList = String(unlockLimitValue || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  const unlockDepositEnabled = unlockLimitList.includes('1');
  const unlockNetEnabled = unlockLimitList.includes('2');
  const unlockVolumeEnabled = unlockLimitList.includes('3');
  const prevServerIdRef = useRef('');
  const prevUnlockEnabledRef = useRef({
    unlockDepositEnabled: false,
    unlockNetEnabled: false,
    unlockVolumeEnabled: false,
  });

  useEffect(() => {
    const prevServerId = prevServerIdRef.current;

    if (!serverIdValue) {
      setAccountTypeOptions([]);

      // 仅在 serverId 从有值切到空值时清空，避免编辑初始化阶段误清空。
      if (prevServerId) {
        form.setValue('accountTypes', []);
        form.setValue('serverGroupIds', []);
      }

      prevServerIdRef.current = '';
      return;
    }

    prevServerIdRef.current = String(serverIdValue);

    let canceled = false;

    getAccountType({ serverId: serverIdValue })
      .then(res => {
        if (canceled) return;
        setAccountTypeOptions(
          (res || []).map(item => ({
            label: item.typeName || '',
            value: item.id,
          })),
        );
      })
      .catch(() => {
        if (canceled) return;
        setAccountTypeOptions([]);
      });

    return () => {
      canceled = true;
    };
  }, [form, getAccountType, serverIdValue]);

  useEffect(() => {
    setServerIdLimit((serverGroupIdsValue || []).length > 0 ? '2' : '1');
  }, [serverGroupIdsValue]);

  useEffect(() => {
    setDealBreed(dealBreedValue ? '2' : '1');
  }, [dealBreedValue]);

  useEffect(() => {
    const prevUnlockEnabled = prevUnlockEnabledRef.current;

    // 仅在勾选状态从启用切到禁用时清空，避免初始化阶段把回填值清空。
    if (prevUnlockEnabled.unlockDepositEnabled && !unlockDepositEnabled) {
      form.setValue('unlockDeposit', '');
    }
    if (prevUnlockEnabled.unlockNetEnabled && !unlockNetEnabled) {
      form.setValue('unlockNet', '');
    }
    if (prevUnlockEnabled.unlockVolumeEnabled && !unlockVolumeEnabled) {
      form.setValue('unlockVolume', '');
    }

    prevUnlockEnabledRef.current = {
      unlockDepositEnabled,
      unlockNetEnabled,
      unlockVolumeEnabled,
    };
  }, [form, unlockDepositEnabled, unlockNetEnabled, unlockVolumeEnabled]);

  const handleServerIdLimitToggle = () => {
    if (serverIdLimit === '1') {
      form.setValue('accountTypes', []);
      setServerIdLimit('2');
      return;
    }

    form.setValue('serverGroupIds', []);
    setServerIdLimit('1');
  };

  const handleDealBreedToggle = () => {
    if (dealBreed === '1') {
      setDealBreed('2');
      return;
    }

    form.setValue('dealBreed', '');
    setDealBreed('1');
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
      <FormInput name="sort" label={t('table.sort')} placeholder="0-9999" />
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
      <FormItem>
        <div className="flex items-center gap-2">
          <FormLabel>{t('rewardConfigPage.serverIdLimit')}</FormLabel>
          <div className="text-primary text-xs leading-4" onClick={handleServerIdLimitToggle}>
            {t(`rewardConfigPage.serverIdLimitOptions.${serverIdLimit}`)}
          </div>
        </div>
        <FormControl>
          <div className="flex items-center gap-2">
            <FormSelect
              className="flex-1"
              name="serverId"
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={serverOptions}
            />
            {serverIdLimit === '1' && (
              <FormMultiSelect
                className="flex-1"
                options={accountTypeOptions}
                name="accountTypes"
                showRowValue={false}
                loading={accountTypeLoading}
                disabled={!serverIdValue}
                placeholder={t('common.pleaseSelect')}
              />
            )}
            {serverIdLimit === '2' && (
              <FormCrmGroupMultiSelect<FormValues>
                className="flex-1"
                name="serverGroupIds"
                label=""
                verticalLabel={false}
                placeholder={t('common.pleaseSelect')}
                serverId={serverIdValue || ''}
              />
            )}
          </div>
        </FormControl>
      </FormItem>
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
      <FormInput<FormValues>
        name="maxAccount"
        label={t('rewardConfigPage.maxAccount')}
        placeholder={t('rewardConfigPage.maxAccountPlaceholder')}
        maxLength={2}
      />
      <FormSwitchGroup
        name="rewardType"
        label={t('rewardConfigPage.rewardType')}
        switchItems={[
          {
            value: '2',
            label: t('rewardConfigPage.rewardTypeOptions.2'),
          },
          {
            value: '1',
            label: t('rewardConfigPage.rewardTypeOptions.1'),
          },
          {
            value: '3',
            label: t('rewardConfigPage.rewardTypeOptions.3'),
          },
        ]}
      />
      <FormInput
        name="bonusAmount"
        label={t('rewardConfigPage.bonusAmount')}
        placeholder={t('rewardConfigPage.bonusAmount')}
      />
      {(rewardTypeValue === '2' || rewardTypeValue === '3') && (
        <div className="grid gap-6">
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>{t('rewardConfigPage.rewardLockUnlock')}</FormLabel>
              <div className="text-muted-foreground text-xs leading-4">
                {t('rewardConfigPage.rewardLockUnlockDesc')}
              </div>
            </div>
          </FormItem>

          <FormSwitch name="bonusLock" label={t('rewardConfigPage.bonusLock')} />

          <FormSwitch
            name="bonusLockAllowWithdraw"
            label={t('rewardConfigPage.bonusLockAllowWithdraw')}
            labeTipsDom={
              <div className="text-muted-foreground text-xs leading-4">
                {t('rewardConfigPage.bonusLockAllowWithdrawDesc')}
              </div>
            }
          />

          <FormCheckBoxGroup
            name="unlockLimit"
            options={[
              { value: '1', label: t('rewardConfigPage.unlockLimitOptions.1') },
              { value: '2', label: t('rewardConfigPage.unlockLimitOptions.2') },
              { value: '3', label: t('rewardConfigPage.unlockLimitOptions.3') },
            ]}
          />

          <FormInputWithUnit
            name="unlockDeposit"
            label={t('rewardConfigPage.unlockLimitOptions.1')}
            unit="USD"
            disabled={!unlockDepositEnabled}
            placeholder={t('rules.enterAmount')}
          />

          <FormInputWithUnit
            name="unlockNet"
            label={t('rewardConfigPage.unlockLimitOptions.2')}
            unit="USD"
            disabled={!unlockNetEnabled}
            placeholder={t('rules.enterAmount')}
          />

          <FormInputWithUnit
            name="unlockVolume"
            label={t('rewardConfigPage.unlockLimitOptions.3')}
            unit="Lot"
            disabled={!unlockVolumeEnabled}
            placeholder={t('common.pleaseInput', {
              field: t('rewardConfigPage.unlockLimitOptions.3'),
            })}
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
                  serverId={serverIdValue}
                  disabled={!serverIdValue}
                  emptyDisplayText={t('TradingRebateSettings.allRebateGroupType')}
                />
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
