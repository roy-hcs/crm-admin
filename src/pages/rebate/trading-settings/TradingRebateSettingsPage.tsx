import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  RebateTraderDealListParams,
  useDeleteRebateTraderDeal,
  useEditRebateTraderDealStatus,
  useRebateLevelList,
  useRebateTraderDealList,
} from '@/api/hooks/rebate';
import { TradingRebateSettingsForm } from './TradingRebateSettingsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useDictType, useGetSysConfig, useServerList } from '@/api/hooks/system/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/hooks/review/types';
import { RebateTraderDealItem } from '@/api/hooks/rebate';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { REBATE_MODEL_SETTING } from '@/lib/constant';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { AddTradingRebateSettingButton } from './components/AddTradingRebateSettingButton';
import { EditTradingRebateSettingDialog } from './components/EditTradingRebateSettingDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useGetDealAccountGroupList } from '@/api/hooks/account';
import { RrhButton } from '@/components/common/RrhButton';
import { useTabActions } from '@/hooks/useTabActions';

function getServerTypeName(serverType: string) {
  switch (serverType) {
    case '1':
      return 'MT5';
    case '2':
      return 'MT4';
    case '3':
      return 'Sirix';
    case '4':
      return 'XForce';
    case '5':
      return 'XOH';
    default:
      return '-';
  }
}

