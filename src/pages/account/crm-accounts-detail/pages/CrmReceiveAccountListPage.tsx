import { useGetReceiveAccountInfo } from '@/api/hooks/agent/agent';
import { ReceiveAccountInfoItem, ReceiveAccountInfoParams } from '@/api/hooks/agent/types';
import { useGetUserKycTab } from '@/api/hooks/system/system';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
type AccountType = '1' | '2' | '3';
export const CrmReceiveAccountListPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<AccountType>('1');
  const { data: userInfoRes } = useGetUserKycTab(userId);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const initOtherParams = {
    lastName: '',
    name: '',
    roleId: '',
    country: '',
    accountType: '',
    email: '',
    mzone: '',
    mobile: '',
    preferenceLanguage: '',
    colorPreference: '',
    googleCode: '',
  };
  const [otherParams, setOtherParams] = useState<ReceiveAccountInfoParams>(initOtherParams);
  useEffect(() => {
    if (userInfoRes?.data) {
      const userInfo = userInfoRes.data.crmUser;
      setOtherParams({
        lastName: userInfo.lastName || '',
        name: userInfo.name || '',
        roleId: userInfo.roleId || '',
        country: userInfo.country || '',
        accountType: userInfo.accountType ? userInfo.accountType.toString() : '',
        email: userInfo.email || '',
        mzone: userInfo.mzone || '',
        mobile: userInfo.mobile || '',
        preferenceLanguage: userInfo.preferenceLanguage || '',
        colorPreference: userInfo.colorPreference || '',
        googleCode: '',
      });
    }
  }, [userInfoRes]);
  const {
    data: receiveAccountInfoRes,
    refetch,
    isLoading,
  } = useGetReceiveAccountInfo(
    userId,
    type,
    {
      ...otherParams,
      pageNum: pageNum + 1,
      pageSize,
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!userId && !!userInfoRes?.data },
  );
  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    setOtherParams(initOtherParams);
    refetch();
  };
  const allColumns: CRMColumnDef<ReceiveAccountInfoItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'accountHolderName',
      header: t('table.accountHolderName'),
      accessorFn: row => row.accountName || '-',
    },
    {
      id: 'accountHolderBank',
      header: t('table.accountHolderBank'),
      accessorFn: row => row.bank || '-',
    },
    {
      id: 'bankCardNumber',
      header: t('table.bankCardNumber'),
      accessorFn: row => row.cardNo || '-',
    },
    {
      id: 'branchName',
      header: t('table.branchName'),
      accessorFn: row => row.subBranchName || '-',
    },
  ];
  const filters: { label: string; value: AccountType }[] = [
    {
      label: t('table.bankAccount'),
      value: '1',
    },
    {
      label: t('table.wireTransferAccount'),
      value: '2',
    },
    {
      label: t('table.cryptocurrency'),
      value: '3',
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, columnMeta, tableColumns } =
    useColumnVisibility('crm-receive-account-list', allColumns);

  return (
    <TableContentWrapper>
      <div className="mt-2 mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {filters.map(filter => (
            <RrhButton
              variant={filter.value === type ? 'default' : 'outline'}
              size="sm"
              key={filter.label}
              onClick={() => setType(filter.value)}
            >
              {filter.label}
            </RrhButton>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
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
        data={receiveAccountInfoRes?.rows || []}
        pageCount={Math.ceil(+(receiveAccountInfoRes?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
    </TableContentWrapper>
  );
};
