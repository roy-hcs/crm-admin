import { FormProvider } from '@/contexts/form';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { FormRadio } from '@/components/form/FormRadio';
import { useEditRebateBase, useRebateBase } from '@/api/hooks/rebate';
import { useEffect, useState } from 'react';
import { useGlobalLoading } from '@/contexts/loading/useGlobalLoading';
import { toast } from 'sonner';
import { ToolTip } from '@/components/common/ToolTip';
import { CircleAlert } from 'lucide-react';
import { RrhAlert } from '@/components/common/RrhAlert';

type FormValues = {
  setting: string;
  manyRebate: string;
  num: string;
};

export function BasicSetting() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tipsText, setTipsText] = useState('');
  const { data, isLoading } = useRebateBase('0');
  const { withLoading } = useGlobalLoading();
  const setting = data?.data?.setting || '1';
  const manyRebate = data?.data?.manyRebate || '1';
  const num = data?.data?.num || '1';
  const { mutateAsync: editBase } = useEditRebateBase();
  const form = useForm<FormValues>({
    defaultValues: {
      setting: '',
      manyRebate: '',
      num: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const params = {
          setting: data.setting,
          manyRebate: data.manyRebate === '2' ? 'true' : 'false',
          num: data.num,
        };
        const res = await editBase(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
          setOpen(false);
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
      setting: setting,
      manyRebate: manyRebate === 'true' ? '2' : '1',
      num: num,
    });
  }, [form, manyRebate, num, setting]);

  const handleConfirm = () => {
    // 如果当前是反佣2 用户选择反佣1 点击确认时 弹窗提示词修改
    if (setting === '2' && form.getValues('setting') === '1') {
      setTipsText(t('RebateBasicSettingsPage.settingChangeTips'));
    } else {
      setTipsText(t('RebateBasicSettingsPage.confirmOperation'));
    }
    setOpen(true);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  return (
    <div className="grid gap-6">
      <FormProvider form={form}>
        <Form {...form}>
          <form className="grid gap-y-6">
            <FormRadio
              name="setting"
              orientation="horizontal"
              label={t('home.nav.InternalTransfer')}
              labeTipsDom={
                <ToolTip
                  content={
                    <span className="whitespace-pre-line">
                      {t('RebateBasicSettingsPage.settingDesc')}
                    </span>
                  }
                >
                  <CircleAlert className="text-muted-foreground size-4" />
                </ToolTip>
              }
              options={[
                { label: t('RebateBasicSettingsPage.setting.1'), value: '1' },
                { label: t('RebateBasicSettingsPage.setting.2'), value: '2' },
              ]}
            />
            <FormRadio
              name="manyRebate"
              label={t('RebateBasicSettingsPage.allowMultipleRebate')}
              options={[
                { label: t('RebateBasicSettingsPage.manyRebate.1'), value: '1' },
                { label: t('RebateBasicSettingsPage.manyRebate.2'), value: '2' },
              ]}
            />
            <FormRadio
              name="num"
              label={t('RebateBasicSettingsPage.rebateAccountSettings')}
              options={[
                { label: t('RebateBasicSettingsPage.num.1'), value: '0' },
                { label: t('RebateBasicSettingsPage.num.2'), value: '1' },
              ]}
            />
          </form>
        </Form>
      </FormProvider>
      <div className="flex justify-end">
        <RrhButton type="submit" variant="default" onClick={handleConfirm}>
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
