import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OperationsLogsItem, UserOperationsLogsParams } from '@/api/hooks/monitor/type';
import { useUserOperationLogs } from '@/api/hooks/monitor/monitor';
import { DictTypeItem, useDictType } from '@/api/hooks/system';
import { UserOperationsLogsForm } from './UserOperationsLogsForm';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhTag } from '@/components/common/RrhTag';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Checkbox } from '@/components/ui/checkbox';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

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

export const CRMUserOperationsLogsPage = () => {
  const [params, setParams] = useState<UserOperationsLogsParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<UserOperationsLogsParams, 'params'>>({
    title: '',
    operName: '',
    status: '',
    businessTypes: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const { data: operationTypes } = useDictType('crm_oper_type');

  const { data, isLoading } = useUserOperationLogs({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
    });
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<OperationsLogsItem, unknown>[] = [
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
        return (operationTypes || []).find(item => item.dictValue === type)?.dictLabel || type;
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
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
              <OperationLogDetails operationsType={operationTypes || []} data={row.original} />
            </RrhDialog>
          </div>
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('crm-user-operation-table', allColumns);

  return (
    <div>
      <PageInfo title={t('CRMUserOperationsLogsPage.title')} />
      <TableContentWrapper>
        <div className="my-3.5 flex items-center justify-between gap-2">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.systemModule') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, title: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center gap-2">
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <RrhButton variant="ghost" className="size-8">
                  <Funnel />
                </RrhButton>
              }
            >
              <UserOperationsLogsForm
                operationType={operationTypes}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={isLoading}
                reset={reset}
                params={params}
                otherParams={otherParams}
              />
            </RrhDrawer>
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
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
