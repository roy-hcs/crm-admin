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

export type TicketEditParams = {
  id: string;
  content: string;
  receiverId: string;
  status: string | number;
  priority: string;
  fileUrls: string;
  fileNames: string;
  carbonCopy: string;
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

export type OrderItem = {
  id: string | null;
  orderId: string | null;
  belongUserId: string | null;
  content: string | null;
  priority: string | null;
  status: number | null;
  receiverId: string | null;
  isFollow: number | null;
  carbonCopy: string | null;
  remark: string | null;
  recentReplyTime: string | null;
  creatorType: number | null;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  startDate: string | null;
  endDate: string | null;
  fileUrls: string | null;
  fileNames: string | null;
  orderFiles: Array<{
    id: string | null;
    linkId: string | null;
    fileName: string | null;
    fileUrl: string | null;
    sort: number | null;
  }> | null;
  belongUser: string | null;
  receiver: string | null;
  isAll: string | null;
  loginUserId: string | null;
  followerType: string | null;
};
export type Replies = {
  id: string | null;
  orderId: string | null;
  replyerType: number | null;
  replyerId: string | null;
  content: string | null;
  replyTime: string | null;
  readStatus: number | null;
  delFlag: string | null;
  orderFiles: [
    {
      id: string | null;
      linkId: string | null;
      fileName: string | null;
      fileUrl: string | null;
      sort: number | null;
    },
  ];
  replyer: string | null;
  fileUrls: string | null;
  fileNames: string | null;
  replyerAvatar: string | null;
};

export type CrmTicketDetailRes = {
  code: number;
  data: {
    ccNames: string | null;
    order: OrderItem;
    replies: Replies[];
  };
  msg: string;
  success: boolean;
};

export type ReplayOrderParams = {
  orderId: string;
  content: string;
  fileUrls: string;
  fileNames: string;
};
