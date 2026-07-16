import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDictType } from '@/api/hooks/system/system';
import {
  useRewardRecordsList,
  RewardRecordsListParams,
  RewardRecordsListItem,
} from '@/api/hooks/marketing';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RewardRecordsForm } from './RewardRecordsForm';
import { depositRebateStatusMap } from '@/lib/constant';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RewardReviewDialog } from './components/RewardReviewDialog';
import { useTabActions } from '@/hooks/useTabActions';

export const RewardRecordsPage = () => {
  const [params, setParams] = useState<RewardRecordsListParams['params']>({
    rewardTitle: '',
    crmAccount: '',
    businessType: '',
    bonusTimeStart: '',
    bonusTimeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<RewardRecordsListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    rewardId: '',
    status: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: bonusDictType } = useDictType('sys_bonus_business_type');
  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useRewardRecordsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

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
      rewardId: '',
      status: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };
  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: RewardRecordsListItem) => {
      const type = Number(row.status) !== 2 ? 'detail' : 'audit';
      const url = `/marketing/reward-records/detail?type=${type}&id=${row.recordId}`;
      openTab({
        key: url,
        title: t('rewardRecords.rewardRecordsDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns = useMemo<CRMColumnDef<RewardRecordsListItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'orderNo',
        header: t('table.orderNo'),
        cell: ({ row }) => {
          return <div>{row?.original?.orderNo || '-'}</div>;
        },
      },
      {
        id: 'lastName',
        header: t('table.CRMAccount'),
        cell: ({ row }) => {
          if (row?.original?.lastName || row?.original?.name || row?.original?.showId) {
            return (
              <div>
                <div>{`${row?.original?.lastName || ''} ${row?.original?.name || ''}`}</div>
                <div>{row?.original?.showId || '-'}</div>
              </div>
            );
          }
          return '-';
        },
      },
      {
        id: 'rewardTitle',
        header: t('table.activityName'),
        cell: ({ row }) => {
          return <div>{row?.original?.rewardTitle || '-'}</div>;
        },
      },
      {
        id: 'businessType',
        header: t('table.triggerBusiness'),
        cell: ({ row }) => {
          const text = bonusDictType?.find(
            item => item.dictValue === String(row?.original?.businessType),
          )?.dictLabel;
          return <div>{text || '-'}</div>;
        },
      },
      {
        id: 'targetType',
        header: t('common.type'),
        cell: ({ row }) => {
          return <div>{row?.original?.targetType || '-'}</div>;
        },
      },
      {
        id: 'rewardType',
        header: t('rewardRecords.rewardType'),
        cell: ({ row }) => {
          return <div>{row?.original?.rewardType || '-'}</div>;
        },
      },
      {
        id: 'rewardTarget',
        header: t('rewardRecords.rewardTarget'),
        cell: ({ row }) => {
          return <div>{row?.original?.rewardTarget || '-'}</div>;
        },
      },
      {
        id: 'amount',
        header: t('rewardRecords.amount'),
        cell: ({ row }) => {
          return <div>{row?.original?.amount || '-'}</div>;
        },
      },
      {
        id: 'createBy',
        header: t('common.system'),
        cell: ({ row }) => {
          return <div>{row?.original?.createBy || '-'}</div>;
        },
      },
      {
        id: 'status',
        header: t('table.status'),
        cell: ({ row }) => {
          const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
            0: 'warning',
            1: 'success',
            '-1': 'info',
            2: 'error',
          };
          return (
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                typeMap[row?.original?.status] === 'success'
                  ? 'bg-green-100 text-green-800'
                  : typeMap[row?.original?.status] === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : typeMap[row?.original?.status] === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
              }`}
            >
              {t(`table.${depositRebateStatusMap[row?.original?.status]}`)}
            </div>
          );
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
        id: 'updateTime',
        header: t('table.updateTime'),
        cell: ({ row }) => {
          return <div>{row?.original?.updateTime || '-'}</div>;
        },
      },
      {
        id: 'lockStatus',
        header: t('rewardRecords.lockStatus'),
        cell: ({ row }) => {
          return <div>{row?.original?.lockStatus || '-'}</div>;
        },
      },
      {
        id: 'unlockAmount',
        header: t('table.unlockAmount'),
        cell: ({ row }) => {
          return <div>{row?.original?.unlockAmount || '-'}</div>;
        },
      },
      {
        id: 'unlockTime',
        header: t('table.unlockTime'),
        cell: ({ row }) => {
          return <div>{row?.original?.unlockTime || '-'}</div>;
        },
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        fixed: 'right',
        size: 50,
        cell: ({ row }) => (
          <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
            {String(row?.original?.status) !== '2' ? t('common.View') : t('table.audit')}
          </RrhButton>
        ),
      },
    ],
    [t, bonusDictType, goToDetail],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('marketing-reward-records-table', allColumns);

  return (
    <div>
      <PageInfo title={t('rewardRecords.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.activityName') })}
              className="h-9"
              leftIcon={<Search className="size-4 cursor-pointer" />}
              onLeftIconClick={value => {
                setParams(prev => ({ ...prev, rewardTitle: value }));
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
              <RewardRecordsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                bonusDictType={bonusDictType || []}
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
            <RewardReviewDialog onSuccess={refetch} />
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
      </TableContentWrapper>
    </div>
  );
};
