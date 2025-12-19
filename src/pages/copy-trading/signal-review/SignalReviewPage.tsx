import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  MamSignalSourceItem,
  MamSignalSourceVerifyListParams,
  signalReviewOrderByColumn,
} from '@/api/hooks/copyTrading/type';
import { useMamSignalSourceVerifyList } from '@/api/hooks/copyTrading';
import { SignalReviewForm } from './SignalReviewForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { SignalReviewVerifyStatusOptions } from '@/lib/const';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhDropdown } from '@/components/common/RrhDropdown';

export const SignalReviewPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string | signalReviewOrderByColumn>('');
  const [params, setParams] = useState<MamSignalSourceVerifyListParams['params']>({
    beginTime: '',
    endTime: '',
    beginReviewTime: '',
    endReviewTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<MamSignalSourceVerifyListParams, 'params' | keyof BasicParams>
  >({
    name: '',
    userName: '',
    serverId: '',
    account: '',
    verifyStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useMamSignalSourceVerifyList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: orderByColumn,
    isAsc: isAsc,
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
      beginReviewTime: '',
      endReviewTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      name: '',
      userName: '',
      serverId: '',
      account: '',
      verifyStatus: '',
    }));
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<MamSignalSourceItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('signals.name'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'userName',
      header: t('signals.signalSourceAuthor'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.userLastName}</span>
              <span>{row?.original?.userName}</span>
            </div>
            <span> {row?.original?.email}</span>
          </div>
        );
      },
    },
    {
      id: 'tradingAccount',
      header: t('table.tradingAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.account}</span>
            </div>
            <span> {row?.original?.server}</span>
          </div>
        );
      },
    },
    {
      id: 'subscribeFee',
      label: t('signals.subscribeFee'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.subscribeFee')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="subscribeFee"
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.subscribeFee || '-',
    },
    {
      id: 'performanceFeeRatio',
      header: t('signalReview.performanceFeeRatio'),
      cell: ({ row }) => row?.original?.performanceFeeRatio || '-',
    },
    {
      id: 'publicShow',
      header: t('signals.publicShow'),
      cell: ({ row }) => {
        if (row?.original?.publicShow === 1) {
          return t('signalReview.show');
        } else {
          return t('signalReview.hide');
        }
      },
    },
    {
      id: 'minBalanceForSubscription',
      header: t('signalReview.minBalanceForSubscription'),
      cell: ({ row }) => row?.original?.minBalanceForSubscription || '-',
    },
    {
      id: 'upperLimit',
      label: t('signalReview.upperLimit'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signalReview.upperLimit')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="upperLimit"
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.upperLimit || '-',
    },
    {
      id: 'verifyStatus',
      label: t('table.status'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.status')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="verifyStatus"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const text = SignalReviewVerifyStatusOptions.find(
          i => Number(i.value) === row.original.verifyStatus,
        );
        return text ? t(text?.label) : '-';
      },
    },
    {
      id: 'createTime',
      label: t('table.applicationTime'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.applicationTime')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="createTime"
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'verifyTime',
      label: t('table.verifyTime'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.verifyTime')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="verifyTime"
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.verifyTime || '-',
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[{ label: t('table.audit'), value: 'audit' }]}
          callToAction={() => {}}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('signal-review-table', allColumns);

  return (
    <div>
      <PageInfo title={t('signalReview.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('signals.name') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setOtherParams(prev => ({ ...prev, name: keyword }));
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
            <SignalReviewForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              reset={reset}
              loading={loading}
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
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  );
};
