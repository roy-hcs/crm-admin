import { RrhCard } from '@/components/common/RrhCard';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { WithdrawalInfo } from './components/WithdrawalInfo';
import { useWithdrawalReviewDetail, useWithdrawalVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhStep, RrhStepProps } from '@/components/common/RrhStep';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { ReviewCardInfo } from './components/ReviewCardInfo';
import { useEffect } from 'react';

export type WithdrawalFormData = {
  withdrawAmount: string;
  expectWithdraw: string;
  commission: string;
  rate: string;
  amountOfReceipt: string;
  paymentCurrency: string;
  payee: string;
  withdrawAccount: string;
  withdrawAddress: string;
  withdrawBank: string;
  withdrawBankAddress: string;
  swiftCode: string;
  dealTicket: string;
  accountHolderName: string;
  accountHolderBank: string;
  IFSCCode: string;
  BSBCode: string;
  branchName: string;
  bankCardNumber: string;
  reviewStatus: string;
  reviewRemarks: string;
};

export const ReviewWithdrawalDetailPage = () => {
  const [searchParams] = useSearchParams();
  const isAudit = searchParams.get('type') === 'audit';
  const withdrawalId = searchParams.get('id');
  const { data: withdrawalRes, isLoading } = useWithdrawalReviewDetail(
    searchParams.get('id') || '',
    {
      enabled: !!withdrawalId,
    },
  );
  const withdrawalInfo = withdrawalRes?.data?.detail;
  const { mutate: withdrawalVerify, data: verifyData, isPending } = useWithdrawalVerify();
  const form = useForm<WithdrawalFormData>({
    defaultValues: {
      withdrawAmount: '',
      expectWithdraw: '',
      commission: '',
      rate: '',
      amountOfReceipt: '',
      paymentCurrency: '',
      payee: '',
      withdrawAccount: '',
      withdrawAddress: '',
      withdrawBank: '',
      withdrawBankAddress: '',
      swiftCode: '',
      dealTicket: '',
      accountHolderName: '',
      accountHolderBank: '',
      IFSCCode: '',
      BSBCode: '',
      branchName: '',
      bankCardNumber: '',
      reviewStatus: '',
      reviewRemarks: '',
    },
  });
  useEffect(() => {
    if (withdrawalInfo) {
      form.reset({
        withdrawAmount: withdrawalInfo.withdraw,
        expectWithdraw: '',
        commission: withdrawalInfo.fee,
        rate: withdrawalInfo.rate.toString(),
        amountOfReceipt: withdrawalInfo.factWithdraw || '',
        paymentCurrency: withdrawalInfo.targetCurrency,
        payee: withdrawalInfo.withdrawUser || '',
        withdrawAccount: withdrawalInfo.withdrawAccount || '',
        withdrawAddress: withdrawalInfo.withdrawAddress || '',
        withdrawBank: withdrawalInfo.withdrawBank || '',
        withdrawBankAddress: withdrawalInfo.withdrawBankAddress || '',
        swiftCode: withdrawalInfo.swift || '',
        dealTicket: withdrawalInfo.dealTicket || '',
        accountHolderName: withdrawalInfo.accountName || '',
        accountHolderBank: withdrawalInfo.accountBank || '',
        IFSCCode: withdrawalInfo.ifscCode || '',
        BSBCode: withdrawalInfo.bsbCode || '',
        bankCardNumber: withdrawalInfo.cardNo || '',
        branchName: withdrawalInfo.branchBank || '',
        reviewStatus: '1',
        reviewRemarks: '',
      });
    }
  }, [form, withdrawalInfo]);
  const { t } = useTranslation();
  if (isLoading) {
    <div className="h-100">
      <RrhCircleLoading />;
    </div>;
  }

  if (!withdrawalId || !withdrawalInfo) {
    return <div></div>;
  }
  const withdrawalData = withdrawalRes.data;
  const reviewSteps = [
    {
      label: withdrawalData.subTime,
      content:
        withdrawalData.detail.userLastName +
        ' ' +
        withdrawalData.detail.userName +
        t('review.submitForReview'),
      status: 'complete',
    },
    ...withdrawalData.verifyLogs.map(log => {
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
  const onSubmit = (val: WithdrawalFormData) => {
    if (isPending) return;
    console.log(val, 'submit val');
    const params = {
      id: withdrawalId,
      status: val.reviewStatus,
      remark: val.reviewRemarks,
      withdraw: val.withdrawAmount,
      fee: val.commission,
      expectWithdraw: val.expectWithdraw,
      // 注意精度取舍truncateDecimal(factWithdraw, factWithdrawScale)
      factWithdraw: val.amountOfReceipt,
      rate: val.rate,
      targetCurrency: withdrawalInfo.targetCurrency,
      withdrawUser: val.payee,
      withdrawAddress: val.withdrawAddress,
      withdrawAccount: val.withdrawAccount,
      withdrawBank: val.withdrawBank,
      swift: val.swiftCode,
      withdrawBankAddress: val.withdrawBankAddress,
      accountName: val.accountHolderName,
      accountBank: val.accountHolderBank,
      cardNo: val.bankCardNumber,
      branchBank: val.branchName,
      verifyStep: withdrawalInfo.verifyStep,
      ifscCode: val.IFSCCode,
      bsbCode: val.BSBCode,
      orderComment: withdrawalInfo.orderComment,
    };
    withdrawalVerify(params);
    console.log(verifyData, 'verifyData');

    console.log(params, 'submit params');
  };
  return (
    <div>
      <h1 className="text-title mt-3 mb-6">{t('review.withdrawalReviewDetail')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex gap-8">
            <WithdrawalInfo withdrawData={withdrawalData} isAudit={isAudit} form={form} />
            <div className="relative w-76">
              <div className="sticky -top-6 flex flex-col gap-6">
                <RrhCard title={t('review.reviewRecord')}>
                  <RrhStep steps={reviewSteps} />
                </RrhCard>
                {isAudit && (
                  <RrhCard title={t('review.review')}>
                    <ReviewCardInfo
                      withdrawalInfo={withdrawalInfo}
                      reviewer={withdrawalData.reviewer}
                    />
                  </RrhCard>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
