import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { KycStatus, RrhKycStatus } from '@/components/common/RrhKycStatus';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ChevronDown, Stamp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CrmInfoVerifyParams, VerifyLogItem } from '@/api/hooks/review';
import { RrhStep, RrhStepProps } from '@/components/common/RrhStep';
import { ImageZoom } from '@/components/common/ImageZoom';
import { useCrmInfoVerify } from '@/api/hooks/review/review';
import { toast } from 'sonner';

export type Step = {
  label?: string;
  infoType?: number | string;
  verifyStep?: number | string;
  status: KycStatus;
  remark?: string | null;
  time?: string;
  columns: Array<{
    columnName: string;
    columnValue: string;
    columnType?: number; // 5 是图片类型
  }>;
  isFold?: boolean;
  name?: string;
  verifyLogs: VerifyLogItem[];
};

type FormValues = CrmInfoVerifyParams;

export function KycReviewCard({
  step,
  id,
  onSuccess,
}: {
  step: Step;
  id: string;
  onSuccess: () => void;
}) {
  const canAudit = step.status === -1 || step.status === 2;
  const initialFormValues = useMemo<FormValues>(
    () => ({
      id,
      infoType: step?.infoType != null ? String(step.infoType) : '',
      isReVerify: '0',
      status: '1',
      remark: '',
      verifyStep: step?.verifyStep != null ? String(step.verifyStep) : '',
    }),
    [id, step?.infoType, step?.verifyStep],
  );

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: verifyInfo } = useCrmInfoVerify();
  const form = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { t } = useTranslation();
  const [folded, setFolded] = useState(step.isFold);
  const resolveDisplayText = (value?: string) => {
    if (!value) return '-';
    const i18nPrefix = 'i18n:';
    if (value.startsWith(i18nPrefix)) {
      return t(value.slice(i18nPrefix.length));
    }
    return value;
  };

  useEffect(() => {
    form.reset(initialFormValues);
  }, [form, initialFormValues]);

  useEffect(() => {
    setFolded(step.isFold ?? false);
  }, [step.infoType, step.verifyStep, step.isFold]);

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onCancel = () => {
    setOpen(false);
    form.reset();
  };
  const onConfirm = async () => {
    const values = form.getValues();
    try {
      setIsSubmitting(true);
      const params = {
        id: values.id,
        infoType: values.infoType,
        isReVerify: values.isReVerify,
        status: values.status,
        remark: values.remark,
        verifyStep: values.verifyStep,
      };
      const res = await verifyInfo(params);
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewSteps = [
    {
      label: step.time,
      content: step.name + t('review.submitForReview'),
      status: 'complete',
    },
    ...(step?.verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime,
        content: log.userName + (isPass ? t('review.reviewPass') : t('review.reviewReject')),
        status: isPass ? 'complete' : 'error',
      };
    }) || []),
  ] as RrhStepProps['steps'];
  return (
    <div className="bg-card rounded-lg md:rounded-2xl">
      <div className="p-3 md:p-6">
        <div
          className={cn(
            folded ? 'max-h-13.5' : 'max-h-screen',
            'grid gap-3 overflow-hidden transition-all duration-200 md:gap-6',
          )}
        >
          <div className="grid gap-3">
            <div>
              <div className="flex cursor-pointer items-center" onClick={() => setFolded(!folded)}>
                <div className="grid flex-1 gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="text-foreground text-base leading-4 font-semibold">
                      {step.label}
                    </div>
                    <RrhKycStatus status={step.status} />
                  </div>
                  <div className="text-muted-foreground text-sm leading-5">{step.time}</div>
                </div>
                <div>
                  <ChevronDown className={cn('size-4 duration-200', folded ? '' : 'rotate-180')} />
                </div>
              </div>
            </div>
            {step.status === 0 && step.remark && (
              <div className="text-destructive rounded-xl bg-red-600/5 p-3 text-sm leading-5">
                {t('information.rejectionReason')}: {step.remark}
              </div>
            )}
          </div>

          <div>
            <div className="grid grid-cols-2">
              {step.columns.map(({ columnName, columnValue, columnType }, i) => (
                <LabelItem
                  key={`${columnName}-${i}`}
                  label={resolveDisplayText(columnName)}
                  ContentDom={
                    columnType && columnType === 5 ? (
                      <div className="bg-primary-foreground box-border size-20 overflow-hidden rounded-xl border">
                        {columnValue && (
                          <ImageZoom src={columnValue} thumbnailClassName="size-20" />
                        )}
                      </div>
                    ) : (
                      <InfoItem info={resolveDisplayText(columnValue)} />
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {canAudit ? (
        <div className="border-t p-3 text-right md:p-6">
          <RrhDialog
            title={t('information.personalInformationReview')}
            open={open}
            onOpenChange={onClose}
            onCancel={onCancel}
            onConfirm={onConfirm}
            type="submit"
            formLoading={isSubmitting}
            trigger={
              <RrhButton Icon={<Stamp className="size-4" />} type="button">
                {t('table.audit')}
              </RrhButton>
            }
            variant="small"
          >
            <RrhForm form={form}>
              <RrhStep steps={reviewSteps} />
              <FormField
                name="status"
                render={({ field }) => (
                  <LabelItem
                    label={t('review.reviewStatus')}
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
                  <LabelItem
                    label={t('table.remarks')}
                    ContentDom={
                      <RrhTextarea
                        value={field.value}
                        onChange={field.onChange}
                        className="border-input w-full rounded-lg border px-3 py-1 text-sm"
                        placeholder={t('review.reviewRemarksPlaceholder')}
                        maxLength={500}
                      />
                    }
                  />
                )}
              />
            </RrhForm>
          </RrhDialog>
        </div>
      ) : null}
    </div>
  );
}
