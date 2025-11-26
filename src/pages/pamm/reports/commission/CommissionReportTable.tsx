import { PammReportCommissionItem } from '@/api/hooks/pamm/type';
import { RrhSorter } from '@/components/common/RrhSorter';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Dispatch, ReactElement, SetStateAction } from 'react';
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

export const CommissionReportTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  CustomRow,
  loading = false,
  orderByColumn,
  setOrderByColumn,
  isAsc,
  setIsAsc,
}: {
  data: PammReportCommissionItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  orderByColumn: string;
  isAsc: 'asc' | 'desc' | '';
  setOrderByColumn: Dispatch<SetStateAction<string>>;
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  CustomRow: ReactElement;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammReportCommissionItem>[] = [
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
      id: 'amount',
      header: t('table.investAmount'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return (
          <div>
            <div>{row.original.businessAmount?.toFixed(2)}</div>
            <div>{currency}</div>
          </div>
        );
      },
    },
    {
      id: 'agentName',
      header: t('common.account.type.agent'),
      accessorFn: row => row.agentLastName + row.agentName,
    },
    {
      id: 'tierRatio',
      header: t('table.tierRatio'),
      accessorFn: row => (row.proportion ? `${row.proportion}%` : '-'),
    },
    {
      id: 'commission',
      header: t('commissionReview.commission'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return (
          <div>
            <div>{row.original.commission?.toFixed(2)}</div>
            <div>{currency}</div>
          </div>
        );
      },
    },
    {
      id: 'investTime',
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <div>{t('table.investTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="businessTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorFn: row => row.businessTime ?? '-',
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
