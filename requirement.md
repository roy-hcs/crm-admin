1.全局搜索DataTable组件
2.如果DataTable组件在页面中的结构形如
<PageInfo />
<div>...</div>
<DataTable />
则使用 @/src/components/common/TableContentWrapper.tsx  包裹div和DataTable，即
<PageInfo />
<TableContentWrapper>
  <div>...</div>
  <DataTable />
</TableContentWrapper>
3.输出可以参考\src\pages\reports\financial\wallet-transactions\WalletTransactionsPage.tsx