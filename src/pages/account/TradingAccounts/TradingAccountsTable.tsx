import { CrmDealAccountListItem } from '@/api/hooks/system/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TradingAccountsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmDealAccountListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<CrmDealAccountListItem, unknown>[] = [
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
      id: 'serverName',
      header: t('common.server'),
      accessorFn: row => row.serverName || '-',
    },
    {
      id: 'serverName',
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
    />
  );
};
