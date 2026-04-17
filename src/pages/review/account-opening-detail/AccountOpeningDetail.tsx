import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useAccountOpeningDetail, useAccountOpeningVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageInfo } from '@/components/common/PageInfo';
import { ReviewInfo } from './components/ReviewInfo';
import { AccountOpenVerifyParams, OpenReviewDetailRes } from '@/api/hooks/review';
import { Customer } from './components/Customer';
import { AccountOverviewPage } from './account-overview/AccountOverviewPage';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { RrhStepProps } from '@/components/common/RrhStep';
import { KycInfoPage } from './kyc-info/KycInfoPage';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/contexts/loading';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';

export type FormValue = AccountOpenVerifyParams;

export const AccountOpeningDetailPage = () => {
  const { t } = useTranslation();
  const back = useTabBackNavigation('/review/account-opening');
  const [searchParams] = useSearchParams();
  const openId = searchParams.get('id');
  const type = searchParams.get('type');
  const { data: openRes, isLoading } = useAccountOpeningDetail(openId || '', {
    enabled: !!openId,
  });
  const { withLoading } = useGlobalLoading();
  const { mutateAsync: check } = useAccountOpeningVerify();
  const openInfo = openRes?.data as OpenReviewDetailRes['data'];
  const userId = openInfo?.crmUser?.id || '';
  const reviewTabs = [
    'tradingRebateReview.reviewInfo',
    'accountOpening.accountOverview',
    'accountOpening.KYCInfo',
  ];
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '',
      remark: '',
      accountName: '',
      lever: '',
      mtGroup: '',
      credit: '',
      initialAmount: '',
      account: '',
      accountGroupId: '',
      sendPasswordOnly: '',
      directBroker: '',
      verifyStep: '',
    },
  });

  const reviewSteps = [
    {
      label: openInfo?.detail.subTime,
      content: openInfo?.detail.userName + t('review.submitForReview'),
      status: 'complete',
    },
    ...(openInfo?.verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime,
        content: log.userName + (isPass ? t('review.reviewPass') : t('review.reviewReject')),
        status: isPass ? 'complete' : 'error',
      };
    }) || []),
  ] as RrhStepProps['steps'];

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          ...data,
        };
        const res = await check(params);
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
      <PageInfo wrapperCls="py-3" title={t('accountOpening.accountOpeningReviewDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <Tabs
              defaultValue="tradingRebateReview.reviewInfo"
              className="flex-1 gap-3 overflow-auto"
            >
              <TabsList>
                {reviewTabs.map(tab => (
                  <TabsTrigger key={tab} value={tab}>
                    {t(tab)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="tradingRebateReview.reviewInfo">
                <ReviewInfo openInfo={openInfo} form={form} />
              </TabsContent>
              <TabsContent value="accountOpening.accountOverview">
                <AccountOverviewPage id={userId} />
              </TabsContent>
              <TabsContent value="accountOpening.KYCInfo">
                <KycInfoPage id={userId} />
              </TabsContent>
            </Tabs>

            <div className="relative md:mt-12 md:w-93.5">
              <div>
                <Customer openInfo={openInfo} />
              </div>
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <div className="mt-6">
                  <ReviewStepsCard reviewSteps={reviewSteps} />
                </div>
                {type === 'audit' && <CheckInfoCard back={back} />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
