import {
  CurrencyListItem,
  useAllCurrencies,
  useCurrencyList,
  useWalletBalanceList,
  useWalletBalanceSum,
  WalletBalanceItem,
  WalletBalanceParams,
} from '@/api/hooks/report';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { WalletBalanceForm } from './WalletBalanceForm';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

function optPrecision(value: number, currency: string, currencyList: CurrencyListItem[]) {
  if (value !== undefined && currencyList && currencyList.length) {
    const currencyItem = currencyList.find(item => item.currencyAbbr === currency);
    let finalPrecision;
    //若未找到或没有配置精度 则默认为2
    if (currencyItem && currencyItem.decimalPrecision != null) {
      finalPrecision = currencyItem.decimalPrecision;
    } else {
      finalPrecision = 2;
    }
    return value.toFixed(finalPrecision);
  }
}
export const WalletBalancePage = () => {
  const [params, setParams] = useState<WalletBalanceParams['params']>({
    fuzzyName: '',
    email: '',
    timeStart: '',
    timeEnd: '',
    accounts: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<WalletBalanceParams, 'params'>>({
    accounts: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: allCurrencies } = useAllCurrencies();
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useWalletBalanceList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      params: {
        ...params,
        currencyList: allCurrencies?.join(',') || '',
      },
    },
    { enabled: !!allCurrencies },
  );
  const { data: currencyList } = useCurrencyList();

  const { mutate: getWalletSum, data: sumData, isPending } = useWalletBalanceSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    const knownFields = ['email', 'lastName', 'name', 'showId'];
    const currencyKeys: string[] = [];
    walletBalanceList?.rows.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!knownFields.includes(key)) {
          currencyKeys.push(key);
        }
      });
    });
    setSumShow(true);
    getWalletSum({
      ...otherParams,
      params: {
        ...params,
        currencyList: allCurrencies?.join(',') || '',
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [walletBalanceList]);

  const reset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      email: '',
      timeStart: '',
      timeEnd: '',
      accounts: '',
    }));
    setOtherParams({
      accounts: '',
    });
    setKeyword('');
    setPageNum(0);
    setSumShow(false);
  };

  const baseColumns: CRMColumnDef<WalletBalanceItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      accessorFn: row => row.index,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      accessorFn: row => `${row.name} ${row.lastName}`,
      cell: ({ row }) => {
        return !row.original.lastName && !row.original.showId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.lastName}</div>
            <div>{row.original.showId}</div>
          </div>
        );
      },
    },
    {
      id: 'email',
      header: t('table.email'),
      accessorFn: row => row.email,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div>{row.original.email}</div>
        </div>
      ),
    },
  ];
  const knownFields = ['email', 'lastName', 'name', 'showId'];
  const currencyKeys = new Set<string>();
  (walletBalanceList?.rows || []).forEach(item => {
    Object.keys(item).forEach(key => {
      if (!knownFields.includes(key)) {
        currencyKeys.add(key);
      }
    });
  });

  // Create currency columns
  const currencyColumns: CRMColumnDef<WalletBalanceItem, unknown>[] = Array.from(currencyKeys).map(
    key => ({
      id: key,
      header: `Wallet(${key})`,
      accessorFn: row => row[key],
      cell: ({ row }) => {
        const value = row.original[key] as number;
        return (
          <div className="text-center">{optPrecision(value, key, currencyList?.rows || [])}</div>
        );
      },
    }),
  );
  const allColumns = [...baseColumns, ...currencyColumns];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-balance-table', allColumns);

  return (
    <div>
      <PageInfo title={t('walletBalancePage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
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
              <WalletBalanceForm
                reset={reset}
                params={params}
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={walletBalanceListLoading}
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
          CustomRow={
            <>
              <TableCell colSpan={5}>{t('table.total')}</TableCell>
              {!sumShow && (
                <TableCell colSpan={5}>
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
                            {(item.totalAmount || 0).toFixed(2)} {item.currency}
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
      </TableContentWrapper>
    </div>
  );
};
