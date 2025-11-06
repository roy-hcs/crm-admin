export type BasicParams = {
  pageNum?: number;
  pageSize?: number;
  orderByColumn?: string;
  isAsc?: string;
};

export type BasicRes<T> = {
  code: number;
  msg: string;
  total: string;
  rows: T[];
};

export type BaseEntity = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
};
