import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { toast } from 'sonner';
import { CrmUserItem, useBatchSetAccountType } from '@/api/hooks/account';
import { crmAccountTypeOptions } from '@/lib/const';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { FormSelect } from '@/components/form/FormSelect';

type FormValues = {
  accountType: string;
};

export const BatchSetAccountTypeDialog = ({
  open,
  setOpen,
  rows,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rows: CrmUserItem[];
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: batchSetAccountType, isPending } = useBatchSetAccountType();

  const schema = useMemo(
    () =>
      z.object({
        accountType: z.string().min(1, { message: t('CRMAccountPage.pleaseSelectAccountType') }),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: '',
    },
  });

  const onCancel = () => {
    form.reset({ accountType: '' });
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await batchSetAccountType({
        ids: rows.map(row => row.id).join(','),
        accountType: data.accountType,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Batch set account type error', error);
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('CRMAccountPage.BatchSetAccountType')}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('CRMAccountPage.selectedAccounts', { count: rows.length })}
        </div>

        <FormSelect<FormValues>
          name="accountType"
          label={t('CRMAccountPage.CRMAccountType')}
          placeholder={t('common.pleaseSelect')}
          options={crmAccountTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2" disabled={isPending}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
