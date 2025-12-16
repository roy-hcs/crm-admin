import { DictTypeItem, ServerItem } from '@/api/hooks/system/types';
import { BonusSettingListItem } from '@/api/hooks/marketing';
import { RrhButton } from '@/components/common/RrhButton';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const RewardConfigTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  businessTypes = [],
  serverList = [],
}: {
  data: BonusSettingListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  businessTypes?: DictTypeItem[];
  serverList?: ServerItem[];
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<BonusSettingListItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => row.index + 1,
    },
    {
      id: 'activityName',
      header: t('table.activityName'),
      cell: ({ row }) => {
        const exceedLength = row.original.rewardTitle && row.original.rewardTitle.length > 15;
        const titleText = exceedLength
          ? row.original.rewardTitle?.slice(0, 15) + '...'
          : row.original.rewardTitle;
        return exceedLength ? (
          <ToolTip content={<div className="break-all">{row.original.rewardTitle}</div>}>
            <div>{titleText}</div>
          </ToolTip>
        ) : (
          <div>{titleText}</div>
        );
      },
    },
    {
      id: 'sort',
      header: t('table.sort'),
      accessorFn: row => row.sort,
    },
    {
      id: 'triggerBusiness',
      header: t('table.triggerBusiness'),
      cell: ({ row }) => {
        const businessType = businessTypes.find(
          item => item.dictValue === row.original.businessType.toString(),
        );
        return businessType ? businessType.dictLabel : '-';
      },
    },
    {
      id: 'rewardType',
      header: t('table.rewardType'),
      accessorFn: row => row.rewardType,
      cell: ({ row }) => {
        switch (row.original.rewardType) {
          case 1:
            return t('table.creditDeposit');
          case 2:
            return t('table.realDeposit');
          case 3:
            return t('table.convertibleCreditDeposit');
          default:
            return '-';
        }
      },
    },
    {
      id: 'rewardWay',
      header: t('table.rewardWay'),
      cell: ({ row }) => {
        switch (row.original.bonusScheme) {
          case 1:
            return t('table.disposable');
          case 2:
            return t('table.multipleRewards');
          default:
            return '-';
        }
      },
    },
    {
      id: 'rewardAmount',
      header: t('table.rewardAmount'),
      cell: ({ row }) => {
        switch (row.original.bonusType) {
          case 1:
            return t('table.percentage');
          case 2:
            return t('table.fixedAmount');
          case 3:
            return t('table.tradingVolume');
          default:
            return '-';
        }
      },
    },
    {
      id: 'rewardValue',
      header: t('table.rewardValue'),
      cell: ({ row }) => {
        const value = row.original.bonusPercentage;
        switch (row.original.bonusType) {
          case 1:
            return value ? `${value}%` : '-';
          case 2:
            return value || '-';
          case 3: {
            if (
              row.original.dealNum === null ||
              row.original.dealBasis === '' ||
              row.original.dealBasis === null
            ) {
              return '-';
            } else {
              const server = serverList.find(item => item.id === row.original.dealServer);
              const isLeverate = server?.serviceType === 3; // leverate服务器的类型是3
              return `$${row.original.dealNum} / ${row.original.dealBasis} ${isLeverate ? 'Contract' : 'lots'}`;
            }
          }
          default:
            return '-';
        }
      },
    },
    {
      id: 'activityDisplay',
      header: t('table.activityDisplay'),
      cell: ({ row }) => {
        // TODO: 后续此处有二级页面
        if (row.original.toClientStatus === 1) {
          return <div>{t('table.configurationText')}</div>;
        } else {
          return <div>{t('table.noActivated')}</div>;
        }
      },
    },
    {
      id: 'rewardRecord',
      header: t('table.rewardRecord'),
      cell: ({ row }) => {
        console.warn('row', row);
        // TODO: 后续此处有二级页面
        return <div>{t('common.View')}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        // TODO: 此处可以通过Switch组件进行启用禁用操作
        return <Switch checked={row.original.status === 1} />;
      },
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      accessorFn: row => row.updateTime,
    },
    {
      id: 'operate',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => {
        // TODO: need to add view detail page later
        console.warn('row', row);
        return (
          <div>
            <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
            <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
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
