import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { CrmDealAccountListItem, useCrmDealAccountList } from '@/api/hooks/account';
import { useServerList } from '@/api/hooks/system/system';
import { TradingAccountsForm } from './TradingAccountsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { CrmDealAccountListParams } from '@/api/hooks/account';
import { BasicParams } from '@/api/types';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { ResetPassword } from './ResetPassword';
import { DeleteAccount } from './DeleteAccount';

export function TradingAccountsPage() {
  const { t } = useTranslation();
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [info, setInfo] = useState<CrmDealAccountListItem | null>(null);

  const [params, setParams] = useState<CrmDealAccountListParams['params']>({
    regStartTime: '',
    regEndTime: '',
    fuzzyAccount: '',
    fuzzyName: '',
    accounts: '',
    threeCons: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<CrmDealAccountListParams, 'params' | keyof BasicParams>
  >({
    serverGroupList: '',
    accounts: '',
    accountGroupList: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  useEffect(() => {
    // 自动选择第一台服务器
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);

  const { data: data, isLoading: dataLoading } = useCrmDealAccountList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      server: serverId,
      ...otherParams,
      params,
    },
    { enabled: Boolean(serverId) },
  );

  const reset = () => {
    setParams({
      regStartTime: '',
      regEndTime: '',
      fuzzyAccount: '',
      fuzzyName: '',
      accounts: '',
      threeCons: '',
    });
    setOtherParams({
      serverGroupList: '',
      accounts: '',
      accountGroupList: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<CrmDealAccountListItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('financial.tradingAccountTransactions.name'),
      accessorFn: row => row.name || '-',
    },
    {
      id: 'account',
      header: t('financial.tradingAccountTransactions.login'),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.account +
              ' ' +
              (row.original.serviceProperty === 1 ? t('common.live') : t('common.demo'))}
          </div>
        );
      },
    },
    {
      id: 'accountTypeName',
      header: t('common.accountType'),
      accessorFn: row => row.accountTypeName || '-',
    },
    {
      id: 'server',
      header: t('common.server'),
      accessorFn: row => row.serverName || '-',
    },
    {
      id: 'userName',
      header: t('financial.tradingAccountDataStats.username'),
      cell: ({ row }) => {
        if (row.original.userId == null || row.original.params?.aspShowId == null) {
          return '-';
        }
        const aspName = String(row.original.params['aspName'] || '');
        const aspShowId = String(row.original.params['aspShowId'] || '');
        return (
          <div>
            <div>{aspName}</div>
            <div>{aspShowId}</div>
          </div>
        );
      },
      /** 缺少弹窗功能
       *  if (null == row.userId || undefined == row.userId || undefined == row.params["aspShowId"] || null == row.params["aspShowId"]) {
                            return '-';
                        } else {
                            var actions = [];
                            actions.push('<a class="" onclick="$.modal.openTab(\'' + row.params["aspName"].replaceAll("'", "\\'") + '\',\'' + userPrefix + '/manage/1/' + row.userId + '\')"> ' + '<div>' + row.params["aspName"] + '</div><div>' + row.params["aspShowId"] + '</div></a> ');
                            return actions.join('');
                        }
       */
    },
    {
      id: 'roleName',
      header: t('CRMAccountPage.Role'),
      accessorFn: row => row.roleName || '-',
    },
    {
      id: 'serverName',
      header: t('table.directAgent'),
      cell: ({ row }) => {
        if (row.original.directBroker == null || row.original.params?.brokerShowId == null) {
          return '-';
        }
        const brokerName = String(row.original.params['brokerName'] || '');
        const brokerShowId = String(row.original.params['brokerShowId'] || '');
        return (
          <div>
            <div>{brokerName}</div>
            <div>{brokerShowId}</div>
          </div>
        );
      },
      /** 缺少弹窗功能
       *  if (null == row.directBroker || undefined == row.directBroker || undefined == row.params["brokerShowId"] || null == row.params["brokerShowId"]) {
                            return '-';
                        } else {
                            var actions = [];
                            actions.push('<a class="" onclick="$.modal.openTab(\'' + row.params["brokerName"].replaceAll("'", "\\'") + '\',\'' + userPrefix + '/manage/1/' + row.directBroker + '\')"> ' + '<div>' + row.params["brokerName"] + '</div><div>' + row.params["brokerShowId"] + '</div></a> ');
                            return actions.join('');
                        }
       */
    },
    {
      id: 'accountGroupName',
      header: t('table.accountGroup'),
      accessorFn: row => row.accountGroupName || '-',
    },
    {
      id: 'serverGroup',
      header: t('table.groups'),
      accessorFn: row => row.serverGroup || '-',
    },
    {
      id: 'lever',
      header: t('common.level'),
      accessorFn: row => row.lever || '-',
    },
    {
      id: 'balance',
      header: t('table.balance'),
      accessorFn: row => row.balance || '-',
    },
    {
      id: 'netWorth',
      header: t('home.Net'),
      accessorFn: row => row.netWorth || '-',
    },
    {
      id: 'creditAmount',
      header: t('table.creditAmount'),
      accessorFn: row => row.creditAmount || '-',
    },
    {
      id: 'registerTimeStr',
      header: t('CRMAccountPage.RegisterTime'),
      accessorFn: row => row.registerTimeStr || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.resetPassword'), value: 'resetPassword' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              switch (action) {
                case 'view':
                  // View action
                  break;
                case 'resetPassword':
                  setInfo(row.original);
                  setIsResetPasswordDialogOpen(true);
                  break;
                case 'delete':
                  setInfo(row.original);
                  setIsDeleteDialogOpen(true);
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-accounts-table', allColumns);

  return (
    <div>
      <PageInfo title={t('tradingAccounts.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.login'),
            })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, fuzzyAccount: e }));
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
              <TradingAccountsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                setServerId={setServerId}
                serverOptions={server?.rows || []}
                initialServerId={serverId}
                loading={dataLoading || serverLoading}
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
          loading={dataLoading || serverLoading}
        />
        <ResetPassword
          info={info}
          title={t('common.resetPassword')}
          isResetDialogOpen={isResetPasswordDialogOpen}
          setIsResetDialogOpen={setIsResetPasswordDialogOpen}
        />
        {info?.id && (
          <DeleteAccount
            id={info.id}
            title={t('common.deleteAccount')}
            isResetDialogOpen={isDeleteDialogOpen}
            setIsResetDialogOpen={setIsDeleteDialogOpen}
          />
        )}
      </TableContentWrapper>
    </div>
  );
}
