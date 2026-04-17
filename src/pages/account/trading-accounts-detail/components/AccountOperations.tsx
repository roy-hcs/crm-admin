import { useGetAccountOperateInfo, useSetAccountOperateInfo } from '@/api/hooks/account';
import { useEffect, useState } from 'react';


import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { toast } from 'sonner';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  enableInternalTransferOut: number;
  insideTransfer: number;
  outMoney: number;
};

export function AccountOperations({ id }: { id: string }) {
  const { t } = useTranslation();
  const { mutateAsync: getPerm } = useGetAccountOperateInfo();
  const { mutateAsync: setPerm } = useSetAccountOperateInfo();
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      enableInternalTransferOut: 0,
      insideTransfer: 0,
      outMoney: 0,
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPerm(id);
        if (res.code === 0) {
          form.reset({
            enableInternalTransferOut: res.data.enableInternalTransferOut,
            insideTransfer: res.data.insideTransfer,
            outMoney: res.data.outMoney,
          });
        } else {
          form.reset({
            enableInternalTransferOut: 0,
            insideTransfer: 0,
            outMoney: 0,
          });
        }
      } catch {
        form.reset({
          enableInternalTransferOut: 0,
          insideTransfer: 0,
          outMoney: 0,
        });
      } finally {
        setInitLoading(true);
      }
    }
    fetchData();
  }, [form, getPerm, id]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const params = {
        id,
        permissionJson: JSON.stringify({
          insideTransfer: data.insideTransfer,
          outMoney: data.outMoney,
        }),
        crmAuthority: '1',
      };
      const res = await setPerm(params);
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
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <FormSwitch verticalLabel name="outMoney" label={t('table.Withdrawal')} />
            <FormSwitch
              verticalLabel
              name="insideTransfer"
              label={t('home.nav.InternalTransfer')}
            />
            <FormSwitch
              verticalLabel
              name="enableInternalTransferOut"
              label={t('home.enableInternalTransferOut')}
            />
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
