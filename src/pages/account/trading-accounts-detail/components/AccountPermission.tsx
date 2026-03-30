import { useGetAuthorityInfoPerm, useSetAuthorityInfoPerm } from '@/api/hooks/account';
import { useEffect, useState } from 'react';
import { FormProvider } from '@/contexts/form';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';

type FormValues = {
  enableThisAccount: number;
  enablTransaction: number;
  allowPasswordChange: number;
  allowTrackingStopLoss: number;
  enableDynamicPassword: number;
  enableEATransactions: number;
  enableWebAPILinks: number;
  enableDayReport: number;
  nextLoginChangePassword: number;
  enablTransactionXoh: number;
  passwordChangeXoh: number;
  enable4: number;
  readOnly4: number;
  passwordChange4: number;
  sendReport4: number;
  dynamicPassword4: number;
  readOnlyLx: number;
  passwordChangeLx: number;
  sendReportLx: number;
};

const EMPTY_FORM_VALUES: FormValues = {
  enableThisAccount: 0,
  enablTransaction: 0,
  allowPasswordChange: 0,
  allowTrackingStopLoss: 0,
  enableDynamicPassword: 0,
  enableEATransactions: 0,
  enableWebAPILinks: 0,
  enableDayReport: 0,
  nextLoginChangePassword: 0,
  enablTransactionXoh: 0,
  passwordChangeXoh: 0,
  enable4: 0,
  readOnly4: 0,
  passwordChange4: 0,
  sendReport4: 0,
  dynamicPassword4: 0,
  readOnlyLx: 0,
  passwordChangeLx: 0,
  sendReportLx: 0,
};

const SERVICE_TYPE_1_BITS: Record<
  | 'enableThisAccount'
  | 'enablTransaction'
  | 'allowPasswordChange'
  | 'allowTrackingStopLoss'
  | 'enableDynamicPassword'
  | 'enableEATransactions'
  | 'enableWebAPILinks'
  | 'enableDayReport'
  | 'nextLoginChangePassword',
  number
> = {
  enableThisAccount: 1,
  enablTransaction: 4,
  allowPasswordChange: 2,
  allowTrackingStopLoss: 32,
  enableDynamicPassword: 2048,
  enableEATransactions: 64,
  enableWebAPILinks: 128,
  enableDayReport: 256,
  nextLoginChangePassword: 1024,
};

const SERVICE_TYPE_5_BITS: Record<'enablTransactionXoh' | 'passwordChangeXoh', number> = {
  enablTransactionXoh: 4,
  passwordChangeXoh: 8,
};

const SERVICE_TYPE_2_BITS: Record<
  'enable4' | 'readOnly4' | 'passwordChange4' | 'sendReport4' | 'dynamicPassword4',
  number
> = {
  enable4: 16,
  readOnly4: 4,
  passwordChange4: 8,
  sendReport4: 1,
  dynamicPassword4: 2,
};

const SERVICE_TYPE_3_BITS: Record<'readOnlyLx' | 'passwordChangeLx' | 'sendReportLx', number> = {
  readOnlyLx: 4,
  passwordChangeLx: 8,
  sendReportLx: 1,
};

// Legacy behavior: serviceType=3 always includes enable(16) and dynamicPassword(2).
const SERVICE_TYPE_3_ALWAYS_ON_MASK = 16 | 2;

const getPermissionBitsByServiceType = (serviceType: number) => {
  if (serviceType === 2) return SERVICE_TYPE_2_BITS;
  if (serviceType === 3) return SERVICE_TYPE_3_BITS;
  if (serviceType === 5) return SERVICE_TYPE_5_BITS;
  return SERVICE_TYPE_1_BITS;
};

function orOperation(values: FormValues, serviceType: number) {
  const permissionBits = getPermissionBitsByServiceType(serviceType);
  const keys = Object.keys(permissionBits) as Array<keyof typeof permissionBits>;

  const result = keys.reduce((acc, key) => {
    return Number(values[key]) === 1 ? acc | permissionBits[key] : acc;
  }, 0);

  if (serviceType === 3) {
    return result | SERVICE_TYPE_3_ALWAYS_ON_MASK;
  }

  return result;
}

