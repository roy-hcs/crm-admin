import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useFeeRebateDetail, useFeeRebateVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { toast } from 'sonner';
import { PageInfo } from '@/components/common/PageInfo';
import { FeeRebateInfoCard } from './components/FeeRebateInfoCard';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useGlobalLoading } from '@/contexts/loading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import { RrhForm } from '@/components/form/RrhForm';

type FormValue = {
  id: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export const FeeRebateDetailPage = () => {
  const [searchParams] = useSearchParams();
  const back = useTabBackNavigation('/review/deposit-rebate');
  const id = searchParams.get('id');
  const { data: data, isLoading } = useFeeRebateDetail(id || '', {
    enabled: !!id,
  });
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();

  const rebateInfo = data?.data?.detail;
  const reviewer = data?.data?.reviewer;
  const verifyLogs = data?.data?.verifyLogs || [];
  const rebateData = data?.data;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyRebate } = useFeeRebateVerify();
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  const reviewSteps = [
    {
      label: rebateInfo?.rebateTime,
      content: rebateInfo?.userName + t('review.submitForReview'),
      status: 'complete',
    },
    ...verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime,
        content: log.userName + (isPass ? t('review.reviewPass') : t('review.reviewReject')),
        status: isPass ? 'complete' : 'error',
      };
    }),
  ] as RrhStepProps['steps'];

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          id: rebateInfo?.id || '',
          rebateStatus: data.status,
          remark: data.remark,
          verifyStep: `${rebateInfo?.verifyStep || ''}`,
        };
        const res = await verifyRebate(params);
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
      <PageInfo wrapperCls="py-3" title={t('feeRebateReview.feeRebateReviewDetail')} />
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1 gap-3 overflow-auto">
            {rebateData && <FeeRebateInfoCard data={rebateData} />}
          </div>
          <div className="relative md:w-76">
            <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
              <ReviewStepsCard reviewSteps={reviewSteps} />
              {isAudit && <CheckInfoCard back={back} roleName={reviewer?.roleName || ''} />}
            </div>
          </div>
        </div>
      </RrhForm>
    </div>
  );
};
