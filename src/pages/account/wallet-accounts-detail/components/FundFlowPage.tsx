import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FundFlowItem, FundFlowParams, useFundFlowList } from '@/api/hooks/account';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { FundFlowForm } from './FundFlowForm';
import { useDictType } from '@/api/hooks/system';
import { RrhDialog } from '@/components/common/RrhDialog';
import { LabelItem } from '@/components/common/LabelItem';
import { OperationMethodMap, OperationTypeMap } from '@/lib/constant';

const DetailInfo = ({ itemInfo }: { itemInfo: FundFlowItem }) => {
  const { t } = useTranslation();
  let outflowAccount = '';
  if (itemInfo.operationType === 2 || itemInfo.operationMethod === 7) {
    outflowAccount = `${t('table.myWallet')}(${itemInfo.currency})`;
  }
  if (itemInfo.operationType === 3 && itemInfo.operationMethod === 6) {
    outflowAccount = itemInfo?.params?.['serverName'] || '';
  }
  let inflowAccount = '';
  if (
    (itemInfo.operationType && [1, 4].includes(itemInfo.operationType)) ||
    (itemInfo.operationType === 3 && itemInfo.operationMethod === 6)
  ) {
    inflowAccount = `${t('table.myWallet')}(${itemInfo.currency})`;
  }
  if (itemInfo.operationType === 3 && itemInfo.operationMethod === 7) {
    inflowAccount = itemInfo?.params?.['serverName'] || '';
  }

  const accountInfo = [
    {
      label: t('walletTransactions.lastName'),
      value: `${itemInfo.accounts || ''}`,
    },
    {
      label: t('table.userShowId'),
      value: itemInfo.id || '',
    },
  ];
  const flowInfo = [
    {
      label: t('table.operationType'),
      value: itemInfo.operationType ? t(OperationTypeMap[itemInfo.operationType]) : '',
    },
    {
      label: t('table.inMethod'),
      value: itemInfo.operationMethod ? t(OperationMethodMap[itemInfo.operationMethod]) : '',
    },
    {
      label: t('walletTransactions.preAmount'),
      value: `${itemInfo.preAmount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('walletTransactions.amount'),
      value: `${itemInfo.amount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('walletTransactions.postAmount'),
      value: `${itemInfo.postAmount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('walletTransactions.operationTimeTable'),
      value: itemInfo.operationTime || '',
    },
    {
      label: t('walletTransactions.serialNumTable'),
      value: itemInfo.serialNum || '',
    },
    {
      label: t('table.remarks'),
      value: itemInfo.remark || '',
    },
    {
      label: t('table.outflowAccount'),
      value: outflowAccount,
    },
    {
      label: t('table.inflowAccount'),
      value: inflowAccount,
    },
    {
      label: t('walletTransactions.mtOrder'),
      value: itemInfo.mtOrder || '',
    },
  ];
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-card-foreground font-semibold">{t('table.accountInformation')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {accountInfo.map(item => (
            <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-card-foreground font-semibold">{t('table.flowInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {flowInfo.map(item => (
            <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const FundFlowPage = () => {
  const [params, setParams] = useState<FundFlowParams['params']>({
    inMethod: '',
    outMethod: '',
    transMethod: '',
    remaidMethod: '',
    operationStart: '',
    operationEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<FundFlowParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    walletId: '',
    operationType: '',
    serialNum: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: typeRes, isLoading: typeResloading } = useDictType('crm_wallet_opr_type');
  const { data: data, isLoading: loading } = useFundFlowList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      inMethod: '',
      outMethod: '',
      transMethod: '',
      remaidMethod: '',
      operationStart: '',
      operationEnd: '',
    }));
    setOtherParams({
      walletId: '',
      operationType: '',
      serialNum: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<FundFlowItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'operationType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const type = typeRes?.find(item => item.dictValue === String(row.original.operationType));
        return type ? type.dictLabel : '-';
      },
    },
    {
      id: 'operationMethod',
      header: t('table.inMethod'),
      cell: ({ row }) => {
        return row.original.operationMethod
          ? t(OperationMethodMap[row.original.operationMethod])
          : '-';
      },
    },
    {
      id: 'preAmount',
      header: t('walletTransactions.preAmount'),
      cell: ({ row }) => row?.original?.preAmount || '-',
    },
    {
      id: 'amount',
      header: t('walletTransactions.amount'),
      cell: ({ row }) => row?.original?.amount || '-',
    },
    {
      id: 'postAmount',
      header: t('walletTransactions.postAmount'),
      cell: ({ row }) => row?.original?.postAmount || '-',
    },
    {
      id: 'operationTime',
      header: t('walletTransactions.operationTimeTable'),
      cell: ({ row }) => row?.original?.operationTime || '-',
    },
    {
      id: 'serialNum',
      header: t('walletTransactions.serialNumTable'),
      cell: ({ row }) => row?.original?.serialNum || '-',
    },
    {
      id: 'mtOrder',
      header: t('table.tradingOrderNumber'),
      cell: ({ row }) => row?.original?.mtOrder || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <RrhDialog
          title={t('common.detail', { field: t('walletTransactions.title') })}
          trigger={
            <RrhButton variant="ghost" type="button">
              {t('common.View')}
            </RrhButton>
          }
          confirmShow={false}
          variant="large"
        >
          <DetailInfo itemInfo={row.original} />
        </RrhDialog>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-accounts-detail-fund-flow-table', allColumns);

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('walletTransactions.serialNum') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, serialNum: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
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
              <FundFlowForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading || typeResloading}
                reset={reset}
                typeOptions={
                  typeRes?.map(res => ({ label: res.dictLabel, value: res.dictValue })) || []
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
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading || typeResloading}
        />
      </TableContentWrapper>
    </div>
  );
};
