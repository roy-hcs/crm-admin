// 获取审核设置列表
export type CrmPreferenceListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type CrmPreferenceItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: string | null;
  id: string | null;
  nameText: string | null;
  code: string | null;
  indexReviewCount: string | null;
  val: string | null;
  sort: string | null;
  groupCode: string | null;
};

export type CrmPreferenceListRes = {
  code: number;
  msg: string | null;
  rows: CrmPreferenceItem[];
  total: string;
};
// 审核-信息审核
export type CrmInfoVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  userId?: string;
  infoType?: string;
  status?: string;
  verifyUserName?: string;
  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmInfoVerifyItem = {
  id: string | null;
  userId: string | null;
  userName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  infoType: string | null;
  status: string | null;
  subTime: string | null;
  verifyUser: string | null;
  vUserName: string | null;
  vUserLastName: string | null;
  verifyTime: string | null;
  remark: string | null;
  verifyStep: string | null;
  verifyUserName: string | null;
  sumsubId: string | null;
  sumsubName: string | null;
  params: string | null;
};
export type CrmInfoVerifyListRes = {
  code: number;
  msg: string | null;
  rows: CrmInfoVerifyItem[];
  total: string;
};
// 审核-开户审核
export type CrmNewLoginVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  source?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    serverType?: string;
    serverProperty?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmNewLoginVerifyItem = {
  accountName: string | null;
  directBroker: string | null;
  accountGroupId: string | null;
  verifyStep: string | null;
  verifyUser: string | null;
  remark: string | null;
  language: string | null;
  verifyTime: string | null;
  source: string | null;
  vUserName: string | null;
  serverProperty: 1;
  serverId: string | null;
  subTime: string | null;
  mtGroup: string | null;
  staName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  id: string | null;
  credit: string | null;
  aliasName: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  lever: string | null;
  userName: string | null;
  userId: string | null;
  initialAmount: string | null;
  serverType: string | null;
  aid: string | null;
  account: string | null;
  status: string | null;
};
export type CrmNewLoginVerifyListRes = {
  code: number;
  msg: string | null;
  rows: CrmNewLoginVerifyItem[];
  total: string;
};
// 审核-绑定审核
export type BindVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  login?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    serverProperty?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type BindVerifyListItem = {
  aliasName: string | null;
  verifyStep: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string | null;
  userName: string | null;
  vUserName: string | null;
  params: string | null;
  userId: string | null;
  serverId: string | null;
  subTime: string | null;
  severProperty: string | null;
  userLastName: string | null;
  userShowId: string | null;
  subRemark: string | null;
  id: string | null;
  status: string | null;
};
export type BindVerifyListRes = {
  code: number;
  msg: string | null;
  rows: BindVerifyListItem[];
  total: string;
};
// 审核-杠杆审核
export type LeverageVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  login?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type LeverageVerifyListItem = {
  aliasName: string | null;
  verifyStep: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  currentLever: string | null;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string | null;
  userName: string | null;
  vUserName: string | null;
  userId: string | null;
  serverId: string | null;
  subTime: string | null;
  targetLever: string | null;
  userLastName: string | null;
  userShowId: string | null;
  id: string | null;
  status: string | null;
};
export type LeverageVerifyListRes = {
  code: number;
  msg: string | null;
  rows: LeverageVerifyListItem[];
  total: string;
};
