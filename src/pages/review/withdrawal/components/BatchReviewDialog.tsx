import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { useBatchVerifyWithdraw } from '@/api/hooks/review/review';

type FormValues = {
  status: string;
  remark?: string;
};

export const BatchReviewDialog = ({
  onSuccess,
  open,
  setOpen,
  ids,
}: {
  onSuccess?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  ids: string[];
}) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z
        .object({
          status: z.string(),
          remark: z.string().optional(),
        })
        .refine(data => data.status !== '0' || !!data.remark?.trim(), {
          message: t('rules.required', { field: t('table.remarks') }),
          path: ['remark'],
        }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: '1',
      remark: '',
    },
  });
  const { mutateAsync: batchVerifyAsync, isPending } = useBatchVerifyWithdraw();

  const onSubmit = async (data: FormValues) => {
    try {
      const params = ids.map(id => ({
        id,
        status: data.status,
        remark: data.remark,
      }));

      const responses = await Promise.all(params.map(param => batchVerifyAsync(param)));
      const successCount = responses.filter(res => res.code === 0).length;
      const failedCount = responses.length - successCount;

      if (failedCount === 0) {
        form.reset();
        toast.success(t('common.success'));
        onCancel();
        onSuccess?.();
        return;
      }

      if (successCount > 0) {
        onCancel();
        onSuccess?.();
      }

      toast.error(
        t('withdrawalReview.batchReviewResult', {
          success: successCount,
          failed: failedCount,
        }),
      );
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const onCancel = () => {
    form.reset({
      status: '1',
      remark: '',
    });
    setOpen(false);
  };

  return (
    <RrhDialog
      title={t('table.batchAudit')}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('netBonusRewardRecords.selectedRecords', {
            count: ids.length,
          })}
        </div>
        <div>
          <FormField
            name="status"
            render={({ field }) => (
              <LabelItem
                label={t('table.reviewStatus')}
                ContentDom={
                  <RrhRadioGroup
                    value={field.value || '1'}
                    onValueChange={v => {
                      field.onChange(v);
                    }}
                    labelClassName="font-medium"
                    radioItems={[
                      {
                        value: '1',
                        label: t('common.verifyStatus.approved'),
                      },
                      {
                        value: '0',
                        label: t('common.verifyStatus.rejected'),
                      },
                    ]}
                  />
                }
              />
            )}
          />

          <FormField
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('table.remarks')}</FormLabel>
                <FormControl className="shrink-0 basis-9/12">
                  <RrhTextarea
                    value={field.value}
                    onChange={field.onChange}
                    className="border-input w-full rounded-lg border px-3 py-1 text-sm"
                    placeholder={t('review.reviewRemarksPlaceholder')}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />
        </div>

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
