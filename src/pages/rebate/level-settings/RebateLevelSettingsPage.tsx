import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRebateLevelList } from '@/api/hooks/rebate';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RebateLevelItem } from '@/api/hooks/rebate';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const RebateLevelSettingsPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: rebateLevelList, isLoading: rebateLevelListLoading } = useRebateLevelList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const allColumns: CRMColumnDef<RebateLevelItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'level',
      header: t('table.level'),
      accessorFn: row => row.level || '-',
    },
    {
      id: 'levelName',
      header: t('table.levelName'),
      accessorFn: row => row.levelName || '-',
    },
    // TODO:之后的三项都有点击弹窗的交互
    {
      id: 'relatedAccountCount',
      header: t('table.relatedAccountCount'),
      accessorFn: row => row.relatedAccountCount || '-',
    },
    {
      id: 'relatedRebateRuleCount',
      header: t('table.relatedRebateRuleCount'),
      accessorFn: row => row.relatedRebateRuleCount || '-',
    },
    {
      id: 'relatedRebateTemplateCount',
      header: t('table.relatedRebateTemplateCount'),
      accessorFn: row => row.relatedRebateTemplateCount || '-',
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      label: t('common.Operation'),
      fixed: 'right',
      size: 50,
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.Edit'), value: 'edit' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={() => {}}
        />
      ),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('rebate-level-settings-table', allColumns);

  return (
    <div>
      <PageInfo title={t('ProductGroup.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <Button variant="outline">{t('common.add')}</Button>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={rebateLevelList?.rows || []}
          pageCount={Math.ceil(+(rebateLevelList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={rebateLevelListLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
