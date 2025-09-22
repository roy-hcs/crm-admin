import {
  useAccountStaticsSum,
  useAccountStatisticList,
  useExportAccountStatisticList,
} from '@/api/hooks/report/report';
import { AccountStatisticListParams } from '@/api/hooks/report/types';
import { useServerList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatisticForm } from './StatisticForm';
import { StatisticTable } from './StatisticTable';
import { TableCell } from '@/components/ui/table';
import { RrhDialog } from '@/components/common/RrhDialog';

export const StatisticPage = () => {
  const [params, setParams] = useState<AccountStatisticListParams['params']>({
    serverGroupList: '',
    fuzzyAccount: '',
    fuzzyName: '',
    statisticStartTime: '',
    statisticEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<AccountStatisticListParams, 'params'>>({
    server: '',
    accountGroupList: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverList, isLoading: serverListLoading } = useServerList();
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        server: serverList.rows[0].id,
      }));
    }
  }, [serverList]);
  const selectedServer = useMemo(() => {
    return serverList?.rows?.find(item => otherParams.server === item.id);
  }, [otherParams.server, serverList?.rows]);
  const { data: accountStatisticData, isLoading: accountStatisticDataLoading } =
    useAccountStatisticList(
      {
        pageSize,
        pageNum: pageNum + 1,
        orderByColumn: '',
        isAsc: 'asc',
        ...otherParams,
        params: {
          ...params,
        },
      },
      { enabled: otherParams.server !== '' },
    );
  const { mutate: exportStatisticData } = useExportAccountStatisticList();
  const { mutate: getStatisticData, data: sumData, isPending } = useAccountStaticsSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getStatisticData({
      ...otherParams,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [accountStatisticData]);

  const reset = () => {
    setOtherParams({
      server: serverList?.rows[0].id,
      accountGroupList: '',
    });
    setParams({
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
    });
    setPageNum(0);
    setSumShow(false);
  };

  return (
    <div>
      <h1 className="text-title">{t('accountStatisticPage.accountStatistic')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <div></div>
        <div className="flex justify-end gap-2">
          <RrhDialog
            title={t('common.systemTip')}
            trigger={<RrhButton variant="outline">{t('table.export')}</RrhButton>}
            onConfirm={() =>
              exportStatisticData({
                ...otherParams,
                params: {
                  ...params,
                },
              })
            }
          >
            {t('table.exportAllDataTip', { field: t('accountStatisticPage.accountStatistic') })}
          </RrhDialog>
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
            <StatisticForm
              serverListLoading={serverListLoading}
              serverList={serverList?.rows || []}
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={accountStatisticDataLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <StatisticTable
        data={accountStatisticData?.rows || []}
        pageCount={Math.ceil(+(accountStatisticData?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={accountStatisticDataLoading}
        selectedServer={selectedServer}
        CustomRow={
          <>
            <TableCell colSpan={3}>{t('table.total')}</TableCell>
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
                    {sumData?.data.reduce((pre, cur) => pre + (cur?.countOrderTotal || 0), 0)}
                  </TableCell>
                  <TableCell>
                    {sumData?.data
                      .reduce((pre, cur) => pre + (cur?.historyVolumeTotal || 0), 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {sumData?.data
                      .reduce((pre, cur) => pre + (cur?.positionVolumeTotal || 0), 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {sumData?.data.map(item => {
                      return item.countCommissionTotal ? (
                        <div key={item.currency}>
                          {item.countCommissionTotal} {item.currency}
                        </div>
                      ) : null;
                    })}
                  </TableCell>
                  <TableCell>
                    {sumData?.data.map(item => {
                      return item.countSwapsTotal ? (
                        <div key={item.currency}>
                          {item.countSwapsTotal} {item.currency}
                        </div>
                      ) : null;
                    })}
                  </TableCell>
                  <TableCell>
                    {sumData?.data.map(item => {
                      return item.countProfitTotal ? (
                        <div key={item.currency}>
                          {item.countProfitTotal} {item.currency}
                        </div>
                      ) : null;
                    })}
                  </TableCell>
                  <TableCell>
                    {sumData?.data.map(item => {
                      return (
                        <div key={item.currency}>
                          {(item.balanceTotal || 0).toFixed(2)} {item.currency}
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
