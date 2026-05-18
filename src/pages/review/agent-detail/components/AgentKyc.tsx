import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KycInfoDetailItem,
  KycInfoStep,
} from '../../account-opening-detail/kyc-info/KycInfoDetail';
import { KycInfoTimeline } from '../../account-opening-detail/kyc-info/KycInfoTimeline';
import { AgentReviewDetailRes } from '@/api/hooks/review/types';
import { KycStatus, kycStatusTextMap } from '@/components/common/RrhKycStatus';

type kycInfoSteps = KycInfoStep[];

export const AgentKyc = ({ detail }: { detail: AgentReviewDetailRes['data'] }) => {
  const { t } = useTranslation();
  const createTime = detail?.detail?.createTime || '';
  const userName = detail?.detail?.userName || '';
  const mobile = detail?.detail?.mobile || '';
  const email = detail?.detail?.email || '';
  const inviterName = detail?.detail?.inviterName || '';
  const havingAgent = detail?.detail?.havingAgent || '';
  const verifyStatus = detail?.detail?.verifyStatus || 0;
  const crmIinfoVerifyStatus = detail?.detail?.columns
    ? verifyStatus
    : detail?.crmIinfoVerifyList?.[0]?.status || 0;

  const personal = useMemo<KycInfoDetailItem[]>(() => {
    return [
      {
        label: t('table.fullName'),
        value: userName,
      },
      {
        label: t('table.mobile'),
        value: mobile,
      },
      {
        label: t('table.email'),
        value: email,
      },
      {
        label: t('rules.inviter'),
        value: inviterName,
      },
      {
        label: t('reviewAgent.havingAgent'),
        value: havingAgent ? t('common.yes') : t('common.no'),
      },
    ];
  }, [email, havingAgent, inviterName, mobile, t, userName]);

  const identityBasic = useMemo<KycInfoDetailItem[]>(() => {
    if (detail?.detail?.columns) {
      return detail.detail.columns.map(i => ({
        label: i.columnName,
        value: i.columnValue || '-',
        type: i.columnType,
      }));
    } else {
      return detail?.crmIinfoVerifyList.map(i => ({
        label: t('table.reviewStatus'),
        value: `${i.sumsubLevelName} ${t(kycStatusTextMap[crmIinfoVerifyStatus as KycStatus])}`,
      }));
    }
  }, [crmIinfoVerifyStatus, detail?.crmIinfoVerifyList, detail.detail.columns, t]);

  const steps: kycInfoSteps = useMemo(() => {
    return [
      {
        status: verifyStatus as KycStatus,
        label: t('reviewAgent.agentInfo'),
        content: '',
        type: 'list',
        time: createTime,
        detail: personal,
        defaultExpanded: true,
      },
      {
        status: crmIinfoVerifyStatus as KycStatus,
        label: t('accountOpening.identityInformation'),
        content: '',
        type: 'mediaList',
        time: createTime,
        detail: identityBasic,
        defaultExpanded: true,
      },
    ];
  }, [createTime, crmIinfoVerifyStatus, identityBasic, personal, t, verifyStatus]);

  return <KycInfoTimeline steps={steps} />;
};
