import { AdsListItem } from '@/api/hooks/system/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminOperationsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: AdsListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  const baseColumns: ColumnDef<AdsListItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('marketing.ads.name'),
      cell: ({ row }) => {
        return <div>{row?.original?.name || '-'}</div>;
      },
    },
    {
      id: 'name',
      header: t('marketing.ads.position'),
      cell: ({ row }) => {
        return <div>{t(`marketing.ads.positionType.${row?.original?.position}`) || '-'}</div>;
      },
    },
    {
      id: 'sort',
      header: t('table.sort'),
      cell: ({ row }) => {
        return <div>{row?.original?.sort || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <Switch checked={row?.original?.status === 1} />;
      },
    },
    {
      id: 'clickCount',
      header: t('marketing.ads.clickCount'),
      cell: ({ row }) => {
        return <div>{row?.original?.clickCount || '-'}</div>;
      },
    },
    {
      id: 'updateBy',
      header: t('table.operator'),
      cell: ({ row }) => {
        return <div>{row?.original?.updateBy || '-'}</div>;
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
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
    },
  ];

  const columns = [...baseColumns];

  return (
    <DataTable
      columns={columns as CRMColumnDef<AdsListItem, unknown>[]}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
    />
  );
};
