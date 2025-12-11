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
