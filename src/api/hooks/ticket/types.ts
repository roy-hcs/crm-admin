import { BasicParams, BasicRes } from '@/api/types';

export type CrmTicketParams = BasicParams & {
  isAll?: string;
  orderId?: string;
  content?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  receiverId?: string;
  belongUser?: string;
};

export type CrmTicketItem = {
  id: string;
  orderId: string;
  belongUserId: string;
  content: string;
  priority: number;
  status: number;
  receiverId: string;
  isFollow: number;
  carbonCopy: string | null;
  remark: string | null;
  recentReplyTime: string | null;
  creatorType: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string | null;
  startDate: string | null;
  endDate: string | null;
  fileUrls: string | null;
  fileNames: string | null;
  orderFiles: string | null;
  belongUser: string | null;
  receiver: string | null;
  isAll: string | null;
  loginUserId: string | null;
  followerType: string | null;
};

export type CrmTicketRes = BasicRes<CrmTicketItem>;

export type TicketTabsParams =
  | 'all'
  | 'unprocessed'
  | 'processing'
  | 'concerned'
  | 'ccme'
  | 'created';

export type TicketAddParams = {
  belongUserId: string;
  content: string;
  receiverId: string;
  carbonCopy: string;
  priority: string;
  isFollow: string;
  fileUrls: string;
  fileNames: string;
};

export type AllocatedUsersItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  userId: string;
  roleId: string | null;
  loginName: string | null;
  userName: string;
  userLastName: string;
  email: string;
  mzone: string;
  phonenumber: string;
  sex: string | null;
  avatar: string | null;
  password: string | null;
  salt: string | null;
  status: '1';
  delFlag: string | null;
  loginIp: string | null;
  loginDate: string | null;
  chatId: string | null;
  userRole: {
    userId: string;
    roleId: string | null;
    role: string | null;
  };
  roles: Array<string>;
  roleIds: Array<string> | null;
  postIds: Array<string> | null;
  googleKey: string | null;
  boundGoogle: string | null;
  onlineStatus: string | null;
  userType: string | null;
  expiryTime: string | null;
  duration: string | null;
  admin: boolean;
  wholeName: string;
};
export type AllocatedUsers = BasicRes<AllocatedUsersItem>;
