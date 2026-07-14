import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminOperationsForm } from './AdminOperationsForm';
import {
  useAdminOperLogList,
  useDictType,
  AdminOperLogParams,
  AdminOperLogItem,
  DictTypeItem,
} from '@/api/hooks/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhTag } from '@/components/common/RrhTag';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhDialog } from '@/components/common/RrhDialog';
import { LabelItem } from '@/components/common/LabelItem';

const DetailInfo = ({
  data,
  operationsType,
}: {
  data: AdminOperLogItem;
  operationsType: DictTypeItem[];
}) => {
  const { t } = useTranslation();

  const accountInfo = [
    {
      label: t('table.systemModule'),
      value: data.title || '-',
    },
    {
      label: t('table.operationType'),
      value:
        operationsType.find(item => item.dictValue === String(data.operatorType))?.dictLabel ||
        String(data.operatorType),
    },
    {
      label: t('common.operObject'),
      value: data.operObject || '-',
    },
    {
      label: t('table.operator'),
      value: data.operName || '-',
    },
    {
      label: t('table.operationIP'),
      value: data.operIp || '-',
    },
    {
      label: t('common.operLocation'),
      value: data.operLocation || '-',
    },
    {
      label: t('common.operTime'),
      value: data.operTime || '-',
    },
    {
      label: t('common.operStatus'),
      value: Number(data.status) ? (
        <RrhTag type="success">{t('common.success')}</RrhTag>
      ) : (
        <RrhTag type="error">{t('common.fail')}</RrhTag>
      ),
    },
    {
      label: t('table.operationURL'),
      value: data.operUrl || '-',
    },
    {
      label: t('table.operationMethod'),
      value: data.method || '-',
    },
    {
      label: t('table.operationParams'),
      value: (
        <div className="border-border w-full overflow-auto rounded border p-2">
          <pre className="text-sm break-words whitespace-pre-wrap">
            <code>{data.operParam}</code>
          </pre>
        </div>
      ),
    },
  ];
  return (
    <div className="mb-3">
      <div className="grid grid-cols-1">
        {accountInfo.map(item => (
          <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
        ))}
      </div>
    </div>
  );
};

export const AdminOperationsPage = () => {
  const [params, setParams] = useState<AdminOperLogParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<AdminOperLogParams, 'params' | keyof BasicParams>
  >({
    title: '',
    operName: '',
    status: '',
    businessTypes: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: operationTypes } = useDictType('sys_oper_type');
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useAdminOperLogList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<AdminOperLogItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row?.original?.operId}</div>,
    },
    {
      id: 'title',
      header: t('table.systemModule'),
      cell: ({ row }) => {
        return <div>{row?.original?.title || '-'}</div>;
      },
    },
    {
      id: 'operatorType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const text = (operationTypes || []).find(
          i => i.dictValue === String(row?.original?.operatorType),
        );
        return <div>{text ? text.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'operObject',
      header: t('common.operObject'),
      cell: ({ row }) => {
        return <div>{row?.original?.operObject || '-'}</div>;
      },
    },
    {
      id: 'operName',
      header: t('common.operName'),
      cell: ({ row }) => {
        return <div>{row?.original?.operName || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('common.operStatus'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        if (Number(row.original.status) === 0) {
          return <RrhTag type="success">{t('common.success')}</RrhTag>;
        } else if (Number(row.original.status) === 1) {
          return <RrhTag type="error">{t('common.fail')}</RrhTag>;
        }
      },
    },
    {
      id: 'operIp',
      header: t('common.operIp'),
      cell: ({ row }) => {
        return <div>{row?.original?.operIp || '-'}</div>;
      },
    },
    {
      id: 'operLocation',
      header: t('common.operLocation'),
      cell: ({ row }) => {
        return <div>{row?.original?.operLocation || '-'}</div>;
      },
    },
    {
      id: 'operTime',
      header: t('common.operTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.operTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <RrhDialog
          title={t('common.detail', { field: t('adminOperations.title') })}
          trigger={
            <RrhButton variant="ghost" type="button">
              {t('common.View')}
            </RrhButton>
          }
          confirmShow={false}
          variant="large"
        >
          <DetailInfo data={row.original} operationsType={operationTypes || []} />
        </RrhDialog>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('admin-operation-logs-table', allColumns);

  return (
    <div>
      <PageInfo title={t('adminOperations.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('common.operName') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, operName: e }));
              setPageNum(0);
            }}
          />
          <div className="flex justify-end gap-2">
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
              <AdminOperationsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={walletBalanceListLoading}
                operTypeList={operationTypes || []}
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
          data={walletBalanceList?.rows || []}
          pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={walletBalanceListLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
