import { useGetUserAccountActivityList } from '@/api/hooks/agent/agent';
import { AccountActivityItem } from '@/api/hooks/agent/types';
import { useDictType } from '@/api/hooks/system';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SetRiskButton } from '../components/SetRiskButton';

export const CrmAccountActivityListPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: operationTypes } = useDictType('crm_oper_type');
  const {
    data: activityListRes,
    refetch,
    isPending,
  } = useGetUserAccountActivityList(userId, {
    ipAddr: '',
    ipTrust: '',
    device: '',
    deviceTrust: '',
    pageNum: pageNum + 1,
    pageSize,
    orderByColumn: '',
    isAsc: 'asc',
  });
  const allColumns: CRMColumnDef<AccountActivityItem, unknown>[] = [
    {
      id: 'device',
      header: t('table.device'),
      accessorFn: row => row.browser || '-',
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div>
            <span>{rowData.browser || '-'}</span>
            {rowData.devRiskyFlag === 0 ? (
              <span className="rounded-sm border border-emerald-600 px-1 py-0.5 text-emerald-600">
                {t('table.trust')}
              </span>
            ) : rowData.devRiskyFlag === 1 ? (
              <span className="rounded-sm border border-red-600 px-1 py-0.5 text-xs text-red-600">
                {t('table.untrust')}
              </span>
            ) : rowData.devRiskyFlag === 2 ? (
              <span className="rounded-sm border border-amber-600 px-1 py-0.5 text-amber-600">
                {t('table.normal')}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      id: 'system',
      header: t('common.system'),
      accessorFn: row => row.os || '-',
    },
    {
      id: 'ipAddr',
      header: t('table.ipAddress'),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{rowData.operIp || '-'}</span>
            {rowData.ipRiskyFlag === 0 ? (
              <span className="rounded-sm border border-emerald-600 px-1 py-0.5 text-emerald-600">
                {t('table.trust')}
              </span>
            ) : rowData.ipRiskyFlag === 1 ? (
              <span className="rounded-sm border border-red-600 px-1 py-0.5 text-xs text-red-600">
                {t('table.untrust')}
              </span>
            ) : rowData.ipRiskyFlag === 2 ? (
              <span className="rounded-sm border border-amber-600 px-1 py-0.5 text-amber-600">
                {t('table.normal')}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      id: 'position',
      header: t('table.position'),
      accessorFn: row => row.operLocation || '-',
    },
    {
      id: 'operationType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const businessType = row.original.businessType;
        if (!businessType) return 'login';
        const dictItem = operationTypes?.find(item => item.dictValue === businessType);
        return dictItem ? dictItem.dictValue : businessType;
      },
    },
    {
      id: 'riskScore',
      header: t('table.riskScore'),
      cell: ({ row }) => {
        const score = row.original.riskScore || 0;
        if (score >= 90) {
          return (
            <span className="rounded-sm border border-red-600 px-1 py-0.5 text-red-600">
              {t('table.riskHigh')}
            </span>
          );
        } else if (score >= 70) {
          return (
            <span className="rounded-sm border border-amber-600 px-1 py-0.5 text-amber-600">
              {t('table.riskMedium')}
            </span>
          );
        } else if (score >= 40) {
          return (
            <span className="rounded-sm border border-slate-600 px-1 py-0.5 text-slate-600">
              {t('table.riskLow')}
            </span>
          );
        } else {
          return (
            <span className="rounded-sm border border-emerald-600 px-1 py-0.5 text-emerald-600">
              {t('table.riskNone')}
            </span>
          );
        }
      },
    },
    {
      id: 'time',
      header: t('table.time'),
      accessorFn: row => row.operTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <SetRiskButton
            userId={userId}
            ip={rowData.operIp}
            ipTrust={rowData.ipRiskyFlag ? rowData.ipRiskyFlag.toString() : ''}
            device={`${rowData.browser}/${rowData.os}`}
            deviceTrust={rowData.devRiskyFlag ? rowData.devRiskyFlag.toString() : ''}
            onSuccess={refetch}
          />
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('crm-account-activity-table', allColumns);
  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    refetch();
  };
  return (
    <RrhCard>
      <PageInfo title={t('CRMAccountPage.accountActivity')} />
      <div className="mb-3 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
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
        data={activityListRes?.rows || []}
        pageCount={Math.ceil(+(activityListRes?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isPending}
      />
    </RrhCard>
  );
};
