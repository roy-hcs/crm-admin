import { KycStatus, toKycStatus } from '@/components/common/RrhKycStatus';
import { TFunction } from 'i18next';
import { StatusListType } from './components/StatusList';

type InformationKycStatuses = {
  pstatus?: number;
  fstatus?: number;
  istatus?: number;
  bstatus?: number;
};

export const buildInformationStatusList = (
  t: TFunction<'translation', undefined>,
  statuses: InformationKycStatuses,
): StatusListType => {
  const toStatus = (value?: number): KycStatus => toKycStatus(value);

  return [
    {
      key: 'personalInformation',
      label: t('accountOpening.personalInformation'),
      status: toStatus(statuses.pstatus),
    },
    {
      key: 'financialInformation',
      label: t('accountOpening.financialInformation'),
      status: toStatus(statuses.fstatus),
    },
    {
      key: 'identityInformation',
      label: t('accountOpening.identityInformation'),
      status: toStatus(statuses.istatus),
    },
    {
      key: 'protocolConfirmation',
      label: t('accountOpening.protocolConfirmation'),
      status: toStatus(statuses.bstatus),
    },
  ];
};
