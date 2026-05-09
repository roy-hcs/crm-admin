import {
  useCrmUserFinanceInfo,
  useCrmUserIdentityBasicInfo,
  useCrmUserManageInfo,
  useCrmUserProtocolInfo,
} from '@/api/hooks/review/review';
import { KycInfoDetailItem, KycInfoStep } from './KycInfoDetail';
import { KycInfoTimeline } from './KycInfoTimeline';
import { useMemo } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
// import { kycVerifyStatusMap, kycVerifyStatusTextMap } from '@/lib/constant';
import { useTranslation } from 'react-i18next';
import { KycStatus } from '@/components/common/RrhKycStatus';

type kycInfoSteps = KycInfoStep[];

export const KycInfoPage = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: manageData, isLoading: manageLoading } = useCrmUserManageInfo(id, {
    enabled: !!id,
  });
  const { data: financeData, isLoading: financeLoading } = useCrmUserFinanceInfo(id, {
    enabled: !!id,
  });
  const { data: identityBasicData, isLoading: identityBasicLoading } = useCrmUserIdentityBasicInfo(
    id,
    {
      enabled: !!id,
    },
  );
  const { data: protocolData, isLoading: protocolLoading } = useCrmUserProtocolInfo(id, {
    enabled: !!id,
  });

  const manageVerifyStatus = manageData?.data?.verifyStatus || 0;
  const financeVerifyStatus = financeData?.data?.verifyStatus || 0;
  const identityBasicVerifyStatus = identityBasicData?.data?.verifyStatus || 0;
  const protocolVerifyStatus = protocolData?.data?.allProtocol.some(i => i.status === 0);
  const manageCreateTime = manageData?.data?.crmUser?.createTime || '';
  const financeCreateTime = financeData?.data?.crmUser?.createTime || '';
  const identityBasicCreateTime = identityBasicData?.data?.crmUser?.createTime || '';
  const protocolCreateTime = protocolData?.data?.allProtocol.length
    ? protocolData.data.allProtocol[0]?.createTime
    : '';

  const personal = useMemo<KycInfoDetailItem[]>(() => {
    if (!manageData) return [];
    return manageData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
    }));
  }, [manageData]);

  const finance = useMemo<KycInfoDetailItem[]>(() => {
    if (!financeData) return [];
    return financeData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
    }));
  }, [financeData]);

  const identityBasic = useMemo<KycInfoDetailItem[]>(() => {
    if (!identityBasicData) return [];
    return identityBasicData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
      type: i.columnType,
    }));
  }, [identityBasicData]);
  const protocol = useMemo<KycInfoDetailItem[]>(() => {
    if (!protocolData) return [];
    return protocolData.data.allProtocol.map(i => ({
      label: i.protocolName,
      value: i.protocolName || '-',
    }));
  }, [protocolData]);

  const steps: kycInfoSteps = useMemo(() => {
    return [
      {
        status: manageVerifyStatus as KycStatus,
        label: t('accountOpening.personalInformation'),
        content: '',
        type: 'list',
        time: manageCreateTime,
        detail: personal,
        defaultExpanded: true,
      },
      {
        status: financeVerifyStatus as KycStatus,
        label: t('accountOpening.financialInformation'),
        content: '',
        type: 'list',
        time: financeCreateTime,
        detail: finance,
      },
      {
        status: identityBasicVerifyStatus as KycStatus,
        label: t('accountOpening.identityInformation'),
        content: '',
        type: 'mediaList',
        time: identityBasicCreateTime,
        detail: identityBasic,
      },
      {
        // protocolVerifyStatus为true表示有协议未确认，状态为审核中；为false表示协议已确认，状态为审核通过
        status: protocolVerifyStatus === true ? 0 : (1 as KycStatus),
        label: t('accountOpening.protocolConfirmation'),
        content: '',
        type: 'cardList',
        time: protocolCreateTime,
        detail: protocol,
      },
    ];
  }, [
    finance,
    financeCreateTime,
    financeVerifyStatus,
    identityBasic,
    identityBasicCreateTime,
    identityBasicVerifyStatus,
    manageCreateTime,
    manageVerifyStatus,
    personal,
    protocol,
    protocolCreateTime,
    protocolVerifyStatus,
    t,
  ]);

  if (manageLoading || financeLoading || identityBasicLoading || protocolLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  return <KycInfoTimeline steps={steps} />;
};
