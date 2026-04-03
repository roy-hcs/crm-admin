import {
  useCrmUserFinanceInfo,
  useCrmUserIdentityBasicInfo,
  useCrmUserManageInfo,
  useCrmUserProtocolInfo,
} from '@/api/hooks/review/review';
import { RrhCard } from '@/components/common/RrhCard';
import { KycInfoDetail } from './KycInfoDetail';
import { useMemo } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { cn } from '@/lib/utils';
import { KycStatus } from '../components/KycVerifyStatus';
import { kycVerifyStatusMap, kycVerifyStatusTextMap } from '@/lib/constant';

type kycInfoType = 'personal' | 'finance' | 'identityBasic' | 'agreement';

type kycInfoDetail = {
  label: string;
  value: string;
  type?: number;
};

export type kycInfoItem = {
  status: KycStatus;
  statusText: string;
  label: string;
  content: string;
  type: kycInfoType;
  time: string;
  detail: kycInfoDetail[];
};

type kycInfoSteps = kycInfoItem[];

export const KycInfoPage = ({ id }: { id: string }) => {
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
  const personal = useMemo(() => {
    if (!manageData) return [];
    return manageData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
    }));
  }, [manageData]);

  const finance = useMemo(() => {
    if (!financeData) return [];
    return financeData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
    }));
  }, [financeData]);

  const identityBasic = useMemo(() => {
    if (!identityBasicData) return [];
    return identityBasicData.data.columns.map(i => ({
      label: i.columnName,
      value: i.columnValue || '-',
      type: i.columnType,
    }));
  }, [identityBasicData]);
  const protocol = useMemo(() => {
    if (!protocolData) return [];
    return protocolData.data.allProtocol.map(i => ({
      label: i.protocolName,
      value: i.protocolName || '-',
    }));
  }, [protocolData]);

  const steps: kycInfoSteps = useMemo(() => {
    return [
      {
        status: kycVerifyStatusMap[manageVerifyStatus] as KycStatus,
        statusText: kycVerifyStatusTextMap[manageVerifyStatus],
        label: '个人信息',
        content: '',
        type: 'personal',
        time: '2026-04-01 17:23:08',
        detail: personal,
      },
      {
        status: kycVerifyStatusMap[financeVerifyStatus] as KycStatus,
        statusText: kycVerifyStatusTextMap[financeVerifyStatus],
        label: '财务信息',
        content: '',
        type: 'finance',
        time: '2026-04-01 17:23:08',
        detail: finance,
      },
      {
        status: kycVerifyStatusMap[identityBasicVerifyStatus] as KycStatus,
        statusText: kycVerifyStatusTextMap[identityBasicVerifyStatus],
        label: '身份信息-Basic',
        content: '',
        type: 'identityBasic',
        time: '2026-04-01 17:23:08',
        detail: identityBasic,
      },
      {
        // protocolVerifyStatus为true表示有协议未确认，状态为审核中；为false表示协议已确认，状态为审核通过
        status: kycVerifyStatusMap[protocolVerifyStatus === true ? 0 : 1] as KycStatus,
        statusText: kycVerifyStatusTextMap[protocolVerifyStatus === true ? 0 : 1],
        label: '协议确认',
        content: '',
        type: 'agreement',
        time: '2026-04-01 17:23:08',
        detail: protocol,
      },
    ];
  }, [
    finance,
    financeVerifyStatus,
    identityBasic,
    identityBasicVerifyStatus,
    manageVerifyStatus,
    personal,
    protocol,
    protocolVerifyStatus,
  ]);

  if (manageLoading || financeLoading || identityBasicLoading || protocolLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="flex w-full">
            <div className="relative flex w-6 flex-col items-center overflow-hidden">
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-6 bottom-0 left-1/2 z-0 h-full w-[1px] -translate-x-1/2',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
              )}
              <div className="relative size-6 rounded-full">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full opacity-35',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
              </div>
            </div>
            <div className="flex-1 pb-6 pl-6">
              <RrhCard>
                <KycInfoDetail step={step} />
              </RrhCard>
            </div>
          </div>
        );
      })}
    </div>
  );
};
