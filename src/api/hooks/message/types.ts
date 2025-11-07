// Message module types
import { BasicParams, BasicRes } from '../../types';

// Message List related types
export type GetMsgListParams = BasicParams & {
  type: string;
  params: {
    fuzzyTitle?: string;
    fuzzyName?: string;
    sendStartTime?: string;
    sendEndTime?: string;
  };
};

export type GetMsgListRes = BasicRes<MsgListItem>;

export type MsgListItem = {
  create_time: string;
  user_last_name: string;
  user_name: string;
  modify_time: string | null;
  send_email: string;
  modify_by: string | null;
  title: string;
  type: number;
  content: string;
  allUser: string;
  is_now: number;
  create_by: string;
  send_time: string;
  receive_type: number;
  expire: string | null;
  id: string;
  status: number;
};
