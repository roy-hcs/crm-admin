# 组件构造规则

本项目有一套封装好的组件体系，构造页面时必须遵循以下规则。

---

## 一、表单（Form）构造

### 1. 使用 Zod + React Hook Form

所有表单必须使用 Zod 定义校验 schema，并通过 `zodResolver` 集成到 React Hook
Form：

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, t('rules.required', { field: t('common.name') })),
  type: z.string().min(1, t('rules.required', { field: t('common.type') })),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', type: '' },
});
```

### 2. 使用 `RrhForm` 包裹表单内容

`RrhForm` 同时提供自定义 `FormProvider` 上下文和 shadcn `Form`，所有 `Form*`
组件通过 `useCrmFormContext()` 内部获取 form 对象，**不需要手动传 `control`**：

```tsx
import { RrhForm } from '@/components/form/RrhForm';

<RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
  <FormInput name="name" label="名称" />
  <FormSelect name="type" label="类型" options={typeOptions} />
  <RrhButton type="submit">提交</RrhButton>
</RrhForm>;
```

例外：`FormDateRangeInput` 和 `FormHiddenInput` 需要直接传 `control` prop。

### 3. 使用封装好的 Form 组件

**禁止**直接使用原生 `<input>` 或裸 `<Select>`
构造表单字段，必须使用以下组件（位于 `src/components/form/`）：

| 组件                    | 用途                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `FormInput`             | 文本输入，支持 `maxLength` 字数计数、`rightElement` 右侧附加元素 |
| `FormSelect`            | 单选下拉                                                         |
| `FormMultiSelect`       | 多选（支持搜索、无限滚动、最大选择数）                           |
| `FormTextarea`          | 多行文本，支持字数计数                                           |
| `FormDateInput`         | 日期选择（可选时间）                                             |
| `FormDateRangeInput`    | 日期范围选择（需传 `control`）                                   |
| `FormRadio`             | 单选按钮组                                                       |
| `FormCheckBoxGroup`     | 复选框组                                                         |
| `FormSwitch`            | 开关（值为 `'1'` / `'0'` 字符串）                                |
| `FormPhoneInput`        | 手机号输入                                                       |
| `FormTimeOfDayInput`    | 时间输入                                                         |
| `FormMonthPicker`       | 月份选择                                                         |
| `FormHiddenInput`       | 隐藏字段（需传 `control`）                                       |
| `FormLeftSelectInput`   | 左侧带下拉的输入框                                               |
| `FormSearchMultiSelect` | 可搜索多选                                                       |

公共 props：`name`（必须）、`label`、`verticalLabel`（布尔，默认 false）、`className`、`labeTipsDom`（标签旁提示图标）。

---

## 二、表格（Table）构造

### 1. 必须使用 `useColumnVisibility` 管理列

每个包含表格的页面都必须使用 `useColumnVisibility`
hook，实现列的显隐控制、拖拽排序、localStorage 持久化：

```tsx
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { CRMColumnDef, DataTable } from '@/components/table';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

// 定义列
const allColumns = useMemo<CRMColumnDef<CrmUserItem, unknown>[]>(
  () => [
    {
      id: 'select',
      header: ({ table }) => <Checkbox ... />,
      cell: ({ row }) => <Checkbox ... />,
      enableSorting: false,
      enableHiding: false,
      label: t('common.select'),
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.userName,
      cell: ({ row }) => <div>{row.original.userName}</div>,
    },
    // 操作列固定在右侧
    {
      id: 'operation',
      header: () => <div className="flex justify-center">{t('common.Operation')}</div>,
      cell: ({ row }) => <RrhDropdown ... />,
      fixed: 'right',
      size: 50,
    },
  ],
  [t, /* 其他依赖 */],
);

// 使用 hook
const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
  useColumnVisibility('crm-accounts-table', allColumns);
```

- 第一个参数是 tableId，用于 localStorage 持久化 key（格式：`table-column-visibility-{tableId}`）
- 返回的 `tableColumns` 是经过显隐过滤和排序后的列数组，直接传给 `DataTable`

### 2. 必须添加列控制按钮

使用 `ColumnVisibilityButton` 组件，放在工具栏区域：

```tsx
<ColumnVisibilityButton
  columnMeta={columnMeta}
  visibleColumns={visibleColumns}
  onToggle={toggleColumn}
  onBatchReorder={batchUpdateColumns}
  columns={columns}
