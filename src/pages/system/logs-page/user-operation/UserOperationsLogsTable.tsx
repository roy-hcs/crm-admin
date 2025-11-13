import { OperationsLogsItem } from '@/api/hooks/monitor/type';
import { DictTypeItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

const OperationLogDetails = ({
  data,
  operationsType,
}: {
  data: OperationsLogsItem;
  operationsType: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.systemModule'), value: data.title },
    {
      label: t('table.operationType'),
      value:
        operationsType.find(item => item.dictValue === data.businessType.toString())?.dictLabel ||
        data.businessType.toString(),
    },
    {
      label: t('table.operator'),
      value: data.operName,
    },
    { label: t('table.operationIP'), value: data.operIp },
    {
      label: t('table.operationAddress'),
      value: data.operLocation,
    },
    {
      label: t('table.operationTime'),
      value: data.operTime,
    },

    {
      label: t('table.operationStatus'),
      value:
        data.status === 0 ? (
          <RrhTag type="success">{t('common.success')}</RrhTag>
        ) : (
          <RrhTag type="error">{t('common.fail')}</RrhTag>
        ),
    },
    { label: t('table.operationURL'), value: data.operUrl },
    { label: t('table.operationMethod'), value: data.method },
    { label: t('table.operationParams'), value: <pre>{data.operParam}</pre> },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {detailsData.map((item, index) => {
        return (
          <div className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <span>{item.label}:</span>
            {typeof item.value === 'string' ? (
              <span className="text-slate-500">{item.value}:</span>
            ) : (
              <>{item.value}</>
            )}
          </div>
        );
      })}
    </div>
  );
};
export const UserOperationsLogsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  operationsType = [],
}: {
  data: OperationsLogsItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  operationsType?: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<OperationsLogsItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      accessorFn: row => row.operId,
    },
    {
      id: 'systemModule',
      header: t('table.systemModule'),
      accessorFn: row => row.title,
    },
    {
      id: 'operationType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const type = row.original.businessType.toString();
        return operationsType.find(item => item.dictValue === type)?.dictLabel || type;
      },
    },
    {
      id: 'operator',
      header: t('table.operator'),
      accessorFn: row => row.operName,
    },
    {
      id: 'status',
      header: t('table.operationStatus'), // 0: buy, 1: sell
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === 0) {
          return <RrhTag type="success">{t('common.success')}</RrhTag>;
        } else if (status === 1) {
          return <RrhTag type="error">{t('common.fail')}</RrhTag>;
        }
      },
    },
    {
      id: 'operationIP',
      header: t('table.operationIP'),
      accessorFn: row => row.operIp,
    },
    {
      id: 'operationLocation',
      header: t('table.operationAddress'),
      accessorFn: row => row.operLocation,
    },
    {
      id: 'operationTime',
      header: t('table.operationTime'),
      accessorFn: row => row.operTime,
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        const onClick = (data: OperationsLogsItem) => {
          console.log('Operate on row:', data);
        };
        return (
          <div>
            <RrhDialog
              trigger={
                <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
                  {t('common.View')}
                </RrhButton>
              }
              cancelText={t('common.close')}
              confirmShow={false}
              title={t('tradingHistoryPage.tradingHistoryDetail')}
            >
              <OperationLogDetails operationsType={operationsType} data={row.original} />
            </RrhDialog>
          </div>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={tradingHistoryColumns}
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
