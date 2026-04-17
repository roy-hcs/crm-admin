

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { FormRadio } from '@/components/form/FormRadio';
import {
  EditRebateFeeAddOrUpdateParams,
  useEditRebateFeeAddOrUpdate,
  useGetRebateFeeAddOrUpdate,
} from '@/api/hooks/rebate';
import { useEffect, useState } from 'react';
import { useGlobalLoading } from '@/contexts/loading/useGlobalLoading';
import { toast } from 'sonner';
import FormDateInput from '@/components/form/FormDateInput';
import { FormTimeOfDayInput } from '@/components/form/FormTimeOfDayInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhAlert } from '@/components/common/RrhAlert';
import { weekOptions } from '@/lib/const';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = EditRebateFeeAddOrUpdateParams;

export function HandFeeRebate() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tipsText, setTipsText] = useState('');
  const { data: rebateRes, isLoading } = useGetRebateFeeAddOrUpdate('2');
  const { withLoading } = useGlobalLoading();
  const id = rebateRes?.data?.rebateBase?.id || '1';
  const hasOpen = rebateRes?.data?.rebateBase?.hasOpen || '1';
  const getMyselfRebate = rebateRes?.data?.rebateBase?.getMyselfRebate || '1';
  const closeTimeInterval = `${rebateRes?.data?.rebateBase?.closeTimeInterval || '0'}`;
  const lastOrderRebateTime = rebateRes?.data?.rebateBase?.lastOrderRebateTime || '';
  const personRabateCheck = rebateRes?.data?.rebateBase?.personRabateCheck || '1';
  const settleStyle = rebateRes?.data?.rebateBase?.settleStyle || '0';
  const settleTime = rebateRes?.data?.rebateBase?.settleTime || '';
  const settleWeek = rebateRes?.data?.rebateBase?.settleWeek || '';
  const settleWeekTime = rebateRes?.data?.rebateBase?.settleWeekTime || '';
  const rebateType = rebateRes?.data?.rebateBase?.rebateType || '';
  const { mutateAsync: editBase } = useEditRebateFeeAddOrUpdate();
  const form = useForm<FormValues>({
    defaultValues: {
      id: '',
      hasOpen: '',
      getMyselfRebate: '',
      closeTimeInterval: '',
      lastOrderRebateTime: '',
      personRabateCheck: '',
      settleStyle: '',
      settleTime: '',
      settleWeek: '',
      settleWeekTime: '',
      rebateType: '',
    },
  });

  const settleStyleValue = form.watch('settleStyle');
  const personRabateCheckValue = form.watch('personRabateCheck');

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const params = {
          id: data.id,
          hasOpen: data.hasOpen,
          getMyselfRebate: data.getMyselfRebate,
          closeTimeInterval: data.closeTimeInterval,
          lastOrderRebateTime: data.lastOrderRebateTime,
          personRabateCheck: data.personRabateCheck,
          settleStyle: data.settleStyle,
          settleTime: data.settleTime,
          settleWeek: data.settleWeek,
          settleWeekTime: data.settleWeekTime,
          rebateType: '2',
        };
        const res = await editBase(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.error('Submit error', error);
      }
    });
  };

  useEffect(() => {
    form.reset({
      id: id,
      hasOpen: hasOpen,
      getMyselfRebate: getMyselfRebate,
      closeTimeInterval: closeTimeInterval,
      lastOrderRebateTime: lastOrderRebateTime,
      personRabateCheck: personRabateCheck,
      settleStyle: settleStyle,
      settleTime: settleTime,
      settleWeek: settleWeek,
      settleWeekTime: settleWeekTime,
      rebateType: rebateType,
    });
  }, [
    closeTimeInterval,
    form,
    getMyselfRebate,
    hasOpen,
    id,
    lastOrderRebateTime,
    personRabateCheck,
    rebateType,
    settleStyle,
    settleTime,
    settleWeek,
    settleWeekTime,
  ]);

  const handleConfirm = () => {
    setTipsText(t('RebateBasicSettingsPage.confirmOperation'));
    setOpen(true);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <div className="grid gap-6">
      <RrhForm form={form} className="grid gap-y-6">
            <FormRadio
              name="hasOpen"
              orientation="horizontal"
              label={t('RebateBasicSettingsPage.enableFeeRebate')}
              options={[
                { label: t('common.yes'), value: '1' },
                { label: t('common.no'), value: '0' },
              ]}
            />
            <FormRadio
              name="getMyselfRebate"
              orientation="horizontal"
              label={t('RebateBasicSettingsPage.getMyselfFeeRebate')}
              options={[
                { label: t('common.yes'), value: '1' },
                { label: t('common.no'), value: '0' },
              ]}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  *{t('RebateBasicSettingsPage.getMyselfRebateDesc')}
                </div>
              }
            />

            <FormDateInput
              label={t('RebateBasicSettingsPage.lastOrderRebateTime')}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  *{t('RebateBasicSettingsPage.handFeeLastOrderRebateTimeDesc')}
                </div>
              }
              name="lastOrderRebateTime"
              showTime
            />

            <FormRadio
              name="personRabateCheck"
              orientation="horizontal"
              label={t('RebateBasicSettingsPage.personRabateCheck')}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  *{t('RebateBasicSettingsPage.personRabateCheckDesc')}
                </div>
              }
              options={[
                { label: t('common.yes'), value: '1' },
                { label: t('common.no'), value: '0' },
              ]}
            />

            {personRabateCheckValue === '1' && (
              <div className="grid gap-6">
                <FormRadio
                  name="settleStyle"
                  label={t('RebateBasicSettingsPage.settleStyle')}
                  options={[
                    { label: t('RebateBasicSettingsPage.settleTimeRadio.0'), value: '0' },
                    { label: t('RebateBasicSettingsPage.settleTimeRadio.1'), value: '1' },
                    { label: t('RebateBasicSettingsPage.settleTimeRadio.2'), value: '2' },
                  ]}
                />
                {settleStyleValue === '1' && (
                  <FormTimeOfDayInput<FormValues>
                    name="settleTime"
                    label={t('RebateBasicSettingsPage.daySummary')}
                    precision="minute"
                  />
                )}
                {settleStyleValue === '2' && (
                  <FormSelect
                    name="settleWeek"
                    label={t('RebateBasicSettingsPage.weekSummary')}
                    verticalLabel
                    placeholder={t('common.pleaseSelect')}
                    showRowValue={false}
                    options={weekOptions.map(item => ({
                      label: t(item.label),
                      value: item.value,
                    }))}
                  />
                )}
                {settleStyleValue === '2' && (
                  <FormTimeOfDayInput<FormValues>
                    name="settleWeekTime"
                    label={t('RebateBasicSettingsPage.weekSummary')}
                    precision="minute"
                  />
                )}
              </div>
            )}
          </RrhForm>
      <div className="flex justify-end">
        <RrhButton variant="default" onClick={handleConfirm}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
      <RrhAlert
        trigger={null}
        open={open}
        onOpenChange={setOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={tipsText}
        onConfirm={onConfirm}
      />
    </div>
  );
}
