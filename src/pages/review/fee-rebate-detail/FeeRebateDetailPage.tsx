import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFeeRebateDetail, useFeeRebateVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { RebateVerifyParams } from '@/api/hooks/review/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CheckInfoCard } from '../trading-rebate-detail/components/CheckInfoCard';
import { FeeRebateInfoCard } from './components/FeeRebateInfoCard';

export const FeeRebateDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data: data, isLoading } = useFeeRebateDetail(id || '', {
    enabled: !!id,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rebateInfo = data?.data?.detail;
  const reviewer = data?.data?.reviewer;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyRebate } = useFeeRebateVerify();
  const form = useForm<RebateVerifyParams>({
    defaultValues: {
      id: '',
      rebateStatus: '1',
      remark: '',
      verifyStep: '',
    },
  });

  useEffect(() => {
    if ([3, 2].includes(Number(rebateInfo?.rebateStatus))) {
      form.reset({
        id: rebateInfo?.id || '',
        rebateStatus: '1',
        remark: rebateInfo?.remark || '',
        verifyStep: `${rebateInfo?.verifyStep || ''}`,
      });
    }
  }, [form, rebateInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!id || !rebateInfo) {
    return <div></div>;
  }
  const rebateData = data.data;

  const reviewSteps = [
    {
      label: rebateData.detail.rebateTime,
      content: rebateData.detail.userName + t('review.submitForReview'),
      status: 'complete',
    },
    ...rebateData.verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime,
        content: log.userName + (isPass ? t('review.reviewPass') : t('review.reviewReject')),
        status: isPass ? 'complete' : 'error',
      };
    }),
  ] as RrhStepProps['steps'];

  const onSubmit = async (val: RebateVerifyParams) => {
    try {
      const params = {
        id: rebateInfo.id || '',
        rebateStatus: val.rebateStatus,
        remark: val.remark,
        verifyStep: `${rebateInfo?.verifyStep || ''}`,
      };
      const res = await verifyRebate(params);
      if (res.code === 0) {
        toast.success(res.msg);
        // 成功后返回上一页面
        setTimeout(() => {
          back();
        }, 500);
      } else {
        toast.error(res.msg);
      }
    } catch {
      console.error('Fee rebate review verification failed');
    }
  };

  const back = () => {
    navigate('/review/fee-rebate');
  };
  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('feeRebateReview.feeRebateReviewDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <FeeRebateInfoCard data={rebateData} />
            </div>
            <div className="relative md:w-76">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && reviewer && <CheckInfoCard back={back} reviewer={reviewer} />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
