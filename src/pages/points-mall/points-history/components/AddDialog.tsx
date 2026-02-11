import { Form, FormField } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { useAddPoints } from '@/api/hooks/pointsMall';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormLeftSelectInput } from '@/components/form/FormLeftSelectInput';
import { SelectUser } from '@/pages/account/trading-accounts/components/SelectUser';

type FormValues = {
  bonusPoints: string;
  bonusType?: string;
  businessType: string;
  remark: string;
  userId: string;
};

const schema = (t: TFunction<'translation', undefined>) => {
  return {
    userId: z.string().min(1, t('rules.required', { field: t('rewardRecords.rewardTarget') })),
    businessType: z.string().min(1, t('rules.required', { field: t('table.triggerBusiness') })),
    bonusPoints: z
      .string()
      .min(1, t('rules.required', { field: t('table.bonusPoints') }))
      .regex(/^[1-9]\d*$/, t('rules.integer', { field: t('table.bonusPoints') })),
    remark: z.string().min(1, t('rules.required', { field: t('table.remarks') })),
    bonusType: z.string().optional(),
  };
};

export const AddDialog = ({
  onSuccess,
  operationTypeList,
}: {
  onSuccess: () => void;
  operationTypeList: { dictLabel: string; dictValue: string }[];
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutateAsync: addPoints } = useAddPoints();
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object(schema(t))),
    defaultValues: {
      bonusPoints: '',
      bonusType: '1',
      businessType: '',
      remark: '',
      userId: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        bonusPoints: data.bonusPoints,
        bonusType: data.bonusType || '1',
        businessType: data.businessType,
        remark: data.remark,
        userId: data.userId,
      };
      const res = await addPoints(param);
      if (res?.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onCancel = () => {
    setOpen(false);
    form.reset();
  };

  const onConfirm = async () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('common.add')}
        </RrhButton>
      }
      title={t('PointsHistory.pointsAdjustment')}
      isConfirmDisabled={isSubmitting}
      open={open}
      confirmText={t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="middle"
      type="submit"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-3">
              <FormField
                name="userId"
                render={({ field }) => {
                  return (
                    <SelectUser
                      verticalLabel
                      field={field}
                      title={t('rewardRecords.rewardTarget')}
                    />
                  );
                }}
              />
            </div>
            <div className="py-3">
              <FormSelect
                name="businessType"
                label={t('table.triggerBusiness')}
                verticalLabel
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={operationTypeList.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
              />
            </div>
            <div className="py-3">
              <FormLeftSelectInput
                verticalLabel
                name="bonusPoints"
                label={t('table.bonusPoints')}
                placeholder={t('PointsHistory.bonusPointsPlaceholder')}
                typeValue={'bonusType'}
                options={[
                  { label: t('common.increase'), value: '1' },
                  { label: t('common.subtract'), value: '2' },
                ]}
              />
            </div>
            <div className="py-3">
              <FormTextarea
                name="remark"
                label={t('table.remarks')}
                verticalLabel
                placeholder={t('rules.limitLength', { field: 50 })}
                maxLength={50}
              />
            </div>
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
