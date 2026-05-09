import {
  CrmInfoVerifyDetailOneRes,
  CrmInfoVerifyDetailThreeRes,
  CrmInfoVerifyDetailTwoRes,
  KycReviewInfoItem,
} from './types';

export type CrmInfoVerifyDetailQueryData = {
  infoDetails: KycReviewInfoItem[];
  istatus?: number;
  pstatus?: number;
  fstatus?: number;
  bstatus?: number;
};

export const createEmptyCrmInfoVerifyDetailData = (): CrmInfoVerifyDetailQueryData => ({
  infoDetails: [],
});

export const mapDetailOneResponse = (
  res: CrmInfoVerifyDetailOneRes,
): CrmInfoVerifyDetailQueryData => ({
  infoDetails: [
    {
      infoName: res.data.infoName,
      infoType: res.data.detail.infoType,
      detail: {
        status: res.data.detail.status,
        remark: res.data.detail.remark,
        verifyTime: res.data.detail.verifyTime,
      },
      columns: res.data.columns || [],
      verifyLogs: [],
    },
  ],
});

export const mapDetailTwoResponse = (
  res: CrmInfoVerifyDetailTwoRes,
): CrmInfoVerifyDetailQueryData => {
  const i18nPrefix = 'i18n:';
  const fullName =
    res.data.info.userLastName && res.data.info.userName
      ? `${res.data.info.userLastName}(${res.data.info.userName})`
      : res.data.info.userLastName || res.data.info.userName || '';
  const statusTextKey = `${i18nPrefix}accountOpening.kycVerifyStatus.${res.data.info.status}`;

  return {
    infoDetails: [
      {
        infoName: res.data.info.sumsubName,
        infoType: res.data.info.infoType,
        detail: {
          status: res.data.info.status,
          remark: res.data.info.remark,
          subTime: res.data.info.subTime,
          verifyTime: res.data.info.verifyTime,
          userLastName: res.data.info.userLastName,
          userName: res.data.info.userName,
        },
        columns: [
          {
            columnName: `${i18nPrefix}table.fullName`,
            columnValue: fullName || '-',
            columnType: 0,
          },
          {
            columnName: `${i18nPrefix}information.verificationLevel`,
            columnValue: res.data.info.sumsubName || '-',
            columnType: 0,
          },
          {
            columnName: `${i18nPrefix}information.verificationStatus`,
            columnValue: statusTextKey,
            columnType: 0,
          },
          {
            columnName: `${i18nPrefix}table.time`,
            columnValue: res.data.info.verifyTime || res.data.info.subTime || '-',
            columnType: 0,
          },
        ],
        verifyLogs: [],
      },
    ],
  };
};

export const mapDetailThreeResponse = (
  res: CrmInfoVerifyDetailThreeRes,
): CrmInfoVerifyDetailQueryData => ({
  infoDetails: res.data.infoDetails || [],
  istatus: res.data.istatus,
  pstatus: res.data.pstatus,
  fstatus: res.data.fstatus,
  bstatus: res.data.bstatus,
});
