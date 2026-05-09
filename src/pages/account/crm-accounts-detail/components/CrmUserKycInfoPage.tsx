import { useGetUserKycTab } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { kycVerifyStatusMap, kycVerifyStatusTextMap } from '@/lib/constant';
import { KycVerifyStatus } from '@/pages/review/account-opening-detail/components/KycVerifyStatus';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditKycInfoDialog } from './EditKycInfoDialog';
import { SumsubInfoDialog } from './SumsubInfoDialog';
import { cn } from '@/lib/utils';
import { useGetKycInfoProtocolInfo } from '@/api/hooks/agent/agent';
import { ProtocolItem } from '@/api/hooks/agent/types';
import { ProtocolInfoDialog } from './ProtocolInfoDialog';

export const CrmUserKycInfoPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { data } = useGetUserKycTab(userId);
  const [editType, setEditType] = useState<'read' | 'edit'>('read');
  const [type, setType] = useState<'2' | '3' | '4'>('2');
  const [kycInfoOpen, setKycInfoOpen] = useState(false);
  const [protocolInfoEnabled, setProtocolInfoEnabled] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<ProtocolItem | null>(null);
  const [protocolInfoOpen, setProtocolInfoOpen] = useState(false);
  const [sumsubInfoOpen, setSumsubInfoOpen] = useState(false);
  const kycInfo = data?.data;
  const { data: protocolInfoRes } = useGetKycInfoProtocolInfo(userId, {
    enabled: protocolInfoEnabled,
  });
  const openKycInfoDialog = (type: '2' | '3' | '4', editType: 'read' | 'edit') => {
    setType(type);
    setEditType(editType);
    setKycInfoOpen(true);
  };
  if (!kycInfo) {
    return null;
  }
  return (
    <div className="relative flex flex-col gap-4">
      {kycInfo.personalStatus === 'true' && (
        <RrhCard>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div>{t('accountOpening.personalInformation')}</div>
              <KycVerifyStatus
                status={kycVerifyStatusMap[kycInfo.bstatus]}
                statusText={kycVerifyStatusTextMap[kycInfo.bstatus]}
              />
            </div>
            <div className="flex gap-2">
              <RrhButton
                variant="outline"
                onClick={() => {
                  openKycInfoDialog('2', 'edit');
                }}
              >
                {t('common.Edit')}
              </RrhButton>
              <RrhButton
                onClick={() => {
                  openKycInfoDialog('2', 'read');
                }}
              >
                {t('common.View')}
              </RrhButton>
            </div>
          </div>
          {kycInfo.bstatus === 0 && <div>{kycInfo.breason}</div>}
        </RrhCard>
      )}
      {kycInfo.financialStatus === 'true' && (
        <RrhCard>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div>{t('accountOpening.financialInformation')}</div>
              <KycVerifyStatus
                status={kycVerifyStatusMap[kycInfo.fstatus]}
                statusText={kycVerifyStatusTextMap[kycInfo.fstatus]}
              />
            </div>
            <div className="flex gap-2">
              <RrhButton
                variant="outline"
                onClick={() => {
                  openKycInfoDialog('3', 'edit');
                }}
              >
                {t('common.Edit')}
              </RrhButton>
              <RrhButton
                onClick={() => {
                  openKycInfoDialog('3', 'read');
                }}
              >
                {t('common.View')}
              </RrhButton>
            </div>
          </div>
          {kycInfo.fstatus === 0 && <div>{kycInfo.freason}</div>}
        </RrhCard>
      )}
      {kycInfo.identityStatus === 'true' && (
        <RrhCard>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div>
                {kycInfo.mode === 'Sumsub'
                  ? t('accountOpening.identityInformationSumsub')
                  : t('accountOpening.identityInformation')}
              </div>
              <KycVerifyStatus
                status={kycVerifyStatusMap[kycInfo.istatus]}
                statusText={kycVerifyStatusTextMap[kycInfo.istatus]}
              />
            </div>
            <div className="flex gap-2">
              {kycInfo.mode !== 'Sumsub' && (
                <RrhButton
                  variant="outline"
                  onClick={() => {
                    openKycInfoDialog('4', 'edit');
                  }}
                >
                  {t('common.Edit')}
                </RrhButton>
              )}
              <RrhButton
                onClick={() => {
                  if (kycInfo.mode === 'Sumsub') {
                    setSumsubInfoOpen(true);
                  } else {
                    openKycInfoDialog('4', 'read');
                  }
                }}
              >
                {t('common.View')}
              </RrhButton>
            </div>
          </div>
          {kycInfo.istatus === 0 && <div>{kycInfo.ireason}</div>}
        </RrhCard>
      )}
      {kycInfo.protocolStatus === 'true' && (
        <RrhCard>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div>{t('accountOpening.protocolConfirmation')}</div>
            </div>
            <div className="flex gap-2">
              <RrhButton onClick={() => setProtocolInfoEnabled(true)}>{t('common.View')}</RrhButton>
            </div>
          </div>
        </RrhCard>
      )}
      <RrhCard
        className={cn(
          'bg-background absolute inset-x-0 top-0 min-h-full',
          protocolInfoEnabled ? '' : 'hidden',
        )}
      >
        <div className="mb-4 text-lg font-semibold">{t('accountOpening.protocolConfirmation')}</div>
        <div className="flex flex-col gap-4">
          {(protocolInfoRes?.data.allProtocol || []).map(item => (
            <div
              className="bg-accent cursor-pointer rounded-lg p-4 font-semibold"
              key={item.protocolName}
              onClick={() => {
                setActiveProtocol(item);
                setProtocolInfoOpen(true);
              }}
            >
              {item.protocolName}
            </div>
          ))}
        </div>
      </RrhCard>
      <EditKycInfoDialog
        open={kycInfoOpen}
        setOpen={setKycInfoOpen}
        userId={userId}
        editType={editType}
        countryList={kycInfo.countryList}
        type={type}
      />
      <SumsubInfoDialog open={sumsubInfoOpen} setOpen={setSumsubInfoOpen} userId={userId} />
      <ProtocolInfoDialog
        open={protocolInfoOpen}
        setOpen={setProtocolInfoOpen}
        protocolItem={activeProtocol}
      />
    </div>
  );
};
