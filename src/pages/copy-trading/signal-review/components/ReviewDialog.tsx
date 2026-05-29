import { useMemo, useState } from 'react';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { useMamSignalSourceDetail, useMamSignalSourceVerify } from '@/api/hooks/copyTrading';
import { MamSignalSourceDetailData } from '@/api/hooks/copyTrading/type';
import { LabelItem } from '@/components/common/LabelItem';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormRadio } from '@/components/form/FormRadio';

type FormValues = {
  verifyStatus: string;
  remark: string;
};

type InfoItem = {
  label: string;
  value: string;
};

function formatBalance(value: number | null | undefined) {
  return value === null || value === undefined ? '-' : String(value);
}

function buildInfoList(data: MamSignalSourceDetailData | undefined, t: TFunction): InfoItem[] {
  if (!data?.detail?.id) return [];

  const detailData = data.detail;
  const authorName = `${detailData.userLastName || ''} ${detailData.userName || ''}`.trim();
  const author = detailData.email ? `${authorName}(${detailData.email})` : authorName || '-';
  const tradingAccount = detailData.server
    ? `${detailData.server}/${detailData.account || '-'}`
    : '-';

  const chargeLabelMap: Record<number, string> = {
    0: t('signalReview.free'),
    1: t('signalReview.paid'),
  };
  const chargeText = chargeLabelMap[detailData.charge] || '-';

  const performanceFeeCycleLabelMap: Record<number, string> = {
    0: t('signalReview.performanceFeeCycleOptions.0'),
    1: t('signalReview.performanceFeeCycleOptions.1'),
    2: t('signalReview.performanceFeeCycleOptions.2'),
    3: t('signalReview.performanceFeeCycleOptions.3'),
  };
  const performanceFeeCycleText =
    performanceFeeCycleLabelMap[detailData.performanceFeeCycle] || '-';
  const performanceFeeRatioText =
    detailData.performanceFeeRatio === null || detailData.performanceFeeRatio === undefined
      ? '-'
      : `${Number(detailData.performanceFeeRatio).toFixed(2)}%`;

  const payAccount =
    data.receiveAccount ||
    (detailData.server && detailData.receiveAccount
      ? `${detailData.server}/${detailData.receiveAccount}`
      : '-') ||
    '-';

  return [
    {
      label: t('signals.name'),
      value: detailData.name || '-',
    },
    {
      label: t('signals.signalSourceAuthor'),
      value: author,
    },
    {
      label: t('table.tradingAccount'),
      value: tradingAccount,
    },
    {
      label: t('signalReview.upperLimit'),
      value: formatBalance(detailData.upperLimit),
    },
    {
      label: t('signalReview.minBalanceForSubscription'),
      value: formatBalance(detailData.minBalanceForSubscription),
    },
    {
      label: t('signalReview.maxBalanceForSubscription'),
      value: formatBalance(detailData.maxBalanceForSubscription),
    },
    {
      label: t('signalReview.subscriptionReview'),
      value: detailData.subscriptionReview === 1 ? t('common.yes') : t('common.no'),
    },
    {
      label: t('signals.publicShow'),
      value: detailData.publicShow === 1 ? t('signalReview.show') : t('signalReview.hide'),
    },
    {
      label: t('signalReview.charge'),
      value: chargeText,
    },
    {
      label: t('performanceFeeRecord.performanceFee'),
      value: detailData.performanceFeeEnable === 1 ? performanceFeeCycleText : '-',
    },
    {
      label: t('signalReview.performanceFeeRatio'),
      value: detailData.performanceFeeEnable === 1 ? performanceFeeRatioText : '-',
    },
    {
      label: t('table.paymentAccount'),
      value: payAccount,
    },
    {
      label: t('table.countryOrRegion'),
      value: detailData.countryName || '-',
    },
    {
      label: t('table.applicationTime'),
      value: detailData.createTime || '-',
    },
  ];
}

export const ReviewDialog = ({
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  title,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  title: string;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const { data: detail, isLoading: initLoading } = useMamSignalSourceDetail(String(id), {
    enabled: !!id && open,
  });
  const tips = detail?.data?.userLanguageTip;
  const form = useForm<FormValues>({
    defaultValues: {
      verifyStatus: '1',
      remark: '',
    },
  });
  const { mutateAsync: verify, isPending } = useMamSignalSourceVerify();

  const onSubmit = async (data: FormValues) => {
    const signalId = id?.trim();
    if (!signalId) {
      toast.error(t('common.fail'));
      return;
    }

    try {
      const res = await verify({
        id: signalId,
        verifyStatus: data.verifyStatus,
        remark: data.remark,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        handleOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const onCancel = () => {
    handleOpenChange(false);
  };

  const onConfirm = () => {
    void form.handleSubmit(onSubmit)();
  };

  const resetForm = () => {
    form.reset({
      verifyStatus: '1',
      remark: '',
    });
    form.clearErrors();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
      return;
    }
  };

  const infoList = useMemo(() => buildInfoList(detail?.data, t), [detail, t]);

  const reviewStatusOptions = useMemo(
    () => [
      {
        value: '1',
        label: t('common.verifyStatus.approved'),
      },
      {
        value: '0',
        label: t('common.verifyStatus.rejected'),
      },
    ],
    [t],
  );

  return (
    <RrhDialog
      title={title}
      isConfirmDisabled={initLoading || isPending}
      open={open}
      onOpenChange={handleOpenChange}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      confirmText={t('common.Confirm')}
      cancelShow={true}
      formLoading={initLoading || isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          {infoList.map((item, index) => (
            <LabelItem
              key={item.label + index}
              label={item.label}
              ContentDom={<div>{item.value}</div>}
            />
          ))}
        </div>

        <FormRadio
          className="py-3"
          name="verifyStatus"
          label={t('table.reviewStatus')}
          options={reviewStatusOptions}
        />

        <FormTextarea
          className="py-3"
          name="remark"
          label={t('table.remarks')}
          placeholder={t('review.reviewRemarksPlaceholder')}
          maxLength={500}
          labeTipsDom={<div className="text-muted-foreground text-xs leading-4">{tips}</div>}
        />
      </RrhForm>
    </RrhDialog>
  );
};
