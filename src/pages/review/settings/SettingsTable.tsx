import { CrmPreferenceItem } from '@/api/hooks/review';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';

export const SettingsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmPreferenceItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<CrmPreferenceItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'nameText',
      header: t('review.settings.nameText'),
      accessorFn: row => row.nameText || '-',
    },
    {
      id: 'sort',
      header: t('review.settings.sort'),
      accessorFn: row => row.sort || '-',
    },
    {
      id: 'indexReviewCount',
      header: t('review.settings.indexReviewCount'),
      cell: ({ row }) => <Switch checked={row.original.indexReviewCount === 1} />,
    },
    {
      id: 'val',
      header: t('review.settings.val'),
      cell: ({ row }) => <Switch checked={row.original.val === 1} />,
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('review.settings.editAccess'), value: 'edit' },
              { label: t('review.settings.sortingConfig'), value: 'sort' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'sort') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
      size: 50,
      fixed: 'right',
    },
  ];
  return (
    <DataTable
      columns={Columns}
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
