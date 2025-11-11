import { RebateTraderDealItem } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

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

export const TradingRebateSettingsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RebateTraderDealItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<RebateTraderDealItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
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
        return <Switch checked={row.original.hasUsed === '1'} />;
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
      cell: () => (
        <div className="flex justify-center">
          <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
          <RrhButton variant="ghost">{t('table.commissionSettings')}</RrhButton>
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
