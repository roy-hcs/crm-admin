import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useAgentReviewDetail, useAgentReviewVerify } from '@/api/hooks/review/review';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { PageInfo } from '@/components/common/PageInfo';
import { AgentReviewDetailRes } from '@/api/hooks/review';
import { ReviewStepsCard } from '../withdrawal-detail/components/ReviewStepsCard';
import { RrhStepProps } from '@/components/common/RrhStep';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/contexts/loading';
import { AgentKyc } from './components/AgentKyc';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';

export type FormValue = {
  id: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export const AgentDetailPage = () => {
  const { t } = useTranslation();
  const back = useTabBackNavigation('/review/account-opening');
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('id') || '';
  const type = searchParams.get('type');
  const { data: agentRes, isLoading } = useAgentReviewDetail(agentId || '', {
    enabled: !!agentId,
  });
  const { withLoading } = useGlobalLoading();
  const { mutateAsync: check } = useAgentReviewVerify();
  const agentInfo = agentRes?.data as AgentReviewDetailRes['data'];
  const verifyStep = agentInfo?.detail?.verifyStep || '';
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '1',
      remark: '',
      verifyStep: '',
    },
  });

  const reviewSteps = [
    {
      label: agentInfo?.detail.createTime,
      content: agentInfo?.detail.userName + t('review.submitForReview'),
      status: 'complete',
    },
    ...(agentInfo?.verifyLogs.map(log => {
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
          id: agentId,
          verifyStatus: data.status,
          remark: data.remark,
          verifyStep: String(verifyStep),
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
      <PageInfo wrapperCls="py-3" title={t('reviewAgent.reviewAgentDetail')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex-1 gap-3 overflow-auto">
              <AgentKyc detail={agentInfo} />
            </div>
            <div className="relative md:w-93.5">
              <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
                <div>
                  <ReviewStepsCard reviewSteps={reviewSteps} />
                </div>
                {type === 'audit' && (
                  <CheckInfoCard back={back} roleName={agentInfo?.reviewer?.roleName || ''} />
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
