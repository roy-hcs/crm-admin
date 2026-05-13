import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useBindingReviewDetail, useBindingVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BindingInfoCard } from './components/BindingInfoCard';
import { BindingVerifyParams } from '@/api/hooks/review/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useGlobalLoading } from '@/contexts/loading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import { RrhForm } from '@/components/form/RrhForm';

type FormValue = BindingVerifyParams;

export const BindingDetailPage = () => {
  const [searchParams] = useSearchParams();
  const bindingId = searchParams.get('id');
  const { data: bindingRes, isLoading } = useBindingReviewDetail(bindingId || '', {
    enabled: !!bindingId,
  });
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const back = useTabBackNavigation('/review/binding');
  const bindingInfo = bindingRes?.data?.detail;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyBinding } = useBindingVerify();
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  useEffect(() => {
    if (bindingInfo?.status === 1 || bindingInfo?.status === 0) {
      form.reset({
        id: bindingInfo?.id || '',
        status: `${bindingInfo?.status}`,
        remark: bindingInfo.remark || '',
        verifyStep: `${bindingInfo?.verifyStep}`,
      });
    }
  }, [form, bindingInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!bindingId || !bindingInfo) {
    return <div></div>;
  }
  const bindingData = bindingRes.data;

  const reviewSteps = [
    {
      label: bindingData.detail.subTime,
      content:
        bindingData.detail.userLastName +
        ' ' +
        bindingData.detail.userName +
        t('review.submitForReview'),
      status: 'complete',
    },
    ...bindingData.verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime,
        content:
          log.userLastName +
          ' ' +
          log.userName +
          (isPass ? t('review.reviewPass') : t('review.reviewReject')),
        status: isPass ? 'complete' : 'error',
      };
    }),
  ] as RrhStepProps['steps'];

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          id: bindingInfo.id || '',
          status: data.status,
          remark: data.remark,
          verifyStep: `${bindingInfo?.verifyStep}`,
        };
        const res = await verifyBinding(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
          back();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('binding.bindingReviewDetail')} />
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1 gap-3 overflow-auto">
            <BindingInfoCard data={bindingData} />
          </div>
          <div className="relative md:w-76">
            <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
              <ReviewStepsCard reviewSteps={reviewSteps} />
              {isAudit && <CheckInfoCard back={back} />}
            </div>
          </div>
        </div>
      </RrhForm>
    </div>
  );
};