export const TradingRebateSettingsPage = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentItem, setCurrentItem] = useState<RebateTraderDealItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: serverTypes } = useDictType('sys_mt_service_type');
  const { data: rebateModelSetting } = useGetSysConfig(REBATE_MODEL_SETTING);
  const { mutateAsync: changeStatusMutation } = useEditRebateTraderDealStatus();
  const { data: languageList } = useDictType('sys_language');
  const { data: dealAccountGroupListRes } = useGetDealAccountGroupList();
  const { data: serverList } = useServerList();
  const { data: levelList } = useRebateLevelList(
    { model: rebateModelSetting as number },
    { enabled: !!rebateModelSetting },
  );

  const [otherParams, setOtherParams] = useState<
    Omit<RebateTraderDealListParams, keyof BasicParams>
  >({
    rebateType: '1',
    model: rebateModelSetting?.toString() || '',
    ruleName: '',
    serverType: '',
    serverId: '',
    hasUsed: '',
  });
  const {
    data: tradingRebateSettings,
    isLoading: tradingRebateSettingsLoading,
    refetch,
  } = useRebateTraderDealList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      model: rebateModelSetting?.toString() || '',
    },
    { enabled: !!rebateModelSetting },
  );

  const reset = () => {
    setOtherParams({
      rebateType: '1',
      model: rebateModelSetting?.toString() || '',
      ruleName: '',
      serverType: '',
      serverId: '',
      hasUsed: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const onSuccess = () => {
    reset();
    refetch();
  };

  const allColumns: CRMColumnDef<RebateTraderDealItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serialNumber',
      header: t('table.sort'),
      accessorFn: row => row.serialNumber,
    },
    {
      id: 'ruleName',
      header: t('table.ruleName'),
      accessorFn: row => row.ruleName || '-',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return (
          <RrhStatusAlert<{
            id: string;
            hasUsed: string;
          }>
            params={{
              id: String(row.original.id),
              hasUsed: row.original.hasUsed === '1' ? '0' : '1',
            }}
            tipsText={
              row.original.hasUsed === '1'
                ? t('TradingRebateSettings.disableRuleTip')
                : t('TradingRebateSettings.enableRuleTip')
            }
            checked={row.original.hasUsed === '1'}
            confirmFunction={changeStatusMutation}
            onSuccess={onSuccess}
          />
        );
      },
    },
    {
      id: 'typeGroup',
      header: t('table.typeGroup'),
      accessorFn: row => row.rebateGroupType || '-',
    },
    {
      id: 'serverName',
      header: t('table.server'),
      cell: ({ row }) => {
        if (!row.original.serverName) return '-';
        const exceedLength = row.original.serverName.length > 32;
        const content = exceedLength
          ? row.original.serverName.slice(0, 32) + '...'
          : row.original.serverName;
        return exceedLength ? (
          <ToolTip
            maxWidth="800px"
            content={<div className="break-all">{row.original.serverName}</div>}
          >
            <div>{content}</div>
          </ToolTip>
        ) : (
          <div>{content}</div>
        );
      },
    },
    {
      id: 'accountGroup',
      header: t('table.accountGroup'),
      accessorFn: row => row.accountGroupNames || '-',
    },
    {
      id: 'groups',
      header: t('table.groups'),
      cell: ({ row }) => {
        const traderServers = row.original.traderServers;
        if (!traderServers) return <div>{t('table.allGroups')}</div>;
        const plainTextArr: string[] = [];
        const serversInfo: { serverName: string; mtGroup: string }[] = [];
        traderServers.forEach(server => {
          const plainText = server.mtGroup
            ? server.mtGroup.replace(/\\\\/g, '\\').replace(/\|/g, ',')
            : t('table.allGroups');
          if (plainText !== t('table.allGroups')) {
            plainTextArr.push(plainText);
          }
          serversInfo.push({
            serverName: getServerTypeName(server.serverType) + ' | ' + server.serverName,
            mtGroup: plainText,
          });
        });
        const serversText = plainTextArr.join(',');
        const content =
          serversText.length === 0
            ? t('table.allGroups')
            : serversText.length > 32
              ? serversText.slice(0, 32) + '...'
              : serversText;
        const ToolContent = (
          <div>
            {serversInfo.map((info, index) => (
              <div key={info.serverName + index}>
                <div>{info.serverName}</div>
                <div className="text-sm">{info.mtGroup}</div>
              </div>
            ))}
          </div>
        );
        return (
          <ToolTip maxWidth="800px" content={ToolContent}>
            <div>{content}</div>
          </ToolTip>
        );
      },
    },
    {
      id: 'settlementUnit',
      header: t('table.settlementUnit'),
      cell: ({ row }) => {
        const unit = row.original.settleUnit;
        if (!unit) return <div>-</div>;
        let unitName = '';
        switch (unit) {
          case '0':
            unitName = t('table.perLot');
            break;
          case '1':
            unitName = t('table.perOrder');
            break;
          case '2':
            unitName = t('table.perContract');
            break;
        }
        return <div>{row.original.settleValue + ' ' + unitName}</div>;
      },
    },
    {
      id: 'topRebateLevel',
      header: t('table.topRebateLevel'),
      accessorFn: row => row.highestRebateLevel || '-',
    },
    // TODO: 之后的两项有点击跳转交互
    {
      id: 'relatedAccountCount',
      header: t('table.relatedAccountCount'),
      accessorFn: row => row.relatedAccountCount || '-',
    },
    {
      id: 'relatedRebateTemplateCount',
      header: t('table.relatedRebateTemplateCount'),
      accessorFn: row => row.relatedRebateTemplateCount || '-',
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      label: t('common.Operation'),
      fixed: 'right',
      size: 50,
      cell: ({ row }) => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.Edit'), value: 'edit' },
            { label: t('table.commissionSettings'), value: 'commissionSettings' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={action => {
            setCurrentItem(row.original);
            switch (action) {
              case 'edit':
                setEditDialogOpen(true);
                break;
              case 'delete':
                setDeleteDialogOpen(true);
                break;
            }
          }}
        />
      ),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-rebate-settings-table', allColumns);

  const { mutateAsync: deleteRebateTraderDeal } = useDeleteRebateTraderDeal();
  const { openTab } = useTabActions();
  return (
    <div>
      <PageInfo title={t('TradingRebateSettings.title')} desc={t('TradingRebateSettings.warn')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.ruleName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, ruleName: keyword }));
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
              <TradingRebateSettingsForm
                params={otherParams}
                reset={reset}
                setParams={setOtherParams}
                serverTypes={serverTypes || []}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddTradingRebateSettingButton
              onSuccess={onSuccess}
              model={rebateModelSetting as number}
              serverList={serverList}
              levelList={levelList}
              languageList={languageList}
              dealAccountGroupListRes={dealAccountGroupListRes}
            />
            <RrhButton
              variant="outline"
              onClick={() => {
                openTab({
                  path: '/rebate/trading-settings-history',
                  title: t('TradingRebateSettings.tradingRebateSettingsHistory'),
                  key: '/rebate/trading-settings-history',
                  closable: true,
                });
              }}
            >
              {t('table.historyOrderRebate')}
            </RrhButton>
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={tradingRebateSettings?.rows || []}
          pageCount={Math.ceil(+(tradingRebateSettings?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={tradingRebateSettingsLoading}
        />
      </TableContentWrapper>
      <RrhDeleteAlert<{ ids: string }>
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onSuccess={onSuccess}
        confirmFunction={deleteRebateTraderDeal}
        params={{ ids: currentItem?.id || '' }}
        tipsText={t('DepositRebateSettings.deleteMsg')}
      />
      <EditTradingRebateSettingDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          onSuccess();
        }}
        rebateTraderDealItem={currentItem}
        model={rebateModelSetting as number}
        serverList={serverList}
        levelList={levelList}
        languageList={languageList}
        dealAccountGroupListRes={dealAccountGroupListRes}
      />
    </div>
  );
};
