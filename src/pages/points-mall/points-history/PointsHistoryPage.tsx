import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePointsChangeList,
  PointsChangeListParams,
  PointsChangeItem,
} from '@/api/hooks/pointsMall';
import { useDictType } from '@/api/hooks/system/system';
import { PointsOperTypeList } from '@/lib/const';
import { PageInfo } from '@/components/common/PageInfo';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PointsHistoryForm } from './PointsHistoryForm';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { RrhSorter } from '@/components/common/RrhSorter';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const PointsHistoryPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState<PointsChangeListParams['params']>({
    fuzzyName: '',
    fuzzyEmail: '',
    timeStart: '',
    timeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PointsChangeListParams, 'params' | keyof BasicParams>
  >({
    businessType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');

  const { data: operTypeList } = useDictType('sys_points_business_type');
  // 把后端字典与本地常量合并为相同的 DictTypeItem 结构，避免修改全局常量
  const mergedOperTypeList = (operTypeList || []).concat(
    PointsOperTypeList.map(i => ({
      createBy: null,
      createTime: null,
      updateBy: null,
      updateTime: null,
      remark: null,
      params: {},
      dictCode: '',
      dictSort: '',
      dictLabel: t(i.dictLabel),
      dictValue: i.dictValue,
      dictType: '',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      status: '',
      flag: false,
      globalizationKey: '',
    })),
  );

  const { data: data, isLoading: loading } = usePointsChangeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc: isAsc || 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams({
      fuzzyName: '',
      fuzzyEmail: '',
      timeStart: '',
      timeEnd: '',
    });
    setOtherParams({
      businessType: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
  };

  const allColumns: CRMColumnDef<PointsChangeItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serialNo',
      header: t('redemptionRecords.orderNo'),
      accessorFn: row => row.serialNo,
      cell: ({ row }) => <div>{row?.original?.serialNo}</div>,
    },
    {
      id: 'userName',
      header: t('table.CRMAccount'),
      accessorFn: row => row.userName,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.userName || '-'}</div>
            <div>({row?.original?.showId})</div>
          </div>
        );
      },
    },
    {
      id: 'businessType',
      header: t('PointsHistory.businessType'),
      accessorFn: row => row.businessType,
      cell: ({ row }) => {
        const type = mergedOperTypeList?.find(
          item => item.dictValue === String(row?.original?.businessType),
        );
        return <div>{type ? type.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'bonusPoints',
      header: () => (
        <div className="flex items-center gap-1">
          {t('PointsHistory.bonusPoints')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="bonusPoints"
          />
        </div>
      ),
      accessorFn: row => row.bonusPoints,
      cell: ({ row }) => <div>+{row?.original?.bonusPoints || '-'}</div>,
    },
    {
      id: 'pointsBalance',
      header: () => (
        <div className="flex items-center gap-1">
          {t('PointsHistory.pointsBalance')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="pointsBalance"
          />
        </div>
      ),
      accessorFn: row => row.pointsBalance,
      cell: ({ row }) => <div>{row?.original?.pointsBalance || '-'}</div>,
    },
    {
      id: 'createBy',
      header: t('products.updateBy'),
      accessorFn: row => row.createBy,
      cell: ({ row }) => <div>{row?.original?.createBy || '-'}</div>,
    },
    {
      id: 'createTime',
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.operationTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="createTime"
          />
        </div>
      ),
      accessorFn: row => row.createTime,
      cell: ({ row }) => <div>{row?.original?.createTime || '-'}</div>,
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('points-mall-points-history-table', allColumns);

  return (
    <div>
      <PageInfo title={t('PointsHistory.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, fuzzyName: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <Button variant="ghost" className="size-8">
                  <Funnel />
                </Button>
              }
            >
              <PointsHistoryForm
                reset={reset}
                setParams={setParams}
                setOtherParams={setOtherParams}
                operTypeList={mergedOperTypeList}
                loading={loading}
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
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
};
