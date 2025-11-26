import { PammReportInvestItem } from '@/api/hooks/pamm/type';
import { DataTable } from '@/components/table/DataTable';
import { pammReportStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

function getServerTypeName(serverType: number) {
  switch (serverType) {
    case 1:
      return 'MT5';
    case 2:
      return 'MT4';
    case 3:
      return 'Sirix';
    case 4:
      return 'XForce';
    case 5:
      return 'XOH';
    default:
      return '-';
  }
}

export const InvestmentReportTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  CustomRow,
  loading = false,
}: {
  data: PammReportInvestItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  CustomRow: ReactElement;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammReportInvestItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.serverName'),
      cell: ({ row }) => {
        const serverTypeName = getServerTypeName(row.original.serverType);
        return row.original.serverName + (serverTypeName ? ` | (${serverTypeName})` : '');
      },
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      accessorFn: row => row.projectName,
    },
    {
      id: 'investor',
      header: t('table.customerName'),
      cell: ({ row }) => {
        const rowInfo = row.original;
        let userName = '';
        if (rowInfo.lastName) {
          userName += rowInfo.lastName;
        }
        if (rowInfo.name) {
          userName += ' ' + rowInfo.name;
        }
        const showId = rowInfo.showId || '';
        if (!userName) {
          return '-';
        }
        return (
          <div>
            <div>{userName}</div>
            {showId && <div>{showId}</div>}
          </div>
        );
      },
    },
    {
      id: 'role',
      header: t('table.investRole'),
      accessorFn: row => row.role,
    },
    {
      id: 'investUpper',
      header: t('table.investorUpper'),
      cell: ({ row }) => {
        return <div dangerouslySetInnerHTML={{ __html: row.original.inviter || '' }}></div>;
      },
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNo || '-',
    },
    {
      id: 'type',
      header: t('investmentReview.operType'),
      cell: ({ row }) => {
        return row.original.type === 1 ? t('table.buy') : t('table.redemption');
      },
    },
    {
      id: 'amount',
      header: t('table.investAmount'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return (
          <div>
            <div>{row.original.amount?.toFixed(2)}</div>
            <div>{currency}</div>
          </div>
        );
      },
    },
    {
      id: 'revenueSettlementMethods',
      header: t('table.revenueSettlementMethods'),
      accessorFn: row =>
        row.settlementType === 1 ? t('table.periodicSettlement') : t('table.redemptionSettlement'),
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return '-';
        return pammReportStatusMap[status]
          ? t(`PammInvestReport.${pammReportStatusMap[status]}`)
          : '-';
      },
    },
    {
      id: 'investTime',
      header: t('table.investTime'),
      accessorFn: row => row.operTime ?? '-',
    },
    {
      id: 'confirmTime',
      header: t('table.confirmTime'),
      accessorFn: row => row.confirmTime ?? '-',
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      CustomRow={CustomRow}
    />
  );
};
