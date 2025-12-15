// Common/shared types
// 列配置元数据类型
export interface ColumnMeta {
  id: string;
  label: string;
  defaultVisible: boolean;
}

// 列可见性配置类型
export interface ColumnVisibilityConfig {
  id: string;
  display: boolean;
  order: number;
}

export type GlobalSearchResItem = {
  id: string;
  nameCn: string;
  nameEn: string;
  type: number;
  popular: number;
  globalizationKey: string;
  pagePath: string;
  permission: string;
  clickCount: number;
  userId: null | string;
};
export type GlobalSearchRes = GlobalSearchResItem[];
