import { PammProtocolItem } from '@/api/hooks/pamm/type';
import { DictTypeItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const AgreementsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  scenariosType,
}: {
  data: PammProtocolItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  scenariosType: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammProtocolItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.protocolName'),
      accessorFn: row => row.name,
    },
    {
      id: 'projectName',
      header: t('table.relatedProduct'),
      accessorFn: row => row.projectName,
    },
    {
      id: 'applicableScenarios',
      header: t('table.applicableScenario'),
      cell: ({ row }) => {
        const currentScenario = scenariosType.find(
          item => item.dictValue === row.original.applicableScenarios.toString(),
        );
        return currentScenario?.dictLabel || '-';
      },
    },
    {
      id: 'sort',
      header: t('table.sort'),
      accessorFn: row => row.sort,
    },

    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <Switch checked={row.original.status === 1} />;
      },
    },
    {
      id: 'createBy',
      header: t('table.operator'),
      accessorFn: row => row.createBy,
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      accessorFn: row => row.updateTime,
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      cell: () => (
        <div className="flex justify-center">
          <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
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
