import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useLeverageReviewDetail, useLeverageVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { LeverageVerifyParams } from '@/api/hooks/review/types';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { LeverageInfoCard } from './components/LeverageInfoCard';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PageInfo } from '@/components/common/PageInfo';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useGlobalLoading } from '@/contexts/loading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';

type FormValue = LeverageVerifyParams;

export const LeverageDetailPage = () => {
  const [searchParams] = useSearchParams();
  const leverageId = searchParams.get('id');
  const { data: leverageRes, isLoading } = useLeverageReviewDetail(leverageId || '', {
    enabled: !!leverageId,
  });
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const back = useTabBackNavigation('/review/leverage');

  const leverageInfo = leverageRes?.data?.detail;
  const reviewer = leverageRes?.data?.reviewer;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyLeverage } = useLeverageVerify();
  const form = useForm<FormValue>({
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

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          id: leverageInfo.id || '',
          status: data.status,
          remark: data.remark,
          verifyStep: leverageInfo.verifyStep || '',
        };
        const res = await verifyLeverage(params);
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
      <PageInfo wrapperCls="py-3" title={t('leverage.leverageReviewDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <LeverageInfoCard data={leverageData} />
            </div>
            <div className="relative md:w-76">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && <CheckInfoCard back={back} roleName={reviewer?.userName || ''} />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
