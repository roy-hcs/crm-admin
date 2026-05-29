import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MamProtocolItem, MamProtocolListParams } from '@/api/hooks/copyTrading/type';
import { useDeleteMamProtocol, useMamProtocolList } from '@/api/hooks/copyTrading';
import { AgreementSettingsForm } from './AgreementSettingsForm';
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
import { AddEditAgreementSettingsDialog } from './components/AddEditAgreementSettingsDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const AgreementSettingsPage = () => {
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
  const { data: languageList } = useDictType('sys_language');

  const {
    data: mamProtocolList,
    isLoading: mamProtocolListLoading,
    refetch,
  } = useMamProtocolList({
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
  const [dialogState, setDialogState] = useState({
    id: '',
    editOpen: false,
    deleteOpen: false,
  });

  const setId = (id: string) => {
    setDialogState(prev => ({ ...prev, id }));
  };

  const setOpen = (editOpen: boolean) => {
    setDialogState(prev => ({ ...prev, editOpen }));
  };

  const setDeleteDialogOpen = (deleteOpen: boolean) => {
    setDialogState(prev => ({ ...prev, deleteOpen }));
  };
  const { mutateAsync: deleteAgreement } = useDeleteMamProtocol();

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
            <div>{t('table.status')}</div>
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
      label: t('table.status'),
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
      cell: ({ row }) => (
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
            setId(row?.original.id);
            if (action === 'edit') {
              setOpen(true);
            } else if (action === 'delete') {
              // Delete functionality
              setDeleteDialogOpen(true);
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
            <AgreementSettingsForm
              setOtherParams={setOtherParams}
              reset={reset}
              loading={mamProtocolListLoading}
              otherParams={otherParams}
              scenarioOptions={(scenarioTypes || []).map(item => ({
                label: item.dictLabel,
                value: item.dictValue,
              }))}
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <AddEditAgreementSettingsDialog
            mode="add"
            onSuccess={refetch}
            title={t('common.addField', {
              field: t('CopyTradingSettings.copyTrading'),
            })}
            scenarioOptions={(scenarioTypes || []).map(item => ({
              label: item.dictLabel,
              value: item.dictValue,
            }))}
            languageOptions={(languageList || []).map(item => ({
              label: item.dictLabel,
              value: item.dictValue,
            }))}
          />
          <AddEditAgreementSettingsDialog
            open={dialogState.editOpen}
            onOpenChange={setOpen}
            id={dialogState.id}
            mode="edit"
            onSuccess={refetch}
            title={t('common.modify', {
              field: t('CopyTradingSettings.copyTrading'),
            })}
            scenarioOptions={(scenarioTypes || []).map(item => ({
              label: item.dictLabel,
              value: item.dictValue,
            }))}
            languageOptions={(languageList || []).map(item => ({
              label: item.dictLabel,
              value: item.dictValue,
            }))}
          />
          <RrhDeleteAlert<{ ids: string }>
            open={dialogState.deleteOpen}
            setOpen={setDeleteDialogOpen}
            onSuccess={refetch}
            confirmFunction={deleteAgreement}
            params={{ ids: dialogState.id || '' }}
            tipsText={t('CopyTradingSettings.confirmDelete')}
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
