import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MamFollowItem, MamFollowListParams } from '@/api/hooks/copyTrading/type';
import { useMamFollowList } from '@/api/hooks/copyTrading';
import { OrderManagementForm } from './OrderManagementForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { arrivalStatusOptions } from '@/lib/const';
import { reviewStatusMap } from '@/lib/constant';
import { RrhTag } from '@/components/common/RrhTag';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableCell } from '@/components/ui/table';

export const OrderManagementPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [params, setParams] = useState<MamFollowListParams['params']>({
    signalSourceOwner: '',
    beginTime: '',
    endTime: '',
    beginArrivalTime: '',
    endArrivalTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<MamFollowListParams, 'params' | keyof BasicParams>
  >({
    signalSourceName: '',
    userName: '',
    traderServerId: '',
    trader: '',
    client: '',
    arrivalStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useMamFollowList({
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
      signalSourceOwner: '',
      beginTime: '',
      endTime: '',
      beginArrivalTime: '',
      endArrivalTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: '',
      userName: '',
      traderServerId: '',
      trader: '',
      client: '',
      arrivalStatus: '',
    }));
    setKeyword('');
    setPageNum(0);
  };

  const totalList = useMemo(() => {
    return data?.totalList?.[0];
  }, [data]);

  const allColumns: CRMColumnDef<MamFollowItem, unknown>[] = [
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
    },
    {
      id: 'signalSourceName',
      header: t('signals.name'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.signalSourceName}</div>
            <div>{row?.original?.traderServer}</div>
            <div>{row?.original?.trader}</div>
          </div>
        );
      },
    },
    {
      id: 'userName',
      header: t('table.subscriptionUsers'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.userName}</div>
            <div>{row?.original?.email}</div>
          </div>
        );
      },
    },
    {
      id: 'clientServer',
      header: t('table.subscriberAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.clientServer}</div>
            <div>{row?.original?.client}</div>
          </div>
        );
      },
    },
    {
      id: 'subscribeFee',
      header: t('orderManagementTable.subscribeFee'),
      cell: ({ row }) => row?.original?.subscribeFee || '-',
    },
    {
      id: 'managementFeeRatio',
      header: t('orderManagementTable.managementFeeRatio'),
      cell: ({ row }) => row?.original?.managementFeeRatio || '-',
    },
    {
      id: 'payAccountName',
      header: t('orderManagementTable.payAccountName'),
      cell: ({ row }) => row?.original?.payAccountName || '-',
    },
    {
      id: 'createTime',
      header: t('table.subscriptionTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'renewalStatus',
      header: t('table.renewalStatus'),
      cell: ({ row }) => {
        if ([0, 1].includes(row?.original?.renewalStatus || 0)) {
          return row?.original?.renewalStatus === 1
            ? t('table.inSubscription')
            : t('table.notInEffect');
        }
        return '-';
      },
    },
    {
      id: 'renewalType',
      label: t('common.type'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.type')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="renewalType"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        if ([0, 1].includes(row?.original?.renewalType || 0)) {
          return row?.original?.renewalType === 0 ? t('table.firstSubscription') : t('table.renew');
        }
        return '-';
      },
    },
    {
      id: 'reviewStatus',
      label: t('table.reviewStatus'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.reviewStatus')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="reviewStatus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
        };
        return (
          <RrhTag type={typeMap[row?.original?.reviewStatus || 0]}>
            {t(`table.${reviewStatusMap[row?.original?.reviewStatus || 0]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'reviewTime',
      label: t('table.verifyTime'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.verifyTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="reviewTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.reviewTime || '-',
    },
    {
      id: 'followEndTime',
      header: t('table.followEndTime'),
      cell: ({ row }) => row?.original?.followEndTime || '-',
    },
    {
      id: 'reviewRemark',
      header: t('table.reason'),
      cell: ({ row }) => row?.original?.reviewRemark || '-',
    },
    {
      id: 'arrivalStatus',
      label: t('table.arrivalStatus'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.arrivalStatus')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="arrivalStatus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const text = arrivalStatusOptions.find(
          i => i.value === String(row?.original?.arrivalStatus || 0),
        );
        return text ? t(text.label) : '-';
      },
    },
    {
      id: 'actualSubscribeFee',
      header: t('table.amountOfReceipt'),
      cell: ({ row }) => row?.original?.actualSubscribeFee || '-',
    },
    {
      id: 'managementFee',
      header: t('table.managementFee'),
      cell: ({ row }) => row?.original?.managementFee || '-',
    },
    {
      id: 'stopTime',
      label: t('table.arrivalTime'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.arrivalTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="stopTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.stopTime || '-',
    },
    {
      id: 'remark',
      header: t('table.remarks'),
      cell: ({ row }) => row?.original?.remark || '-',
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
          dropdownList={[{ label: t('common.View'), value: 'view' }]}
          callToAction={() => {}}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('order-management-table', allColumns);

  return (
    <div>
      <PageInfo title={t('orderManagementTable.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('signals.name') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setOtherParams(prev => ({ ...prev, signalSourceName: keyword }));
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
            <OrderManagementForm
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
        CustomRow={
          <>
            <TableCell colSpan={4}>{t('table.total')}</TableCell>
            {loading ? (
              <TableCell>{t('common.loading')}</TableCell>
            ) : (
              <>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalSubscribeFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={10}>
                  <div>{(Number(totalList?.totalEstimatedManagementFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalActualSubscribeFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalManagementFee) || 0).toFixed(2)}</div>
                </TableCell>
              </>
            )}
          </>
        }
      />
    </div>
  );
};
