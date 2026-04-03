import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTranslation } from 'react-i18next';
import { AccountOverviewForm } from './AccountOverviewForm';
import { useCrmUserDealAccountList } from '@/api/hooks/review/review';
import { CrmUserDealAccountItem, CrmUserDealAccountListParams } from '@/api/hooks/review';
import { RrhSorter } from '@/components/common/RrhSorter';
import { useTabActions } from '@/hooks/useTabActions';

export const AccountOverviewPage = ({ id }: { id: string }) => {
  const [otherParams, setOtherParams] = useState<
    Omit<
      CrmUserDealAccountListParams,
      'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'
    >
  >({
    login: '',
    userId: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const { openTab } = useTabActions();
  const { data: data, isLoading: loading } = useCrmUserDealAccountList(
    id,
    {
      pageSize,
      pageNum: pageNum + 1,
      ...otherParams,
      isAsc: isAsc,
      orderByColumn: orderByColumn,
    },
    { enabled: !!id },
  );

  const reset = () => {
    setOtherParams({
      login: '',
      userId: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<CrmUserDealAccountItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'account',
      header: t('table.tradingAccount'),
      cell: ({ row }) => row?.original?.account || '-',
    },
    {
      id: 'serverName',
      header: t('table.server'),
      cell: ({ row }) => row?.original?.serverName || '-',
    },
    {
      id: 'serverGroup',
      header: t('table.groups'),
      cell: ({ row }) => row?.original?.serverGroup || '-',
    },
    {
      id: 'typeName',
      header: t('common.accountType'),
      cell: ({ row }) => row?.original?.params?.typeName || '-',
    },
    {
      id: 'lever',
      header: t('common.level'),
      cell: ({ row }) => (row?.original?.lever ? `1:${row.original.lever}` : '-'),
    },
    {
      id: 'balance',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.balance')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="balance"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) =>
        `${(row?.original?.balance || 0).toFixed(2)} ${row?.original?.currency || ''}`,
    },
    {
      id: 'netWorth',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.netWorth')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="netWorth"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) =>
        `${(row?.original?.netWorth || 0).toFixed(2)} ${row?.original?.currency || ''}`,
    },
    {
      id: 'creditAmount',
      header: t('table.creditAmount'),
      cell: ({ row }) =>
        `${(row?.original?.creditAmount || 0).toFixed(2)} ${row?.original?.currency || ''}`,
    },
    {
      id: 'registerTime',
      header: t('CRMAccountPage.registerTime'),
      cell: ({ row }) => row?.original?.registerTime || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: ({ row }) => (
        <RrhButton
          onClick={() => {
            const url = `/account/trading-accounts/detail?id=${row.original.id}&serviceType=${row.original.serviceType}`;
            openTab({
              key: url,
              title: t('trading.tradingAccountDetail'),
              path: url,
            });
          }}
          variant="ghost"
        >
          {t('common.View')}
        </RrhButton>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-accounts-table', allColumns);

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, login: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
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
              <AccountOverviewForm
                setOtherParams={setOtherParams}
                loading={loading}
                reset={reset}
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
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
};
