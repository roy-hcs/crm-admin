export type AgentApplyItem = {
  // generate type according to above json
  createBy: string;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  lastName: string;
  name: string;
  mzone: string;
  mobile: string;
  email: string;
  pwd: string;
  salt: string;
  certiricateType: string | null;
  certiricateNo: string | null;
  certiricateFront: string | null;
  certiricateBack: string | null;
  havingAgent: number;
  verifyStatus: number;
  applySource: number;
  inviter: string;
  spreadLinkCodeId: string;
  userId: string | null;
  showId: string | null;
  verifyTime: string | null;
  verifyUser: string | null;
  inviterName: string | null;
  verifyStep: number;
  verifyUserName: string | null;
  language: string;
  identityInfo: string;
  defaultRole: string;
  columns: string | null;
  userName: string;
  vuserName: string;
};

export type AgentApplyListRes = {
  code: number;
  msg: string;
  rows: AgentApplyItem[];
  total: string;
};

export type AgentApplyListParams = {
  pageNum?: number;
  pageSize?: number;
  orderByColumn?: string;
  isAsc?: string;
  name?: string;
  mobile?: string | number;
  email?: string;
  verifyStatus?: number | string;
  applySource?: number | string;
  verifyUserName?: string;
  params: {
    beginTime?: string;
    endTime?: string;
  };
};
