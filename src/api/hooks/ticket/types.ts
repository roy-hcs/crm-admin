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
