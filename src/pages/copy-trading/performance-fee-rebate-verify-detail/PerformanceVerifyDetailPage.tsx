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
import { RrhForm } from '@/components/form/RrhForm';
import { ReviewStepsCard } from '@/pages/review/withdrawal-detail/components/ReviewStepsCard';
import { PerformanceVerifyInfoCard } from './components/PerformanceVerifyInfoCard';
import {
  usePerformanceFeeRebateDetail,
  usePerformanceFeeRebateVerify,
} from '@/api/hooks/copyTrading';

type FormValue = {
  id: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export const PerformanceVerifyDetailPage = () => {
  const [searchParams] = useSearchParams();
  const leverageId = searchParams.get('id');
  const { data: detailRes, isLoading } = usePerformanceFeeRebateDetail(leverageId || '', {
    enabled: !!leverageId,
  });
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const back = useTabBackNavigation('/copy-trading/performance-fee-rebate');

  const detailInfo = detailRes?.data?.detail;
  const reviewer = detailRes?.data?.reviewer;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verify } = usePerformanceFeeRebateVerify();
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  useEffect(() => {
    if (detailInfo?.status === 1 || detailInfo?.status === 0) {
      form.reset({
        id: detailInfo?.id || '',
        status: `${detailInfo?.status}`,
        remark: detailInfo.verifyRemark || '',
        verifyStep: `${detailInfo.verifyStep || ''}`,
      });
    }
  }, [form, detailInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!leverageId || !detailInfo) {
    return <div></div>;
  }
  const detailData = detailRes.data;

  const reviewSteps = [
    {
      label: detailData.detail.createTime,
      content: (detailData.detail.verifyUserName || 'System') + ' ' + t('review.submitForReview'),
      status: 'complete',
    },
    ...detailData.verifyLogs.map(log => {
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
    // status 1: 通过 2: 拒绝
    // 但是接口 需要 2 通过 3 拒绝，所以这里需要转换一下
    const status = data.status === '1' ? '2' : '3';
    await withLoading(async () => {
      try {
        const params = {
          id: detailInfo.id || '',
          status: status,
          verifyRemark: data.remark,
          verifyStep: `${detailInfo.verifyStep || ''}`,
        };
        const res = await verify(params);
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
      <PageInfo wrapperCls="py-3" title={t('performanceFeeRebatePage.performanceFeeDetail')} />
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1 gap-3 overflow-auto">
            <PerformanceVerifyInfoCard data={detailData} />
          </div>
          <div className="relative md:w-76">
            <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
              <ReviewStepsCard reviewSteps={reviewSteps} />
              {isAudit && <CheckInfoCard back={back} roleName={reviewer?.userName || ''} />}
            </div>
          </div>
        </div>
      </RrhForm>
    </div>
  );
};