export function AccountPermission({ id }: { id: string }) {
  const { t } = useTranslation();
  const [initLoading, setInitLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [serviceType, setServiceType] = useState(0);
  const { mutateAsync: getPerm } = useGetAuthorityInfoPerm();
  const { mutateAsync: setPerm } = useSetAuthorityInfoPerm();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: EMPTY_FORM_VALUES,
  });

  useEffect(() => {
    const permissionBits = getPermissionBitsByServiceType(serviceType);
    const keys = Object.keys(permissionBits) as Array<keyof FormValues>;

    const subscription = form.watch(values => {
      const allChecked = keys.length > 0 && keys.every(key => Number(values[key]) === 1);
      setSelectAll(allChecked);
    });
    return () => subscription.unsubscribe();
  }, [form, serviceType]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPerm(id);
        if (res.code === 0) {
          const authority = Number(res?.data?.crmDealAccount?.authority) || 0;
          const serviceType = Number(res?.data?.crmDealAccount?.serviceType) || 0;
          setServiceType(serviceType);
          form.reset(EMPTY_FORM_VALUES);
          if (authority) {
            if (serviceType === 1) {
              if ((authority & 1) == 1) {
                form.setValue('enableThisAccount', 1);
              }
              if ((authority & 2) == 2) {
                form.setValue('allowPasswordChange', 1);
              }
              if ((authority & 4) == 4) {
                form.setValue('enablTransaction', 1);
              }
              if ((authority & 32) == 32) {
                form.setValue('allowTrackingStopLoss', 1);
              }
              if ((authority & 64) == 64) {
                form.setValue('enableEATransactions', 1);
              }
              if ((authority & 128) == 128) {
                form.setValue('enableWebAPILinks', 1);
              }
              if ((authority & 256) == 256) {
                form.setValue('enableDayReport', 1);
              }
              if ((authority & 1024) == 1024) {
                form.setValue('nextLoginChangePassword', 1);
              }
              if ((authority & 2048) == 2048) {
                form.setValue('enableDynamicPassword', 1);
              }
            } else if (serviceType === 2) {
              if ((authority & 16) == 16) {
                form.setValue('enable4', 1);
              }
              if ((authority & 4) == 4) {
                form.setValue('readOnly4', 1);
              }
              if ((authority & 8) == 8) {
                form.setValue('passwordChange4', 1);
              }
              if ((authority & 1) == 1) {
                form.setValue('sendReport4', 1);
              }
              if ((authority & 2) == 2) {
                form.setValue('dynamicPassword4', 1);
              }
            } else if (serviceType === 3) {
              if ((authority & 4) == 4) {
                form.setValue('readOnlyLx', 1);
              }
              if ((authority & 8) == 8) {
                form.setValue('passwordChangeLx', 1);
              }
              if ((authority & 1) == 1) {
                form.setValue('sendReportLx', 1);
              }
            } else if (serviceType === 5) {
              if ((authority & 4) == 4) {
                form.setValue('enablTransactionXoh', 1);
              }
              if ((authority & 8) == 8) {
                form.setValue('passwordChangeXoh', 1);
              }
            }
          }
        } else {
          form.reset(EMPTY_FORM_VALUES);
        }
      } catch {
        form.reset(EMPTY_FORM_VALUES);
      } finally {
        setInitLoading(true);
      }
    }
    fetchData();
  }, [form, getPerm, id]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const accountInitAuthSetting = orOperation(data, serviceType);
      const res = await setPerm({
        accountInitAuthSetting: String(accountInitAuthSetting),
        id: id,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!initLoading) {
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {serviceType === 1 && (
              <div className="grid gap-y-6">
                <div className="grid gap-2">
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('common.selectAll')}
                  </div>
                  <Switch
                    className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                    checked={selectAll}
                    onCheckedChange={checked => {
                      setSelectAll(checked);
                      (Object.keys(SERVICE_TYPE_1_BITS) as Array<keyof FormValues>).forEach(key => {
                        form.setValue(key, checked ? 1 : 0);
                      });
                    }}
                  />
                </div>
                <FormSwitch
                  verticalLabel
                  name="enableThisAccount"
                  label={t('trading.enableThisAccount')}
                />
                <FormSwitch
                  verticalLabel
                  name="enablTransaction"
                  label={t('trading.enablTransaction')}
                />
                <FormSwitch
                  verticalLabel
                  name="allowPasswordChange"
                  label={t('trading.allowPasswordChange')}
                />
                <FormSwitch
                  verticalLabel
                  name="allowTrackingStopLoss"
                  label={t('trading.allowTrackingStopLoss')}
                />
                <FormSwitch
                  verticalLabel
                  name="enableDynamicPassword"
                  label={t('trading.enableDynamicPassword')}
                />
                <FormSwitch
                  verticalLabel
                  name="enableEATransactions"
                  label={t('trading.enableEATransactions')}
                />
                <FormSwitch
                  verticalLabel
                  name="enableWebAPILinks"
                  label={t('trading.enableWebAPILinks')}
                />
                <FormSwitch
                  verticalLabel
                  name="enableDayReport"
                  label={t('trading.enableDayReport')}
                />
                <FormSwitch
                  verticalLabel
                  name="nextLoginChangePassword"
                  label={t('trading.nextLoginChangePassword')}
                />
              </div>
            )}
            {serviceType === 5 && (
              <div className="grid gap-y-6">
                <div className="grid gap-2">
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('common.selectAll')}
                  </div>
                  <Switch
                    className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                    checked={selectAll}
                    onCheckedChange={checked => {
                      setSelectAll(checked);
                      (Object.keys(SERVICE_TYPE_5_BITS) as Array<keyof FormValues>).forEach(key => {
                        form.setValue(key, checked ? 1 : 0);
                      });
                    }}
                  />
                </div>
                <FormSwitch
                  verticalLabel
                  name="enablTransactionXoh"
                  label={t('trading.enablTransaction')}
                />
                <FormSwitch
                  verticalLabel
                  name="passwordChangeXoh"
                  label={t('trading.allowPasswordChange')}
                />
              </div>
            )}
            {serviceType === 2 && (
              <div className="grid gap-y-6">
                <div className="grid gap-2">
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('common.selectAll')}
                  </div>
                  <Switch
                    className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                    checked={selectAll}
                    onCheckedChange={checked => {
                      setSelectAll(checked);
                      (Object.keys(SERVICE_TYPE_2_BITS) as Array<keyof FormValues>).forEach(key => {
                        form.setValue(key, checked ? 1 : 0);
                      });
                    }}
                  />
                </div>
                <FormSwitch verticalLabel name="enable4" label={t('common.enable')} />
                <FormSwitch verticalLabel name="readOnly4" label={t('common.readOnly')} />
                <FormSwitch
                  verticalLabel
                  name="passwordChange4"
                  label={t('trading.allowPasswordChange')}
                />
                <FormSwitch verticalLabel name="sendReport4" label={t('table.sendReport')} />
                <FormSwitch
                  verticalLabel
                  name="dynamicPassword4"
                  label={t('trading.enableDynamicPassword')}
                />
              </div>
            )}
            {serviceType === 3 && (
              <div className="grid gap-y-6">
                <div className="grid gap-2">
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('common.selectAll')}
                  </div>
                  <Switch
                    className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                    checked={selectAll}
                    onCheckedChange={checked => {
                      setSelectAll(checked);
                      (Object.keys(SERVICE_TYPE_3_BITS) as Array<keyof FormValues>).forEach(key => {
                        form.setValue(key, checked ? 1 : 0);
                      });
                    }}
                  />
                </div>
                <FormSwitch verticalLabel name="readOnlyLx" label={t('common.readOnly')} />
                <FormSwitch
                  verticalLabel
                  name="passwordChangeLx"
                  label={t('trading.allowPasswordChange')}
                />
                <FormSwitch verticalLabel name="sendReportLx" label={t('table.sendReport')} />
              </div>
            )}
          </form>
        </Form>
      </FormProvider>
      <div className="flex justify-end">
        <RrhButton
          type="submit"
          variant="default"
          loading={loading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </div>
  );
}
