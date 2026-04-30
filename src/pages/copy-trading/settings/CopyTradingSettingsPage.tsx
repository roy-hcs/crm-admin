import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MamProtocolItem, MamProtocolListParams } from '@/api/hooks/copyTrading/type';
import { useMamProtocolList } from '@/api/hooks/copyTrading';
import { CopyTradingSettingsForm } from './CopyTradingSettingsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { useDictType } from '@/api/hooks/system';
import { Switch } from '@/components/ui/switch';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';

export const CopyTradingSettingsPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<MamProtocolListParams, keyof BasicParams>>({
    name: '',
    applicableScenarios: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: scenarioTypes } = useDictType('mam_protocol_scenario');

  const { data: mamProtocolList, isLoading: mamProtocolListLoading } = useMamProtocolList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      name: '',
      applicableScenarios: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<MamProtocolItem, unknown>[] = [
    {
      id: 'No.',
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
        const selectedScenario = scenarioTypes?.find(
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
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.status')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="status"
            />
          </div>
        );
      },
      label: t('common.status'),
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
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.updateTime')}</div>
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="updateTime"
            />
          </div>
        );
      },
      label: t('table.updateTime'),
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            {
              label: t('common.Edit'),
              value: 'edit',
            },
            {
              label: t('common.delete'),
              value: 'delete',
            },
          ]}
          callToAction={action => {
            if (action === 'edit') {
              // Edit functionality
            } else if (action === 'delete') {
              // Delete functionality
            }
          }}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('copy-trading-settings-table', allColumns);

  return (
    <div>
      <PageInfo title={t('CopyTradingSettings.title')} />
      <div className="mb-3 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.protocolName') })}
            className="h-9"
            leftIcon={<Search className="size-4" />}
            onLeftIconClick={value => {
              setOtherParams(prev => ({ ...prev, name: value }));
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <RrhDrawer
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
          >
            <CopyTradingSettingsForm
              scenarioTypes={scenarioTypes || []}
              setOtherParams={setOtherParams}
              reset={reset}
              loading={mamProtocolListLoading}
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
        data={mamProtocolList?.rows || []}
        pageCount={Math.ceil(+(mamProtocolList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={mamProtocolListLoading}
      />
    </div>
  );
};
