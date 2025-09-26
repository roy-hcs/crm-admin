import { CrmPreferenceItem } from '@/api/hooks/review/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      fixed: true,
      size: 50,
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
      cell: () => <div>-</div>,
    },
    {
      id: 'val',
      header: t('review.settings.val'),
      cell: () => <div>-</div>,
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
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
