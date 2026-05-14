import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLoginForm } from './AdminLoginForm';
import { useAdminLoginList, AdminLoginParams, AdminLoginItem } from '@/api/hooks/system';
import { CRMColumnDef, DataTable } from '@/components/table';
import { adminOperationsStatusOptions } from '@/lib/const';
import { RrhTag } from '@/components/common/RrhTag';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const AdminLoginPage = () => {
  const [params, setParams] = useState<AdminLoginParams['params']>({
    userName: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<AdminLoginParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    ipaddr: '',
    status: '',
    loginLocation: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useAdminLoginList({
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
      userName: '',
    }));
    setOtherParams({
      ipaddr: '',
      status: '',
      loginLocation: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<AdminLoginItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'user_last_name',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row.original?.user_last_name || row.original?.user_name) {
          return (
            <div>{`${row.original.user_last_name || ''} ${row.original.user_name || ''}`}</div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'operIp',
      header: t('common.operIp'),
      cell: ({ row }) => {
        return <div>{row?.original?.ipaddr || '-'}</div>;
      },
    },
    {
      id: 'operLocation',
      header: t('common.operLocation'),
      cell: ({ row }) => {
        return <div>{row?.original?.login_location || '-'}</div>;
      },
    },
    {
      id: 'operTime',
      header: t('common.operTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.login_time || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
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
      id: 'browser',
      header: t('adminLogin.browser'),
      cell: ({ row }) => {
        return <div>{row?.original?.browser || '-'}</div>;
      },
    },
    {
      id: 'os',
      header: t('adminLogin.os'),
      cell: ({ row }) => {
        return <div>{row?.original?.os || '-'}</div>;
      },
    },
    {
      id: 'msg',
      header: t('table.remarks'),
      cell: ({ row }) => {
        return <div>{row?.original?.msg || '-'}</div>;
      },
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('admin-login-logs-table', allColumns);
  return (
    <div>
      <PageInfo title={t('adminLogin.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('adminLogin.name') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, userName: e }));
              setPageNum(0);
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
              <AdminLoginForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={walletBalanceListLoading}
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
          data={walletBalanceList?.rows || []}
          columns={tableColumns}
          pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={walletBalanceListLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
