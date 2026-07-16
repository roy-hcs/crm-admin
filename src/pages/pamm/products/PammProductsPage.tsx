import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { PammProductsForm } from './PammProductsForm';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PammProductListParams, PammProductItem } from '@/api/hooks/pamm/type';
import { usePammProductList } from '@/api/hooks/pamm';
import { Switch } from '@/components/ui/switch';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const PammProductsPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<PammProductListParams, keyof BasicParams>>({
    profitType: '',
    model: '',
    projectName: '',
    serverType: '',
    status: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');

  const { data: depositRebateSettings, isLoading: depositRebateSettingsLoading } =
    usePammProductList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      projectName: otherParams.projectName,
    });
  const reset = () => {
    setOtherParams({
      profitType: '',
      model: '',
      projectName: '',
      serverType: '',
      status: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<PammProductItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'projectName',
        header: t('table.projectName'),
        accessorFn: row => row.projectName,
      },
      {
        id: 'model',
        header: t('table.productModel'),
        cell: ({ row }) => {
          switch (row.original.model) {
            case 1:
              return t('PammProduct.typeOne');
            case 2:
              return t('PammProduct.typeTwo');
            default:
              return '-';
          }
        },
      },
      {
        id: 'serverName',
        header: t('table.serverName'),
        cell: ({ row }) => {
          const getServerTypeName = (serverType: number) => {
            switch (serverType) {
              case 1:
                return 'MT5';
              case 2:
                return 'MT4';
              case 3:
                return 'Sirix';
              case 4:
                return 'XForce';
              case 5:
                return 'XOH';
              default:
                return '-';
            }
          };
          const serverTypeName = getServerTypeName(row.original.serverType);
          return row.original.serverName + (serverTypeName ? ` | (${serverTypeName})` : '');
        },
      },
      {
        id: 'login',
        header: t('table.login'),
        accessorFn: row => row.login || '-',
      },
      {
        id: 'belongedUserName',
        header: t('table.belongedUserName'),
        cell: ({ row }) => {
          return <div dangerouslySetInnerHTML={{ __html: row.original.belongedUserName }}></div>;
        },
      },
      {
        id: 'netWorth',
        header: t('table.netWorth'),
        accessorFn: row => row.netWorth || '-',
      },
      {
        id: 'totalYield',
        header: t('table.totalReturn'),
        accessorFn: row => (row.totalYield ? `${row.totalYield}%` : '-'),
      },
      {
        id: 'followCount',
        header: t('table.numberOfFollowers'),
        accessorFn: row => row.followCount ?? '-',
      },
      {
        id: 'status',
        header: t('table.status'),
        cell: ({ row }) => {
          return <Switch checked={row.original.status === 1} />;
        },
      },
      {
        id: 'operation',
        header: () => <div className="text-center">{t('common.Operation')}</div>,
        label: t('common.Operation'),
        fixed: 'right',
        size: 50,
        cell: () => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('PammProduct.liquidationProducts'), value: 'liquidation' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={() => {}}
          />
        ),
      },
    ],
    [t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('pamm-products-table', allColumns);

  return (
    <div>
      <PageInfo
        title={t('PammProduct.title')}
        desc={
          <div className="text-sm">
            <div>{t('PammProduct.desc')}</div>
            <div>{t('PammProduct.descOne')}</div>
            <div>{t('PammProduct.descTwo')}</div>
          </div>
        }
      />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={e => {
                setPageNum(0);
                setOtherParams(prev => ({ ...prev, projectName: e }));
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <RrhButton variant="outline">{t('common.add')}</RrhButton>
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
              <PammProductsForm
                serverTypes={serverTypes || []}
                setOtherParams={setOtherParams}
                loading={depositRebateSettingsLoading}
                reset={reset}
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
          data={depositRebateSettings?.rows || []}
          pageCount={Math.ceil(+(depositRebateSettings?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={depositRebateSettingsLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
