import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useDepositReviewDetail, useDepositVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useEffect } from 'react';
import { DepositInfoCard } from './components/DepositInfoCard';
import { DepositVerifyParams } from '@/api/hooks/review/types';
import { PersonalInfoCard } from './components/PersonalInfoCard';
import { RrhStepProps } from '@/components/common/RrhStep';
import { ReviewInfoCard } from './components/ReviewInfoCard';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { PageInfo } from '@/components/common/PageInfo';

export const ReviewDepositDetailPage = () => {
  const [searchParams] = useSearchParams();
  const depositId = searchParams.get('id');
  const { data: depositRes, isLoading } = useDepositReviewDetail(searchParams.get('id') || '', {
    enabled: !!depositId,
  });
  const { t } = useTranslation();
  const depositInfo = depositRes?.data?.detail;
  const reviewer = depositRes?.data?.reviewer;
  const isAudit = searchParams.get('type') === 'audit' || depositInfo?.status === 2;

  const { mutate: depositVerify, isPending } = useDepositVerify();
  const form = useForm<DepositVerifyParams>({
    defaultValues: {
      id: '',
      status: '',
      remark: '',
      deposit: '',
      fee: '',
      expectDeposit: '',
      factDeposit: '',
      rate: '',
      verifyStep: '',
      isNeedDeposit: '',
      orderComment: '',
    },
  });

  useEffect(() => {
    /**初始化表单数据 */
    if (depositInfo?.id) {
      form.reset({
        id: depositInfo.id,
        status: '1',
        remark: depositInfo.remark || '',
        deposit: String(depositInfo.deposit),
        fee: depositInfo.fee ? String(depositInfo.fee) : '',
        expectDeposit: depositInfo.expectDeposit ? String(depositInfo.expectDeposit) : '',
        factDeposit: String(depositInfo.factDeposit),
        rate: depositInfo.rate ? String(depositInfo.rate) : '',
        verifyStep: depositInfo.verifyStep ? String(depositInfo.verifyStep) : '',
        isNeedDeposit: '',
        orderComment: depositInfo.orderComment || '',
      });
    }
  }, [form, depositInfo]);

  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!depositId || !depositInfo) {
    return <div></div>;
  }
  const depositData = depositRes.data;

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

  const onSubmit = (val: DepositVerifyParams) => {
    if (isPending) return;
    const params = {
      id: depositInfo.id,
      status: val.status,
      remark: val.remark,
      deposit: val.deposit,
      fee: val.fee,
      expectDeposit: val.expectDeposit,
      factDeposit: val.factDeposit,
      rate: val.rate,
      verifyStep: val.verifyStep,
      isNeedDeposit: val.isNeedDeposit,
      orderComment: val.orderComment,
    };
    depositVerify(params);
  };
  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('depositReview.depositReviewDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <DepositInfoCard depositData={depositData} isAudit={isAudit} form={form} />
            </div>
            <div className="relative md:w-76">
              <PersonalInfoCard
                depositInfo={depositInfo}
                roleName={depositData.roleName}
                lastLoginTime={depositData.tLastLogin}
              />
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <ReviewStepsCard reviewSteps={reviewSteps} />
                {isAudit && reviewer && (
                  <ReviewInfoCard depositInfo={depositInfo} reviewer={reviewer} />
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
