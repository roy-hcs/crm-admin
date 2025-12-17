import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { ReviewInternalTransferForm } from './ReviewInternalTransferForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { InternalTransferListParams, useInternalTransferList } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { InternalTransferItem } from '@/api/hooks/review';
import { RrhTag } from '@/components/common/RrhTag';
import { internalTransferReviewStatusMap } from '@/lib/constant';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhSorter } from '@/components/common/RrhSorter';

export const ReviewInternalTransferPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('desc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const [params, setParams] = useState<InternalTransferListParams['params']>({
    fuzzyStartTime: '',
    fuzzyEndTime: '',
    fuzzyOutAccount: '',
    fuzzyInAccount: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<InternalTransferListParams, 'params'>>({
    userId: '',
    status: '',
    verifyUserName: '',
    dealTicket: '',
  });

  const { data: internalTransferList, isLoading: internalTransferListLoading } =
    useInternalTransferList(
      {
        pageSize,
        pageNum: pageNum + 1,
        orderByColumn: 'status desc,subTime desc',
        isAsc: '',
        ...otherParams,
        params: {
          ...params,
        },
      },
      { enabled: true },
    );
  const reset = () => {
    setParams({
      fuzzyStartTime: '',
      fuzzyEndTime: '',
      fuzzyOutAccount: '',
      fuzzyInAccount: '',
    });
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<InternalTransferItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      cell: ({ row }) => {
        if (row?.original?.userLastName || row?.original?.userShowId || row?.original?.userName) {
          return (
            <div className="flex flex-col justify-center">
              <div>
                {(row?.original?.userLastName || '') + ' ' + (row?.original?.userName || '')}
              </div>
              <div>{row?.original?.userShowId}</div>
            </div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'outAccount',
      header: t('table.transferOutAccount'),
      label: t('table.transferOutAccount'),
      cell: ({ row }) => {
        const type = row.original.type;
        if ([1, 2].includes(type)) {
          return `${t('table.myWallet')} (${row.original.outUnit})`;
        }
        if ([3, 4].includes(type)) {
          return (
            <div>
              <div>{row.original.outAliasName}</div>
              <div>{row.original.outAccount}</div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      id: 'transferInAccount',
      header: t('table.transferInAccount'),
      cell: ({ row }) => {
        const type = row.original.type;
        if ([1, 3].includes(type)) {
          return `${t('table.myWallet')} (${row.original.inUnit})`;
        }
        if ([2, 4].includes(type)) {
          return (
            <div>
              <div>{row.original.inAliasName}</div>
              <div>{row.original.inAccount}</div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      id: 'status',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.status')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="status"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.status'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          '-1': 'info',
        };
        return (
          <RrhTag type={typeMap[row.original.status]}>
            {t(`table.${internalTransferReviewStatusMap[row.original.status]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'transferAmount',
      header: t('table.transferAmount'),
      cell: ({ row }) => (
        <div>
          {row.original.outMoney} {row.original.outUnit}
        </div>
      ),
    },
    {
      id: 'submitAuditTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.submitAuditTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="subTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.submitAuditTime'),
      accessorKey: 'subTime',
      cell: ({ row }) => row.original.subTime || '-',
    },
    {
      id: 'currentAuditor',
      header: t('table.currentAuditor'),
      cell: ({ row }) => {
        if (row.original.vUserLastName) {
          return (
            <div>
              {row.original.vUserLastName} {row.original.vUserName}
            </div>
          );
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      id: 'finishTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.finishTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="verifyTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.finishTime'),
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
    },
    {
      id: 'tradeServerOrderNumber',
      header: t('table.tradeServerOrderNumber'),
      accessorKey: 'dealTicket',
      cell: ({ row }) => row.original.dealTicket || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      label: t('common.Operation'),
      cell: ({ row }) => (
        <RrhButton variant="ghost">
          {row.original.status === 2 ? t('table.audit') : t('common.View')}
        </RrhButton>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-internal-transfer-table', allColumns);

  return (
    <div>
      <PageInfo title={t('internalTransferReview.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setOtherParams(prev => ({ ...prev, userId: keyword }));
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <RrhButton variant="outline">{t('table.export')}</RrhButton>
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
            <ReviewInternalTransferForm
              params={params}
              otherParams={otherParams}
              reset={reset}
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={internalTransferListLoading}
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
        data={internalTransferList?.rows || []}
        pageCount={Math.ceil(+(internalTransferList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={internalTransferListLoading}
      />
    </div>
  );
};
