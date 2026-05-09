import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PageInfo } from '@/components/common/PageInfo';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useGlobalLoading } from '@/contexts/loading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import {
  RewardRecordVerifyParams,
  useRewardRecordReviewDetail,
  useRewardRecordVerify,
} from '@/api/hooks/marketing';
import { RewardRecordsInfoCard } from './components/RewardRecordsInfoCard';
import { ReviewStepsCard } from '@/pages/review/withdrawal-detail/components/ReviewStepsCard';

type FormValue = RewardRecordVerifyParams;

export const RewardRecordsDetailPage = () => {
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('id');
  const { data: recordRes, isLoading } = useRewardRecordReviewDetail(recordId || '', {
    enabled: !!recordId,
  });
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const back = useTabBackNavigation('/marketing/reward-records');
  const recordInfo = recordRes?.data?.detail;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyRewardRecord } = useRewardRecordVerify();
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      recordId: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  useEffect(() => {
    if (recordInfo?.status === 1 || recordInfo?.status === 0) {
      form.reset({
        id: recordInfo?.id || '',
        status: `${recordInfo?.status}`,
        remark: recordInfo.remark || '',
        verifyStep: `${recordInfo?.verifyStep}`,
      });
    }
  }, [form, recordInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!recordId || !recordInfo) {
    return <div></div>;
  }
  const recordData = recordRes.data;

  const reviewSteps = [
    {
      label: recordData.detail.subTime,
      content:
        recordData.detail.userLastName +
        ' ' +
        recordData.detail.userName +
        t('review.submitForReview'),
      status: 'complete',
    },
    ...recordData.verifyLogs.map(log => {
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
  console.log(reviewSteps, 'reviewSteps');

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          id: recordInfo?.id || '',
          recordId: recordInfo?.recordId || '',
          status: data.status,
          remark: data.remark,
          verifyStep: `${recordInfo?.verifyStep}`,
        };
        const res = await verifyRewardRecord(params);
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
      <PageInfo wrapperCls="py-3" title={t('rewardRecords.rewardRecordsDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <RewardRecordsInfoCard data={recordData} />
            </div>
            <div className="relative md:w-76">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && <CheckInfoCard back={back} />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
