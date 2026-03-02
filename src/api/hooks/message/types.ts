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

export type MsgTemplateListParams = BasicParams;

export type MsgTemplateListRes = BasicRes<MsgTemplateItem>;

export type MsgTemplateItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  title: string | null;
  content: string | null;
  modifyBy: string | null;
  modifyTime: string | null;
};

export type MsgDetail = {
  msg: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: object;
    id: string | null;
    title: string | null;
    type: string | null;
    status: string | null;
    isNow: string | null;
    sendTime: string | null;
    expire: string | null;
    modifyBy: string | null;
    modifyTime: string | null;
    receiveType: string | null;
    content: string | null;
    sendEmail: string | null;
    source: string | null;
    primaryLanguage: string | null;
    roles: string[] | null;
    tags: string[] | null;
  };
  remainTimes: string | null;
  msgRoleSelected: string[] | null;
  languages: string[] | null;
  allEmailConfig: Array<{
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: object;
    id: string | null;
    supplier: string | null;
    security: number | null;
    smtpAddr: string | null;
    port: string | null;
    userName: string | null;
    pwd: string | null;
    email: string | null;
    sendUser: string | null;
    status: number | null;
    modifyTime: string | null;
    modifyBy: string | null;
    emailSource: string | null;
    refreshToken: string | null;
    apiKey: string | null;
  }>;
  msgLangs: Array<{
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: object;
    id: string | null;
    msgId: string | null;
    language: string | null;
    title: string | null;
    content: string | null;
  }>;
  sendEmailList: string[] | null;
  dailyTimes: string | null;
  number: number | null;
  msgTemplateList: Array<{
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: object;
    id: string | null;
    title: string | null;
    content: string | null;
    modifyBy: string | null;
    modifyTime: string | null;
  }>;
  allRoles: string[] | null;
  allTags: string[] | null;
  msgTagSelected: string[] | null;
};

export type AddMsgParams = {
  accountNames: string;
  accounts?: string;
  expire?: string | null;
  isNow: string;
  language: string[];
  msgLangs: {
    content: string;
    language: string;
    title: string;
  }[];
  primaryLanguage: string;
  receiveType: string;
  roles?: string[] | null;
  sendEmail: string[];
  sendEmails: string[];
  sendTime: string;
  tags?: string[] | null;
  type: string;
  userIds?: string[] | null;
};
