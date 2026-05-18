import { useGetKycColumnInfo } from '@/api/hooks/agent/agent';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhKycStatus } from '@/components/common/RrhKycStatus';
import { useTranslation } from 'react-i18next';

export const SumsubInfoDialog = ({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}) => {
  const { t } = useTranslation();
  const { data: personalInfoRes } = useGetKycColumnInfo(userId, '4');
  const kycInfo = personalInfoRes?.data.KYCInfo || [];
  return (
    <RrhDialog
      title={`${t('common.View')} ${t('accountOpening.identityInformationSumsub')}`}
      open={open}
      onOpenChange={setOpen}
      cancelShow={false}
    >
      <div className="flex flex-col gap-4">
        {kycInfo.map(info => (
          <div key={info.sumsubName} className="bg-accent flex items-center gap-4 rounded-lg p-4">
            <div className="text-lg font-semibold">{info.sumsubName}</div>
            <RrhKycStatus status={info.status} />
          </div>
        ))}
      </div>
    </RrhDialog>
  );
};
