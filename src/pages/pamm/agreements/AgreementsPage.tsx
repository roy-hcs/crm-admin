import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { usePammProductList, usePammProtocolList } from '@/api/hooks/pamm';
import { PammProtocolListParams, PammProtocolItem } from '@/api/hooks/pamm/type';
import { AgreementsForm } from './AgreementsForm';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { Switch } from '@/components/ui/switch';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const AgreementsPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<PammProtocolListParams, keyof BasicParams>>({
    name: '',
    projectId: '',
    applicableScenarios: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: scenariosType } = useDictType('pamm_protocol_scenario');

  const { data: depositRebateSettings, isLoading: depositRebateSettingsLoading } =
    usePammProtocolList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      name: otherParams.name,
    });
  const productListParams = {
    pageSize: 0,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    status: '1',
    projectName: '',
    model: '',
    profitType: '',
    serverType: '',
  };

  const { data: firstProductList } = usePammProductList(productListParams);
  const total = firstProductList?.total ? Number(firstProductList.total) : 0;
  const { data: productList } = usePammProductList(
    { ...productListParams, pageSize: total },
    { enabled: !!total },
  );
  const reset = () => {
    setOtherParams({
      name: '',
      projectId: '',
      applicableScenarios: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<PammProtocolItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.protocolName'),
      accessorFn: row => row.name,
    },
    {
      id: 'projectName',
      header: t('table.relatedProduct'),
      accessorFn: row => row.projectName,
    },
    {
      id: 'applicableScenarios',
      header: t('table.applicableScenario'),
      cell: ({ row }) => {
        const currentScenario = scenariosType?.find(
          item => item.dictValue === row.original.applicableScenarios.toString(),
        );
        return currentScenario?.dictLabel || '-';
      },
    },
    {
      id: 'sort',
      header: t('table.sort'),
      accessorFn: row => row.sort,
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <Switch checked={row.original.status === 1} />;
      },
    },
    {
      id: 'createBy',
      header: t('table.operator'),
      accessorFn: row => row.createBy,
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      accessorFn: row => row.updateTime,
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
            { label: t('common.Edit'), value: 'edit' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={() => {}}
        />
      ),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('pamm-agreements-table', allColumns);

  return (
    <div>
      <PageInfo title={t('PammAgreements.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.protocolName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={e => {
                setPageNum(0);
                setOtherParams(prev => ({ ...prev, name: e }));
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
              <AgreementsForm
                scenariosType={scenariosType || []}
                setOtherParams={setOtherParams}
                loading={depositRebateSettingsLoading}
                reset={reset}
                otherParams={otherParams}
                productList={
                  productList?.rows.map(item => ({
                    label: item.projectName,
                    value: item.id,
                  })) || []
                }
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
