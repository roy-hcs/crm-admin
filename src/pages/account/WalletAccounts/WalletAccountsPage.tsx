import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletAccountsTable } from './WalletAccountsTable';
import { WalletAccountsForm } from './WalletAccountsForm';
import {
  useCurrencyList,
  useWalletAccountsList,
  useWalletAccountsListSum,
} from '@/api/hooks/system/system';
import { WalletAccountsListParams } from '@/api/hooks/system/types';
import { TableCell } from '@/components/ui/table';

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
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('walletAccountsPage.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, threeCons: e }));
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
            <WalletAccountsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              walletData={walletData?.rows || []}
              loading={loading || walletLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <WalletAccountsTable
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
