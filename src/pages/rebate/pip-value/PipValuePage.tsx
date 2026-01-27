import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useGetRebateBasePoint, RebateBasePointParams } from '@/api/hooks/rebate';
import { PipValueForm } from './PipValueForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useDictType } from '@/api/hooks/system/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/hooks/review/types';
import { RebateBasePointItem } from '@/api/hooks/rebate';
import { serverMap } from '@/lib/constant';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const PipValuePage = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [otherParams, setOtherParams] = useState<Omit<RebateBasePointParams, keyof BasicParams>>({
    pointValueName: '',
    pointValueType: '',
    serverId: '',
    serverType: '',
  });

  const { data: serverTypes } = useDictType('sys_mt_service_type');

  const { data: rebateBasePoint, isLoading: rebateBasePointLoading } = useGetRebateBasePoint({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      pointValueName: '',
      pointValueType: '',
      serverId: '',
      serverType: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<RebateBasePointItem, unknown>[] = [
    {
      id: 'serialNumber',
      header: t('table.sort'),
      accessorFn: row => row.serialNumber,
    },
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'pointValueName',
      header: t('table.pointValueName'),
      accessorFn: row => row.pointValueName || '-',
    },
    {
      id: 'serverType',
      header: t('table.transactionPlatform'),
      cell: ({ row }) => {
        return row.original.serverType ? serverMap[row.original.serverType] : '-';
      },
    },
    {
      id: 'serverName',
      header: t('table.serverName'),
      accessorFn: row => row.serverName || '-',
    },
    {
      id: 'rebateType',
      header: t('table.rebateType'),
      cell: ({ row }) => {
        const exceedLength = row.original.rebateType.length > 20;
        const content = exceedLength
          ? row.original.rebateType.slice(0, 20) + '...'
          : row.original.rebateType;
        return exceedLength ? (
          <ToolTip
            maxWidth="800px"
            content={<div className="break-all">{row.original.rebateType}</div>}
          >
            <div>{content}</div>
          </ToolTip>
        ) : (
          <div>{content}</div>
        );
      },
    },
    {
      id: 'pointValueType',
      header: t('table.pointValueType'),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.pointValueType === 1
              ? t('table.fixedPipValue')
              : t('table.floatingPipValue')}
          </div>
        );
      },
    },
    {
      id: 'pointValue',
      header: t('table.pointValue'),
      cell: ({ row }) => {
        const rowData = row.original;
        if (rowData.pointValueType === 1) {
          return <div>{rowData.pointValue}</div>;
        } else if (rowData.pointValueType === 2) {
          return (
            <div>
              <span>{rowData.pointValueLots}</span>
              <span>*</span>
              <span>
                {rowData.pointValueRules === 2
                  ? t('common.contractSize')
                  : t('common.contractNumber')}
              </span>
            </div>
          );
        }
      },
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
    useColumnVisibility('pip-value-reports-table', allColumns);

  return (
    <div>
      <PageInfo title={t('pipValueSettings.title')} desc={t('pipValueSettings.warn')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.pointValueName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, pointValueName: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              asChild
              Trigger={
                <Button variant="ghost" className="size-8 cursor-pointer">
                  <Funnel className="size-4" />
                </Button>
              }
              title="Filter"
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <PipValueForm
                params={otherParams}
                reset={reset}
                setParams={setOtherParams}
                serverTypes={serverTypes || []}
              />
            </RrhDrawer>
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
          data={rebateBasePoint?.rows || []}
          pageCount={Math.ceil(+(rebateBasePoint?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={rebateBasePointLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
