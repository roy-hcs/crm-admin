import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminOperationsForm } from './AdminOperationsForm';
import {
  useAdminOperLogList,
  useDictType,
  AdminOperLogParams,
  AdminOperLogItem,
} from '@/api/hooks/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { adminOperationsStatusOptions } from '@/lib/const';
import { RrhTag } from '@/components/common/RrhTag';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { getColumnMeta } from '@/lib/utils';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';

export const AdminOperationsPage = () => {
  const [params, setParams] = useState<AdminOperLogParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<AdminOperLogParams, 'params' | keyof BasicParams>
  >({
    title: '',
    operName: '',
    status: '',
    businessTypes: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: operTypeList } = useDictType('sys_oper_type');
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useAdminOperLogList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
    });
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<AdminOperLogItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row?.original?.operId}</div>,
    },
    {
      id: 'title',
      header: t('system.adminOperations.systemModule'),
      cell: ({ row }) => {
        return <div>{row?.original?.title || '-'}</div>;
      },
    },
    {
      id: 'operatorType',
      header: t('common.operType'),
      cell: ({ row }) => {
        const operType = (operTypeList || []).find(
          i => i.dictValue === String(row?.original?.operatorType),
        );
        return <div>{operType ? operType.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'operObject',
      header: t('common.operObject'),
      cell: ({ row }) => {
        return <div>{row?.original?.operObject || '-'}</div>;
      },
    },
    {
      id: 'operName',
      header: t('common.operName'),
      cell: ({ row }) => {
        return <div>{row?.original?.operName || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('common.operStatus'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          1: 'error',
          0: 'success',
        };
        const status = Number(row.original.status);
        const text =
          adminOperationsStatusOptions.find(it => Number(it.value) === status)?.label || '';
        return <RrhTag type={typeMap[status]}>{t(text)}</RrhTag>;
      },
    },
    {
      id: 'operIp',
      header: t('common.operIp'),
      cell: ({ row }) => {
        return <div>{row?.original?.operIp || '-'}</div>;
      },
    },
    {
      id: 'operLocation',
      header: t('common.operLocation'),
      cell: ({ row }) => {
        return <div>{row?.original?.operLocation || '-'}</div>;
      },
    },
    {
      id: 'operTime',
      header: t('common.operTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.operTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const columnMeta = getColumnMeta(allColumns);
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns } =
    useColumnVisibility('admin-operation-logs-table', columnMeta, allColumns);

  return (
    <div>
      <PageInfo title={t('system.adminOperations.title')} />
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('common.operName') })}
          className="h-9"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, operName: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <AdminOperationsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={walletBalanceListLoading}
              operTypeList={operTypeList || []}
              reset={reset}
              params={params}
              otherParams={otherParams}
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
        data={walletBalanceList?.rows || []}
        pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={walletBalanceListLoading}
      />
    </div>
  );
};
