import { PammProductItem } from '@/api/hooks/pamm/type';
import { RrhButton } from '@/components/common/RrhButton';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
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

export const PammProductsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: PammProductItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammProductItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      accessorFn: row => row.projectName,
    },
    {
      id: 'model',
      header: t('table.productModel'),
      cell: ({ row }) => {
        switch (row.original.model) {
          case 1:
            return t('PammProduct.typeOne');
          case 2:
            return t('PammProduct.typeTwo');
          default:
            return '-';
        }
      },
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
      id: 'login',
      header: t('table.login'),
      accessorFn: row => row.login || '-',
    },
    {
      id: 'belongedUserName',
      header: t('table.belongedUserName'),
      cell: ({ row }) => {
        return <div dangerouslySetInnerHTML={{ __html: row.original.belongedUserName }}></div>;
      },
    },
    {
      id: 'netWorth',
      header: t('table.netWorth'),
      accessorFn: row => row.netWorth || '-',
    },
    {
      id: 'totalYield',
      header: t('table.totalReturn'),
      accessorFn: row => (row.totalYield ? `${row.totalYield}%` : '-'),
    },
    {
      id: 'followCount',
      header: t('table.numberOfFollowers'),
      accessorFn: row => row.followCount ?? '-',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <Switch checked={row.original.status === 1} />;
      },
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      cell: () => (
        <div className="flex justify-center">
          <RrhButton variant="ghost">{t('common.View')}</RrhButton>
          <RrhButton variant="ghost">{t('PammProduct.liquidationProducts')}</RrhButton>
          <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
        </div>
      ),
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
    />
  );
};