/>
```

### 3. 使用 `DataTable` 组件渲染表格

```tsx
<DataTable
  columns={tableColumns}
  data={data?.rows || []}
  pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
  pageIndex={pageNum}
  pageSize={pageSize}
  onPageChange={setPageNum}
  onPageSizeChange={setPageSize}
  loading={isLoading}
/>
```

`CRMColumnDef` 扩展了 TanStack
`ColumnDef`，额外支持：`fixed`（列固定）、`width`、`minWidth`、`label`（列控制按钮的显示名）。

### 4. 使用 `TableContentWrapper` 包裹表格区域

```tsx
<TableContentWrapper>
  {/* 工具栏 */}
  <div className="mb-3 flex justify-between">
    <div className="flex gap-2">
      {/* 搜索框、筛选抽屉等 */}
    </div>
    <div className="flex items-center gap-2">
      {/* 刷新、列控制、新增等按钮 */}
      <ColumnVisibilityButton ... />
    </div>
  </div>
  {/* 表格 */}
  <DataTable ... />
</TableContentWrapper>
```

---

## 三、页面布局

标准页面结构遵循以下顺序：

```
1. PageInfo        — 页面标题和描述
2. 标签/统计区域    — 可选，如 AccountTags
3. TableContentWrapper
   ├── 工具栏（搜索、筛选、列控制、操作按钮）
   ├── DataTable
   └── 弹窗组件（ResetPassword、DeleteAccount 等）
```

```tsx
<div>
  <PageInfo title={t('page.title')} desc={t('page.desc')} />
  <TableContentWrapper>{/* 工具栏 + 表格 + 弹窗 */}</TableContentWrapper>
</div>
```

---

## 四、弹窗与抽屉

### RrhDialog — 响应式弹窗（桌面 Dialog / 移动 Drawer）

```tsx
<RrhDialog
  title="标题"
  open={isOpen}
  onOpenChange={setOpen}
  variant="default" // default | small | middle | large
  onConfirm={handleConfirm}
  confirmText="确定"
  cancelText="取消"
  type="submit" // view（点击确认直接关闭）| submit（使用 RrhButton）
  formLoading={isPending} // 显示加载遮罩
>
  {children}
</RrhDialog>
```

### RrhDrawer — 侧滑抽屉

```tsx
<RrhDrawer
  Trigger={<Button>打开</Button>} // 触发器，或用 open/setOpen 受控
  title="筛选"
  responsiveDirection={{ mobile: 'bottom', desktop: 'right' }}
  headerShow={false}
  footerShow={false}
  asChild
>
  {children}
</RrhDrawer>
```

### RrhDropdown — 下拉操作菜单

常用于表格行操作列：

```tsx
<RrhDropdown
  Trigger={<Ellipsis className="size-4" />}
  dropdownList={[
    { label: t('common.View'), value: 'view' },
    { label: t('common.delete'), value: 'delete' },
  ]}
  callToAction={action => {
    switch (action) {
      case 'view':
        break;
      case 'delete':
        break;
    }
  }}
/>
```

---

## 五、其他约定

- **路由跳转**：使用 `useTabActions` 的 `openTab` 方法，不要直接用 `navigate`
- **按钮**：使用 `RrhButton`（支持 `loading` 状态和 `Icon` prop），不要裸用
  `<Button>` 做需要加载状态的按钮
- **搜索框**：使用 `RrhInputWithIcon` 组件
- **导出**：使用 `ExportButton` 组件
- **数据请求**：使用 `src/api/hooks/` 下封装好的 React Query hooks
- **分页状态**：`pageNum` 从 0 开始，传给 API 时 `pageNum + 1`
- **i18n**：所有文案必须通过 `t('key')` 获取，禁止硬编码文字
- **样式**：使用 `cn()` 合并 className，遵循 Tailwind CSS 规范
