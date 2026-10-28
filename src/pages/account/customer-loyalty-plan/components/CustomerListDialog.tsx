import { crmAccountTypeOptions } from '@/lib/const';
import { useCrmUserVipUserList } from '@/api/hooks/account';
import { CrmUserVipUserItem } from '@/api/hooks/account/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormCrmUserSelect } from '@/components/form/FormCrmUserSelect';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { CRMColumnDef, DataTable } from '@/components/table';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTabActions } from '@/hooks/useTabActions';
import { RefreshCcw, Search } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FormValues = {
  name: string;
  accounts: string;
  drirectFlag: string;
};

const CustomerListContent = ({ vipId, onClose }: { vipId: string; onClose: () => void }) => {
  const { t } = useTranslation();
  const { openTab } = useTabActions();
  const [query, setQuery] = useState<FormValues>({ name: '', accounts: '', drirectFlag: 'a' });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const form = useForm<FormValues>({
    defaultValues: { name: '', accounts: '', drirectFlag: 'a' },
  });

  const { data, isLoading } = useCrmUserVipUserList({
    vipId,
    name: query.name,
    pageNum: pageNum + 1,
    pageSize,
    params: {
      accounts: query.accounts,
      drirectFlag: query.drirectFlag,
    },
  });

  const goToDetail = useCallback(
    (row: CrmUserVipUserItem) => {
      onClose();
      openTab({
        path: `/account/crm-accounts/detail?id=${row.id}`,
        title: `${row.lastName ?? ''} ${row.name ?? ''}`.trim() || (row.showId ?? ''),
        key: `/account/crm-accounts/detail?id=${row.id}`,
      });
    },
    [onClose, openTab],
  );

  const columns = useMemo<CRMColumnDef<CrmUserVipUserItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'name',
        header: t('table.fullName'),
        cell: ({ row }) => (
          <div>
            <div>{`${row.original.lastName ?? ''} ${row.original.name ?? ''}`.trim() || '-'}</div>
            <div>{row.original.showId}</div>
          </div>
        ),
      },
      {
        id: 'mobile',
        header: t('CRMAccountPage.Mobile'),
        cell: ({ row }) => (
          <div>
            {row.original.mobile
              ? `${row.original.mzone ? `+${row.original.mzone} ` : ''}${row.original.mobile}`
              : '-'}
          </div>
        ),
      },
      {
        id: 'email',
        header: t('table.email'),
        cell: ({ row }) => <div>{row.original.email || '-'}</div>,
      },
      {
        id: 'role',
        header: t('table.role'),
        cell: ({ row }) => <div>{row.original.role || '-'}</div>,
      },
      {
        id: 'accountType',
        header: t('CRMAccountPage.CRMAccountType'),
        cell: ({ row }) => {
          const option = crmAccountTypeOptions.find(
            item => item.value === String(row.original.accountType),
          );
          return <div>{option ? t(option.label) : '-'}</div>;
        },
      },
      {
        id: 'vipName',
        header: t('CRMAccountPage.LoyaltyLevel'),
        cell: ({ row }) => <div>{row.original.vipName || '-'}</div>,
      },
      {
        id: 'operation',
        header: () => <div className="flex justify-center">{t('common.Operation')}</div>,
        cell: ({ row }) => (
          <div>
            <RrhButton
              variant="ghost"
              className="h-auto p-0"
              onClick={() => goToDetail(row.original)}
            >
              {t('common.View')}
            </RrhButton>
          </div>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, goToDetail],
  );

  const onSubmit = (values: FormValues) => {
    setQuery(values);
    setPageNum(0);
  };

  const onReset = () => {
    form.reset({ name: '', accounts: '', drirectFlag: 'a' });
    setQuery({ name: '', accounts: '', drirectFlag: 'a' });
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
                placeholder={t('customerLoyaltyPlan.searchPlaceholder')}
              />
            )}
          />
          <FormCrmUserSelect name="accounts" className="w-64" />
          <FormSelect
            name="drirectFlag"
            className="w-24"
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('customerTracking.underTheUmbrella'), value: 'a' },
              { label: t('customerTracking.directBroker'), value: 'd' },
            ]}
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

export const CustomerListDialog = ({
  open,
  setOpen,
  vipId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  vipId: string;
}) => {
  const { t } = useTranslation();
  return (
    <RrhDialog
      title={t('customerLoyaltyPlan.customerInfo')}
      open={open}
      variant="large"
      footerShow={false}
      onOpenChange={setOpen}
    >
      {open && <CustomerListContent vipId={vipId} onClose={() => setOpen(false)} />}
    </RrhDialog>
  );
};
