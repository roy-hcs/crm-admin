import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RefreshCcw, Search } from 'lucide-react';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { FormSelect } from '@/components/form/FormSelect';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useTabActions } from '@/hooks/useTabActions';
import { useGetUserRoles } from '@/api/hooks/system/system';
import {
  AgencyCrmDetailItem,
  AgencyDetailParams,
  useAgencyOverviewCrmDetailList,
} from '@/api/hooks/report';
import { formatCurrencyAmount } from '@/lib/utils';

type FormValues = {
  name: string;
  email: string;
  roleId: string;
};

const EMPTY_QUERY: FormValues = { name: '', email: '', roleId: '' };

const formatAmount = (value: string | number | null) =>
  value === null || value === undefined || value === '' ? '-' : formatCurrencyAmount(value, 'USD');

type DetailBaseParams = Omit<AgencyDetailParams, 'userId'>;

const CrmDetailContent = ({
  userId,
  baseParams,
  depositFlag,
  onClose,
}: {
  userId: string;
  baseParams: DetailBaseParams;
  depositFlag?: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { openTab } = useTabActions();
  const [query, setQuery] = useState<FormValues>(EMPTY_QUERY);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const form = useForm<FormValues>({ defaultValues: EMPTY_QUERY });
  const { data: roleRes } = useGetUserRoles();

  const { data, isLoading } = useAgencyOverviewCrmDetailList({
    userId,
    ...baseParams,
    depositFlag,
    ...query,
    pageNum: pageNum + 1,
    pageSize,
  });

  const goToDetail = useCallback(
    (row: AgencyCrmDetailItem) => {
      if (!row.userId) return;
      onClose();
      openTab({
        path: `/account/crm-accounts/detail?id=${row.userId}`,
        title: row.username || row.userId,
        key: `/account/crm-accounts/detail?id=${row.userId}`,
      });
    },
    [onClose, openTab],
  );

  const columns = useMemo<CRMColumnDef<AgencyCrmDetailItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'username',
        header: t('table.userName'),
        accessorFn: row => row.username,
      },
      {
        id: 'email',
        header: t('table.email'),
        accessorFn: row => row.email,
      },
      {
        id: 'roleName',
        header: t('table.role'),
        accessorFn: row => row.roleName,
      },
      {
        id: 'inviterName',
        header: t('CRMAccountPage.Upper'),
        accessorFn: row => row.inviterName,
      },
      {
        id: 'inviterEmail',
        header: t('CRMAccountPage.UpperEmail'),
        accessorFn: row => row.inviterEmail,
      },
      {
        id: 'accountNumber',
        header: t('overview.accountNumber'),
        accessorFn: row => row.accountNumber,
      },
      {
        id: 'balance',
        header: t('overview.balance'),
        cell: ({ row }) => <div>{formatAmount(row.original.balance)}</div>,
      },
      {
        id: 'depositAmount',
        header: t('overview.depositAmount'),
        cell: ({ row }) => <div>{formatAmount(row.original.depositAmount)}</div>,
      },
      {
        id: 'withdrawAmount',
        header: t('overview.withdrawAmount'),
        cell: ({ row }) => <div>{formatAmount(row.original.withdrawAmount)}</div>,
      },
      {
        id: 'netDeposit',
        header: t('overview.netDeposit'),
        cell: ({ row }) => <div>{formatAmount(row.original.netDeposit)}</div>,
      },
      {
        id: 'volume',
        header: t('overview.volume'),
        accessorFn: row => row.volume,
      },
      {
        id: 'profitAndLoss',
        header: t('overview.profitAndLoss'),
        cell: ({ row }) => <div>{formatAmount(row.original.profitAndLoss)}</div>,
      },
      {
        id: 'commission',
        header: t('overview.commission'),
        cell: ({ row }) => <div>{formatAmount(row.original.commission)}</div>,
      },
      {
        id: 'swaps',
        header: t('overview.swaps'),
        cell: ({ row }) => <div>{formatAmount(row.original.swaps)}</div>,
      },
      {
        id: 'rebateOnTrade',
        header: t('overview.rebateOnTrade'),
        cell: ({ row }) => <div>{formatAmount(row.original.rebateOnTrade)}</div>,
      },
      {
        id: 'rebateOnCommission',
        header: t('overview.rebateOnCommission'),
        cell: ({ row }) => <div>{formatAmount(row.original.rebateOnCommission)}</div>,
      },
      {
        id: 'rebateOnDeposit',
        header: t('overview.rebateOnDeposit'),
        cell: ({ row }) => <div>{formatAmount(row.original.rebateOnDeposit)}</div>,
      },
      {
        id: 'operation',
        header: () => <div className="flex justify-center">{t('common.Operation')}</div>,
        cell: ({ row }) => (
          <RrhButton
            variant="ghost"
            className="h-auto p-0"
            onClick={() => goToDetail(row.original)}
          >
            {t('common.View')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 60,
      },
    ],
    [t, goToDetail],
  );

  const onSubmit = (values: FormValues) => {
    setQuery(values);
    setPageNum(0);
  };

  const onReset = () => {
    form.reset(EMPTY_QUERY);
    setQuery(EMPTY_QUERY);
    setPageNum(0);
  };

  return (
    <div className="grid gap-4">
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
        <div className="flex flex-wrap items-center gap-2">
          <FormField
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                className="h-9 min-w-48 flex-1"
                placeholder={t('customerTracking.nameOrAccountId')}
              />
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                className="h-9 min-w-48 flex-1"
                placeholder={t('customerTracking.enteremail')}
              />
            )}
          />
          <FormSelect
            name="roleId"
            className="w-40"
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={(roleRes?.data || []).map(item => ({
              label: t(item.roleName),
              value: item.roleId,
            }))}
          />
          <div className="ml-auto flex gap-2">
            <RrhButton type="reset" variant="outline">
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </div>
      </RrhForm>
      <DataTable
        columns={columns}
        data={data?.rows || []}
        loading={isLoading}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export const CrmAccountDetailDialog = ({
  open,
  setOpen,
  userId,
  userName,
  depositFlag,
  baseParams,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  userName: string;
  depositFlag?: string;
  baseParams: DetailBaseParams;
}) => {
  const { t } = useTranslation();
  return (
    <RrhDialog
      title={t('overview.crmAccountDetailTitle', { name: userName })}
      open={open}
      variant="adaptive"
      footerShow={false}
      onOpenChange={setOpen}
    >
      {open && (
        <CrmDetailContent
          userId={userId}
          baseParams={baseParams}
          depositFlag={depositFlag}
          onClose={() => setOpen(false)}
        />
      )}
    </RrhDialog>
  );
};
