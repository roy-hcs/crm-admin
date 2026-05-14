import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useWalletAccountsList,
  useWalletAccountsListSum,
  WalletAccountsItem,
  WalletAccountsListParams,
} from '@/api/hooks/account';
import { useCurrencyList } from '@/api/hooks/system/system';
import { TableCell } from '@/components/ui/table';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { Checkbox } from '@/components/ui/checkbox';
import { WalletAccountsForm } from './components/WalletAccountsForm';
import { AddWalletDialog } from './components/AddWalletDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useDeleteWallet } from '@/api/hooks/account';
import { BatchWalletDialog } from './components/BatchWalletDialog';
import { useTabActions } from '@/hooks/useTabActions';

export const WalletAccountsPage = () => {
  const [params, setParams] = useState<WalletAccountsListParams['params']>({
    threeCons: '',
    regStartTime: '',
    regEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<WalletAccountsListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    currency: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [ids, setIds] = useState('');
  const { t } = useTranslation();
  const { mutateAsync: deleteWallet } = useDeleteWallet();
  const { data: walletData, isLoading: walletLoading } = useCurrencyList();
  const {
    data: data,
    isLoading: loading,
    refetch: refetch,
  } = useWalletAccountsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const { mutate: getWalletSum, data: sumData, isPending } = useWalletAccountsListSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getWalletSum({
      ...otherParams,
      params,
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [data]);

  const reset = () => {
    setParams(pre => ({
      ...pre,
      threeCons: '',
      regStartTime: '',
      regEndTime: '',
    }));
    setOtherParams({
      currency: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: WalletAccountsItem) => {
      const detail = JSON.stringify(row);
      const url = `/account/wallet-accounts/detail?id=${row.id}&detail=${encodeURIComponent(detail)}`;
      openTab({
        key: url,
        title: t('walletAccountsPage.walletAccountsDetail'),
        path: url,
      });
    },
    [openTab, t],
  );
  const allColumns: CRMColumnDef<WalletAccountsItem, unknown>[] = [
    {
      id: 'select',
      label: t('table.select'),
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'crmUserName',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row.original?.crmUserName || row.original?.crmUserShowId) {
          return (
            <div>{(row.original.crmUserName || '') + `(${row.original.crmUserShowId || ''})`}</div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'currency',
      header: t('table.currency'),
      cell: ({ row }) => {
        return <div>{row?.original?.currency || '-'}</div>;
      },
    },
    {
      id: 'balance',
      header: t('table.balance'),
      cell: ({ row }) => {
        if (String(row?.original?.balance).length) {
          return <div>{row?.original?.balance + ' ' + row?.original?.currency}</div>;
        }
        return '-';
      },
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.createTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              switch (action) {
                case 'view':
                  goToDetail(row.original);
                  break;
                case 'delete':
                  setIds(String(row?.original.id));
                  setDeleteAlert(true);
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-accounts-table', allColumns);

  return (
    <div>
      <PageInfo title={t('walletAccountsPage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, threeCons: e }));
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
              <WalletAccountsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                walletData={walletData?.rows || []}
                loading={loading || walletLoading}
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
            <AddWalletDialog onSuccess={refetch} />
            <BatchWalletDialog />
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
              <TableCell colSpan={3}>{t('table.total')}</TableCell>
              {!sumShow && (
                <TableCell colSpan={3}>
                  <RrhButton variant="ghost" onClick={getSumData}>
                    {t('table.clickToGetSum')}
                  </RrhButton>
                </TableCell>
              )}
              {sumShow ? (
                isPending ? (
                  <TableCell>{t('common.loading')}</TableCell>
                ) : (
                  <>
                    <TableCell>
                      {sumData?.data?.map(item => {
                        return (
                          <div key={item.currency}>
                            {(item.totalBalance || 0).toFixed(2)} {item.currency}
                          </div>
                        );
                      })}
                    </TableCell>
                  </>
                )
              ) : null}
            </>
          }
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={deleteWallet}
          params={{ ids: ids }}
          tipsText={t('walletAccountsPage.deleteTips')}
        />
      </TableContentWrapper>
    </div>
  );
};
