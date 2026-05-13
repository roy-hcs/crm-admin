import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhStepProps } from '@/components/common/RrhStep';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { PageInfo } from '@/components/common/PageInfo';
import { CheckInfoCard } from '@/components/common/CheckInfoCard';
import { useGlobalLoading } from '@/contexts/loading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import {
  NetBonusRewardRecordVerifyParams,
  useNetBonusRewardRecordReviewDetail,
  useNetBonusRewardRecordVerify,
} from '@/api/hooks/marketing';
import { ReviewStepsCard } from '@/pages/review/withdrawal-detail/components/ReviewStepsCard';
import { NetBonusRewardRecordsInfoCard } from './components/NetBonusRewardRecordsInfoCard';
import { CircleAlert } from 'lucide-react';
import { RrhForm } from '@/components/form/RrhForm';

type FormValue = NetBonusRewardRecordVerifyParams;

export const NetBonusRewardRecordsDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data: recordRes, isLoading } = useNetBonusRewardRecordReviewDetail(id || '', {
    enabled: !!id,
  });
  const recordData = recordRes?.data;
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const back = useTabBackNavigation('/marketing/net-bonus/reward-records');
  const recordInfo = recordData?.detail;
  const isAudit = searchParams.get('type') === 'audit';

  const { mutateAsync: verifyRewardRecord } = useNetBonusRewardRecordVerify();
  const form = useForm<FormValue>({
    defaultValues: {
      id: '',
      status: '1',
      actualAmount: '',
      remark: '',
      verifyStep: '',
      serverId: '',
      account: '',
    },
  });

  useEffect(() => {
    if (recordInfo?.status === 1 || recordInfo?.status === 0) {
      form.reset({
        id: recordInfo?.id || '',
        status: `${recordInfo?.status}`,
        actualAmount: recordInfo?.actualAmount || '',
        remark: recordInfo?.remark || '',
        verifyStep: `${recordInfo?.verifyStep ?? ''}`,
        serverId: recordInfo?.serverId || '',
        account: recordInfo?.account || '',
      });
    }
  }, [form, recordInfo]);

  const reviewSteps = useMemo<RrhStepProps['steps']>(() => {
    const submitStep: RrhStepProps['steps'][number] = {
      label: recordData?.detail.createTime ?? '',
      content: `${recordData?.detail.createBy ?? ''}${t('review.submitForReview')}`,
      status: 'complete',
    };

    const verifyLogs = recordData?.verifyLogs ?? [];
    const logSteps: RrhStepProps['steps'] = verifyLogs.map(log => {
      const isPass = log.verifyStatus === 1;
      return {
        label: log.verifyTime ?? '',
        content: `${log.userLastName ?? ''} ${log.userName ?? ''}${
          isPass ? t('review.reviewPass') : t('review.reviewReject')
        }`,
        status: isPass ? 'complete' : 'error',
      };
    });

    if (logSteps.length > 0) {
      return [submitStep, ...logSteps];
    }

    if (recordData?.detail.status === 1 || recordData?.detail.status === 0) {
      const isPass = recordData.detail.status === 1;
      return [
        submitStep,
        {
          label: recordData?.detail.updateTime ?? '',
          content: `${recordData?.detail.verifyUserName ?? ''}${
            isPass ? t('review.reviewPass') : t('review.reviewReject')
          }`,
          status: isPass ? 'complete' : 'error',
        },
      ];
    }

    return [submitStep];
  }, [recordData, t]);

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }

  if (!id || !recordInfo) {
    return <div></div>;
  }

  const onSubmit = async (data: FormValue) => {
    await withLoading(async () => {
      try {
        const params = {
          id: recordInfo?.id || '',
          status: data.status,
          remark: data.remark,
          verifyStep: `${recordInfo?.verifyStep ?? ''}`,
          actualAmount: recordInfo?.actualAmount || '',
          serverId: recordInfo?.serverId || '',
          account: recordInfo?.account || '',
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
      <PageInfo wrapperCls="py-3" title={t('netBonusRewardRecords.detail')} />
      <div className="text-destructive bg-destructive/5 mb-4 flex gap-3 rounded-lg px-4 py-3">
        <CircleAlert className="text-destructive mt-0.5 size-4" />
        <div>{t('netBonusRewardRecords.titleDesc')}</div>
      </div>
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1 gap-3 overflow-auto">
            <NetBonusRewardRecordsInfoCard data={recordData} />
          </div>
          <div className="relative md:w-76">
            <div className="sticky -top-6 flex flex-col gap-3 md:gap-6">
              <ReviewStepsCard reviewSteps={reviewSteps} />
              {isAudit && <CheckInfoCard back={back} />}
            </div>
          </div>
        </div>
      </RrhForm>
    </div>
  );
};
