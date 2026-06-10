import { useGetWalletPerm, useSetWalletPerm } from '@/api/hooks/account';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  insideTransfer: string;
  outMoney: string;
};

export function AccountPer({ id, crmUserId }: { id: string; crmUserId: string }) {
  const { t } = useTranslation();
  const { mutateAsync: getWalletPerm } = useGetWalletPerm();
  const { mutateAsync: setWalletPerm } = useSetWalletPerm();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      insideTransfer: '0',
      outMoney: '0',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getWalletPerm(crmUserId);
        if (res.code === 0) {
          form.reset({
            insideTransfer: String(res.data.insideTransfer),
            outMoney: String(res.data.outMoney),
          });
        } else {
          form.reset({
            insideTransfer: '0',
            outMoney: '0',
          });
        }
      } catch {
        form.reset({
          insideTransfer: '0',
          outMoney: '0',
        });
      }
    }
    fetchData();
  }, [crmUserId, form, getWalletPerm]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const params = {
        id,
        permissionJson: JSON.stringify({
          insideTransfer: data.insideTransfer,
          outMoney: data.outMoney,
        }),
      };
      const res = await setWalletPerm(params);
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
  return (
    <div className="grid gap-6">
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormSwitch name="outMoney" label={t('table.Withdrawal')} />
        <FormSwitch name="insideTransfer" label={t('home.nav.InternalTransfer')} />
      </RrhForm>
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
