import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDictType, useServerList } from '@/api/hooks/system/system';
import {
  useBonusSettingList,
  BonusSettingListParams,
  BonusSettingListItem,
} from '@/api/hooks/marketing';
import { BasicParams } from '@/api/hooks/review/types';
import { Switch } from '@/components/ui/switch';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RewardConfigForm } from './RewardConfigForm';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const RewardConfigPage = () => {
  const [params, setParams] = useState<BonusSettingListParams['params']>({
    rewardTitle: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<BonusSettingListParams, 'params' | keyof BasicParams>
  >({
    businessType: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data, isLoading } = useBonusSettingList({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const { data: serverList } = useServerList();

  const { data: bonusDictType } = useDictType('sys_bonus_business_type');
  const reset = () => {
    setParams({
      rewardTitle: '',
    });
    setOtherParams({
      businessType: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<BonusSettingListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
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
          <div title={row.original.rewardTitle}>{titleText}</div>
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
        const businessType = bonusDictType?.find(
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
              const server = serverList?.rows?.find(item => item.id === row.original.dealServer);
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
        // TODO: 后续此处有二级页面
        console.log(row);
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
        console.log(row);
        return (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'delete') {
                // Handle view action
              }
            }}
          />
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('marketing-reward-configs-table', allColumns);

  return (
    <div>
      <PageInfo title={t('rewardConfigPage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.activityName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, rewardTitle: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <RrhButton variant="outline">{t('common.add')}</RrhButton>
            <div className="flex items-center justify-center">
              <span>{t('table.allowMultipleBonusHits')}</span>
              <Switch className="ml-2" />
            </div>
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
              <RewardConfigForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={isLoading}
                businessTypes={bonusDictType || []}
                reset={reset}
                params={params}
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
