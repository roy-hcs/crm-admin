import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  NetBonusRewardItem,
  NetBonusRewardReportsListParams,
  useExportNetBonusRewardReports,
  useGetNetBonusRewardReports,
  useGetNetBonusRewardReportsTotal,
} from '@/api/hooks/marketing';
import { BasicParams } from '@/api/types';
import { NetBonusRewardReportsForm } from './NetBonusRewardReportsForm';
import { ExportButton } from '@/components/common/ExportButton';
import { TableCell } from '@/components/ui/table';

export const NetBonusRewardReportsPage = () => {
  const [params, setParams] = useState<NetBonusRewardReportsListParams['params']>({
    beginBonusTime: '',
    endBonusTime: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<NetBonusRewardReportsListParams, 'params' | keyof BasicParams>
  >({
    orderNo: '',
    bonusUser: '',
    status: 1,
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    mutate: getNetBonusRewardReportsTotal,
    data: sumData,
    isPending,
  } = useGetNetBonusRewardReportsTotal();
  const [sumShow, setSumShow] = useState(false);
  const { data: data, isLoading: loading } = useGetNetBonusRewardReports({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const getSumData = () => {
    setSumShow(true);
    getNetBonusRewardReportsTotal({
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
      rewardTitle: '',
      crmAccount: '',
      businessType: '',
      bonusTimeStart: '',
      bonusTimeEnd: '',
    }));
    setOtherParams({
      orderNo: '',
      bonusUser: '',
      status: 1,
    });
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<NetBonusRewardItem, unknown>[]>(
    () => [
      {
        id: 'orderNo',
        header: t('table.orderNumber'),
        accessorFn: row => row.orderNo,
      },
      {
        id: 'rewardTarget',
        header: t('rewardRecords.rewardTarget'),
        cell: ({ row }) => {
          return (
            <div>
              <div>{row?.original?.bonusUserName || '-'}</div>
              <div>({row?.original?.bonusUserShowId || '-'})</div>
            </div>
          );
        },
      },
      {
        id: 'month',
        header: t('customerTracking.statisticMonthStr'),
        cell: ({ row }) => <div>{row.original.bonusMonthStr}</div>,
      },
      {
        id: 'rewardAmount',
        header: t('table.rewardAmount'),
        cell: ({ row }) => {
          return <div>{row?.original?.bonusAmount.toFixed(2) || '-'}USD</div>;
        },
      },
      {
        id: 'actualAmount',
        header: t('table.actualDisbursedAmount'),
        cell: ({ row }) => {
          return <div>{row?.original?.actualAmount.toFixed(2) || '-'}USD</div>;
        },
      },
      {
        id: 'paymentAccount',
        header: t('table.paymentAccount'),
        cell: ({ row }) => {
          return <div>{row?.original?.accountName || '-'}</div>;
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
        id: 'operator',
        header: t('table.operator'),
        cell: ({ row }) => {
          return <div>{row?.original?.createBy || '-'}</div>;
        },
      },
      {
        id: 'updateTime',
        header: t('table.verifyTime'),
        cell: ({ row }) => {
          return <div>{row?.original?.updateTime || '-'}</div>;
        },
      },
      {
        id: 'disbursedTime',
        header: t('table.disbursedTime'),
        cell: ({ row }) => {
          return <div>{row?.original?.distributionTime || '-'}</div>;
        },
      },
    ],
    [t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('marketing-reward-records-table', allColumns);
  const { mutateAsync: exportNetBonusRewardReports, isPending: exportLoading } =
    useExportNetBonusRewardReports();

  return (
    <div>
      <PageInfo title={t('netBonus.netBonusRewardReport')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
              className="h-9"
              leftIcon={<Search className="size-4 cursor-pointer" />}
              onLeftIconClick={e => {
                setOtherParams(prev => ({ ...prev, orderNo: e }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
              <NetBonusRewardReportsForm
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                reset={reset}
                params={params}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <ExportButton<NetBonusRewardReportsListParams>
              exportFunction={exportNetBonusRewardReports}
              params={{
                params,
                ...otherParams,
              }}
              exportLoading={exportLoading}
              title={t('netBonus.netBonusRewardReport')}
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
              <TableCell colSpan={2}>{t('table.total')}</TableCell>
              {!sumShow && (
                <TableCell colSpan={7}>
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
                    <TableCell>{(sumData?.data?.[0]?.bonusAmount || 0).toFixed(2)}USD</TableCell>
                    <TableCell>{(sumData?.data?.[0]?.actualAmount || 0).toFixed(2)}USD</TableCell>
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
