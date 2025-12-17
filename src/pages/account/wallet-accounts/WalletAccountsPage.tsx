import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletAccountsForm } from './WalletAccountsForm';
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
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: walletData, isLoading: walletLoading } = useCurrencyList();
  const { data: data, isLoading: loading } = useWalletAccountsList({
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
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<WalletAccountsItem, unknown>[] = [
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
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-accounts-table', allColumns);

  return (
    <div>
      <PageInfo title={t('walletAccountsPage.title')} />
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          className="h-9"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
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
    </div>
  );
};
