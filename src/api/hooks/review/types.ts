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
