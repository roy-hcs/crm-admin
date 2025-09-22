import {
  useAllCurrencies,
  useCurrencyList,
  useWalletBalanceList,
  useWalletBalanceSum,
} from '@/api/hooks/report/report';
import { WalletBalanceParams } from '@/api/hooks/report/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { WalletBalanceTable } from './WalletBalanceTable';
import { WalletBalanceForm } from './WalletBalanceForm';

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
    setPageNum(0);
    setSumShow(false);
  };

  return (
    <div>
      <h1 className="text-title">{t('walletBalancePage.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
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
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <WalletBalanceForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={walletBalanceListLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <WalletBalanceTable
        data={walletBalanceList?.rows || []}
        pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={walletBalanceListLoading}
        currencyList={currencyList?.rows || []}
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
    </div>
  );
};
