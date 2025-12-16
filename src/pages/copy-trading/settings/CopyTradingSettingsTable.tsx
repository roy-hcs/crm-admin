import { MamProtocolItem } from '@/api/hooks/copyTrading/type';
import { DictTypeItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const CopyTradingSettingsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  scenarioTypes = [],
}: {
  data: MamProtocolItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  scenarioTypes?: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<MamProtocolItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'protocolName',
      header: t('table.protocolName'),
      accessorFn: row => row.name,
    },
    {
      id: 'applicableScenario',
      header: t('table.applicableScenario'),
      cell: ({ row }) => {
        const selectedScenario = scenarioTypes.find(
          item => item.dictValue === String(row.original.applicableScenarios),
        );
        return selectedScenario ? <div>{selectedScenario.dictLabel}</div> : '-';
      },
    },
    {
      id: 'sort',
      header: t('table.sort'),
      cell: ({ row }) => row?.original?.sort || '-',
    },

    {
      id: 'verifyStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        return <Switch checked={row?.original?.status === 1} />;
      },
    },
    {
      id: 'operator',
      header: t('table.operator'),
      cell: ({ row }) => row?.original?.createBy || '-',
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <div>
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
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
    />
  );
};
