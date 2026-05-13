import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useInternalTransferReviewDetail,
  useInternalTransferVerify,
} from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { InternalTransferVerifyParams } from '@/api/hooks/review/types';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { PageInfo } from '@/components/common/PageInfo';
import { toast } from 'sonner';
import { InfoCard } from './components/InfoCard';
import { ReviewInfoCard } from './components/ReviewInfoCard';
import { useEffect } from 'react';
import { RrhForm } from '@/components/form/RrhForm';

export const InternalTransferDetailPage = () => {
  const [searchParams] = useSearchParams();
  const depositId = searchParams.get('id');
  const { data: dataRes, isLoading } = useInternalTransferReviewDetail(
    searchParams.get('id') || '',
    {
      enabled: !!depositId,
    },
  );
  const { t } = useTranslation();
  const navigate = useNavigate();

  const Info = dataRes?.data?.detail;
  const reviewer = dataRes?.data?.reviewer;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: internalTransferVerify } = useInternalTransferVerify();
  const form = useForm<InternalTransferVerifyParams>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      rate: '',
      inMoney: '',
      isNeedDeposit: '1',
      orderComment: '',
      outMoney: '',
    },
  });

  useEffect(() => {
    form.reset({
      id: '',
      status: '1',
      remark: '',
      inMoney: Info?.inMoney || '',
      isNeedDeposit: '1',
      orderComment: '',
      rate: Info?.rate || '',
      outMoney: Info?.outMoney || '',
    });
  }, [Info, form]);

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  if (!depositId || !Info) {
    return <div></div>;
  }
  const depositData = dataRes.data;

  const reviewSteps = [
    {
      label: depositData.detail.subTime,
      content:
        depositData.detail.userLastName +
        ' ' +
        depositData.detail.userName +
        t('review.submitForReview'),
      status: 'complete',
    },
    ...depositData.verifyLogs.map(log => {
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

  const onSubmit = async (val: InternalTransferVerifyParams) => {
    try {
      const params = {
        id: Info.id,
        status: val.status || '',
        remark: val.remark || '',
        rate: val?.rate || '',
        inMoney: val?.inMoney || '',
        isNeedDeposit: val?.isNeedDeposit,
        orderComment: val?.orderComment || '',
      };
      const res = await internalTransferVerify(params);
      if (res.code === 0) {
        toast.success(res.msg);
        // 成功后返回上一页面
        setTimeout(() => {
          navigate('/review/internal-transfer');
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
      <PageInfo
        wrapperCls="py-3"
        title={t('internalTransferReview.internalTransferReviewDetail')}
      />
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1 gap-3 overflow-auto">
            <InfoCard detailData={depositData} isAudit={isAudit} />
          </div>
          <div className="relative md:w-76">
            <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
              <ReviewStepsCard reviewSteps={reviewSteps} />
              {isAudit && reviewer && (
                <ReviewInfoCard detailData={depositData} reviewer={reviewer} />
              )}
            </div>
          </div>
        </div>
      </RrhForm>
    </div>
  );
};
