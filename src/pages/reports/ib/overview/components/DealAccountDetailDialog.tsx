import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RefreshCcw, Search } from 'lucide-react';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useTabActions } from '@/hooks/useTabActions';
import {
  AgencyDealAccountDetailItem,
  AgencyDetailParams,
  useAgencyOverviewDealAccountDetailList,
} from '@/api/hooks/report';
import { formatCurrencyAmount } from '@/lib/utils';
import {
  VALUE_INDICATOR_SHOW_KEYS,
  useValueIndicatorEnabled,
} from '../../../components/valueIndicator';
import { ValueIndicatorHeader } from '../../../components/ValueIndicatorHelp';

type FormValues = {
  fuzzyName: string;
  fuzzyAccount: string;
  threeCons: string;
};

const EMPTY_QUERY: FormValues = { fuzzyName: '', fuzzyAccount: '', threeCons: '' };

const formatAmount = (value: string | number | null) =>
  value === null || value === undefined || value === '' ? '-' : formatCurrencyAmount(value, 'USD');

type DetailBaseParams = Omit<AgencyDetailParams, 'userId'>;

const DealAccountDetailContent = ({
  userId,
  baseParams,
  onClose,
}: {
  userId: string;
  baseParams: DetailBaseParams;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { openTab } = useTabActions();
  const [query, setQuery] = useState<FormValues>(EMPTY_QUERY);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const form = useForm<FormValues>({ defaultValues: EMPTY_QUERY });
  const valueIndicatorEnabled = useValueIndicatorEnabled(VALUE_INDICATOR_SHOW_KEYS.ibDataOverview);

  const { data, isLoading } = useAgencyOverviewDealAccountDetailList({
    userId,
    ...baseParams,
    ...query,
    pageNum: pageNum + 1,
    pageSize,
  });

  const openCrmDetail = useCallback(
    (crmUserId: string | null, name: string | null) => {
      if (!crmUserId) return;
      onClose();
      openTab({
        path: `/account/crm-accounts/detail?id=${crmUserId}`,
        title: name || crmUserId,
        key: `/account/crm-accounts/detail?id=${crmUserId}`,
      });
    },
    [onClose, openTab],
  );

  const goToDealAccountDetail = useCallback(
    (row: AgencyDealAccountDetailItem) => {
      if (!row.accountId) return;
      onClose();
      const path = `/account/trading-accounts/detail?id=${row.accountId}&serviceType=${baseParams.serverType ?? ''}`;
      openTab({ path, title: row.account || row.accountId, key: path });
    },
    [baseParams.serverType, onClose, openTab],
  );

  const userLink = useCallback(
    (id: string | null, name: string | null, showId: string | null) => {
      if (!id || !showId) return <div>-</div>;
      return (
        <div>
          <RrhButton variant="ghost" className="h-auto p-0" onClick={() => openCrmDetail(id, name)}>
            {name || '-'}
          </RrhButton>
          <div>{showId}</div>
        </div>
      );
    },
    [openCrmDetail],
  );

  const columns = useMemo<CRMColumnDef<AgencyDealAccountDetailItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'username',
        header: t('table.fullName'),
        accessorFn: row => row.username,
      },
      {
        id: 'account',
        header: t('overview.account'),
        accessorFn: row => row.account,
      },
      {
        id: 'aspName',
        header: t('table.threeCons'),
        cell: ({ row }) =>
          userLink(row.original.userId, row.original.aspName, row.original.aspShowId),
      },
      {
        id: 'roleName',
        header: t('overview.accountOwnerRole'),
        accessorFn: row => row.roleName,
      },
      {
        id: 'directBroker',
        header: t('table.directAgent'),
        cell: ({ row }) =>
          userLink(row.original.directBroker, row.original.brokerName, row.original.brokerShowId),
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
      ...(valueIndicatorEnabled
        ? ([
            {
              id: 'valueIndicator',
              label: t('valueIndicator.title'),
              header: () => <ValueIndicatorHeader />,
              cell: ({ row }) =>
                row.original.valueIndicator === null || row.original.valueIndicator === undefined
                  ? '-'
                  : formatCurrencyAmount(row.original.valueIndicator, 'USD'),
            },
          ] as CRMColumnDef<AgencyDealAccountDetailItem, unknown>[])
        : []),
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
            onClick={() => goToDealAccountDetail(row.original)}
          >
            {t('common.View')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 60,
      },
    ],
    [t, userLink, valueIndicatorEnabled, goToDealAccountDetail],
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
            name="fuzzyName"
            render={({ field }) => (
              <Input {...field} className="h-9 min-w-48 flex-1" placeholder={t('table.fullName')} />
            )}
          />
          <FormField
            name="fuzzyAccount"
            render={({ field }) => (
              <Input
                {...field}
                className="h-9 min-w-48 flex-1"
                placeholder={t('overview.account')}
              />
            )}
          />
          <FormField
            name="threeCons"
            render={({ field }) => (
              <Input
                {...field}
                className="h-9 min-w-48 flex-1"
                placeholder={t('table.threeCons')}
              />
            )}
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

export const DealAccountDetailDialog = ({
  open,
  setOpen,
  userId,
  userName,
  baseParams,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  userName: string;
  baseParams: DetailBaseParams;
}) => {
  const { t } = useTranslation();
  return (
    <RrhDialog
      title={t('overview.dealAccountDetailTitle', { name: userName })}
      open={open}
      variant="adaptive"
      footerShow={false}
      onOpenChange={setOpen}
    >
      {open && (
        <DealAccountDetailContent
          userId={userId}
          baseParams={baseParams}
          onClose={() => setOpen(false)}
        />
      )}
    </RrhDialog>
  );
};
