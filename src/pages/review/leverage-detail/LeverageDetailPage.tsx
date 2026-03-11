import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLeverageReviewDetail, useLeverageVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { LeverageVerifyParams } from '@/api/hooks/review/types';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { LeverageInfoCard } from './components/LeverageInfoCard';
import { CheckInfoCard } from './components/CheckInfoCard';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const LeverageDetailPage = () => {
  const [searchParams] = useSearchParams();
  const leverageId = searchParams.get('id');
  const { data: leverageRes, isLoading } = useLeverageReviewDetail(leverageId || '', {
    enabled: !!leverageId,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const leverageInfo = leverageRes?.data?.detail;
  const reviewer = leverageRes?.data?.reviewer;
  const isAudit = leverageInfo?.status === 2;

  const { mutateAsync: verifyLeverage } = useLeverageVerify();
  const form = useForm<LeverageVerifyParams>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  useEffect(() => {
    if (leverageInfo?.status === 1 || leverageInfo?.status === 0) {
      form.reset({
        id: leverageInfo?.id || '',
        status: `${leverageInfo?.status}`,
        remark: leverageInfo.remark || '',
        verifyStep: leverageInfo.verifyStep || '',
      });
    }
  }, [form, leverageInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!leverageId || !leverageInfo) {
    return <div></div>;
  }
  const leverageData = leverageRes.data;

  const reviewSteps = [
    {
      label: leverageData.detail.subTime,
      content:
        leverageData.detail.userLastName +
        ' ' +
        leverageData.detail.userName +
        t('review.submitForReview'),
      status: 'complete',
    },
    ...leverageData.verifyLogs.map(log => {
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

  const onSubmit = async (val: LeverageVerifyParams) => {
    try {
      const params = {
        id: leverageInfo.id || '',
        status: val.status,
        remark: val.remark,
        verifyStep: leverageInfo.verifyStep || '',
      };
      const res = await verifyLeverage(params);
      if (res.code === 0) {
        toast.success(res.msg);
        // 成功后返回上一页面
        setTimeout(() => {
          navigate('/review/leverage');
        }, 500);
      } else {
        toast.error(res.msg);
      }
    } catch {
      console.error('Leverage review verification failed');
    }
  };
  return (
    <div>
      <h1 className="text-title mt-3 mb-3">{t('review.leverage.leverageReviewDetail')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <LeverageInfoCard depositData={leverageData} />
            </div>
            <div className="relative md:w-76">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && reviewer && <CheckInfoCard reviewer={reviewer} />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
