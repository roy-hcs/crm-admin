import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBindingReviewDetail, useBindingVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BindingInfoCard } from './components/BindingInfoCard';
import { BindingVerifyParams } from '@/api/hooks/review/types';
import { CheckInfoCard } from './components/checkInfoCard';
import { PageInfo } from '@/components/common/PageInfo';

export const BindingDetailPage = () => {
  const [searchParams] = useSearchParams();
  const bindingId = searchParams.get('id');
  const { data: bindingRes, isLoading } = useBindingReviewDetail(bindingId || '', {
    enabled: !!bindingId,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const bindingInfo = bindingRes?.data?.detail;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyBinding } = useBindingVerify();
  const form = useForm<BindingVerifyParams>({
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

  const onSubmit = async (val: BindingVerifyParams) => {
    try {
      const params = {
        id: bindingInfo.id || '',
        status: val.status,
        remark: val.remark,
        verifyStep: `${bindingInfo?.verifyStep}`,
      };
      const res = await verifyBinding(params);
      if (res.code === 0) {
        toast.success(res.msg);
        // 成功后返回上一页面
        setTimeout(() => {
          navigate('/review/binding');
        }, 500);
      } else {
        toast.error(res.msg);
      }
    } catch {
      console.error('Binding review verification failed');
    }
  };
  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('binding.bindingReviewDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <BindingInfoCard data={bindingData} />
            </div>
            <div className="relative md:w-76">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && <CheckInfoCard />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
