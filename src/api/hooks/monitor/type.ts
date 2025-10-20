import { BasicParams } from '../review/types';

export type UserOperationsLogsRes = {
  code: number;
  msg: string;
  rows: OperationsLogsItem[];
  total: string;
};

export type OperationsLogsItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  operId: string;
  title: string;
  businessType: number;
  businessTypes: string[] | null;
  method: string;
  operatorType: number;
  operName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  status: number;
  operTime: string;
  browser: string | null;
  riskScore: number | null;
  os: string | null;
  ipRiskyFlag: boolean | null;
  devRiskyFlag: boolean | null;
};

export type UserOperationsLogsParams = BasicParams & {
  title: string;
  operName: string;
  status: string;
  businessTypes: string;
  params: {
    beginTime?: string;
    endTime?: string;
  };
};
