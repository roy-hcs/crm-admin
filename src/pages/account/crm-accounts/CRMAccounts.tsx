import { CrmUserItem, CrmUserParams, useCrmUser, useTagUserCountList } from '@/api/hooks/account';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Ellipsis,
  FileOutput,
  Funnel,
  RefreshCcw,
  Search,
  Tag,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { CRMAccountsForm, CRMFormRef } from './components/CRMAccountsForm';
import { AddUserDialog } from './components/AddUserDialog';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusCell } from './components/StatusCell';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { ResetPassword } from './components/ResetPassword';
import { DeleteAccount } from './components/DeleteAccount';
import { AccountTags } from './components/AccountTags';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const CRMAccounts = () => {
  const formRef = useRef<CRMFormRef>(null);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tags, setTags] = useState('');
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<CrmUserParams['params']>({
    threeCons: '',
    regEndTime: '',
    regStartTime: '',
    fuzzyMobile: '',
    fuzzyEmail: '',
    inviter: '',
    accounts: '',
  });

  const { t } = useTranslation();
  const [otherParams, setOtherParams] = useState<Omit<CrmUserParams, 'params' | keyof BasicParams>>(
    {
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
    },
  );

  const { data: tagUserCountList, isLoading: tagUserCountListLoading } = useTagUserCountList();
  const {
    data: crmUsers,
    isLoading: crmUsersLoading,
    refetch: refetchCrmUser,
  } = useCrmUser(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      params,
      isAsc,
      tags,
      ...otherParams,
    },
    'origin=1',
  );

  const reset = () => {
    setParams({
      threeCons: '',
      regEndTime: '',
      regStartTime: '',
      fuzzyMobile: '',
      fuzzyEmail: '',
      inviter: '',
      accounts: '',
    });
    setOtherParams({
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
    });
    setTags('');
    setPageNum(0);
    formRef.current?.onReset();
  };

  const allColumns: CRMColumnDef<CrmUserItem, unknown>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      label: t('common.select'),
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.userName,
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: t('CRMAccountPage.Status'),
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      id: 'mobile',
      header: t('CRMAccountPage.Mobile'),
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.mzone ? `+${row.original.mzone} ` : ''}</span>
          <span>{row.original.mobile}</span>
        </div>
      ),
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: t('table.email'),
    },
    {
      id: 'accountTypeStr',
      accessorKey: 'accountTypeStr',
      header: t('CRMAccountPage.CRMAccountType'),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: t('CRMAccountPage.Role'),
    },
    {
      id: 'crmRebateLevel',
      accessorKey: 'crmRebateLevel',
      header: t('CRMAccountPage.Level'),
      cell: ({ row }) => {
        const crmRebateLevel = row.original.crmRebateLevel;
        return crmRebateLevel ? (
          <div>
            {crmRebateLevel?.levelName}({crmRebateLevel?.level} {t('CRMAccountPage.Level')})
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      id: 'tags',
      header: t('CRMAccountPage.TagsName'),
      accessorFn: row => row.tags,
      cell: ({ row }) => {
        const tagsString = row.original.tags || '';
        const tags = tagsString.trim() ? tagsString.split(',') : [];
        const length = tags.length;
        if (length === 0) return <div>-</div>;
        return (
          <div className="flex items-center gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="border-border rounded-md border p-1">
                {tag}
              </span>
            ))}
            <span>{length > 3 ? `+${length - 3}` : ''}</span>
          </div>
        );
      },
    },
    {
      id: 'latestFollowupTime',
      accessorKey: 'latestFollowupTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('CRMAccountPage.LatestFollowupTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => setIsAsc(isAsc === 'asc' ? 'desc' : 'asc')}
            >
              <ChevronUp className={cn('size-3', isAsc === 'asc' ? '' : 'opacity-50')} />
              <ChevronDown className={cn('size-3', isAsc === 'asc' ? 'opacity-50' : '')} />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        const latestFollowupTimeArr = (row.original.latestFollowupTime || '-').split(' ');
        return (
          <div>
            {latestFollowupTimeArr.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        );
      },
    },
    {
      id: 'createTime',
      accessorKey: 'createTime',
      header: t('CRMAccountPage.RegisterTime'),
      cell: ({ row }) => {
        const createTimeArr = (row.original.createTime || '-').split(' ');
        return (
          <div>
            {createTimeArr.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        );
      },
    },
    {
      id: 'upper',
      header: t('CRMAccountPage.Upper'),
      accessorFn: row => row.nameOne + row.nameTwo,
      cell: ({ row }) => {
        if (!row.original.nameOne && !row.original.nameTwo) return <div>-</div>;
        return (
          <div>
            <div>{`${row.original.nameOne} ${row.original.nameTwo}`}</div>
            <div>{row.original.inviterShowId}</div>
          </div>
        );
      },
    },
    {
      id: 'inviterEmail',
      accessorKey: 'inviterEmail',
      header: t('CRMAccountPage.UpperEmail'),
    },
    {
      id: 'mtone',
      accessorKey: 'mtone',
      header: t('CRMAccountPage.RealAccount'),
      cell: ({ row }) => {
        const account = row.original.mtone || '-';
        return (
          <div className="line-clamp-1 w-22.5 text-ellipsis" title={account}>
            {account}
          </div>
        );
      },
    },
    {
      id: 'mttwo',
      accessorKey: 'mttwo',
      header: t('CRMAccountPage.DemoAccount'),
      cell: ({ row }) => {
        const account = row.original.mttwo || '-';
        return (
          <div className="line-clamp-1 w-22.5 text-ellipsis" title={account}>
            {account}
          </div>
        );
      },
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.resetPassword'), value: 'resetPassword' },
              { label: t('common.resetFundPassword'), value: 'resetFundPassword' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              switch (action) {
                case 'view':
                  // View action
                  break;
                case 'resetPassword':
                  setId(row.original.id);
                  setIsResetPasswordDialogOpen(true);
                  break;
                case 'resetFundPassword':
                  setId(row.original.id);
                  setIsResetFundsPasswordDialogOpen(true);
                  break;
                case 'delete':
                  setId(row.original.id);
                  setIsDeleteDialogOpen(true);
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, columnMeta, tableColumns } =
    useColumnVisibility('crm-accounts-table', allColumns);

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isResetFundsPasswordDialogOpen, setIsResetFundsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [id, setId] = useState<string>('');
  const btnsList = [
    {
      label: (
        <RrhButton variant="ghost" className="flex w-full items-center justify-start">
          <FileOutput className="size-4" />
          <span>{t('CRMAccountPage.Export')}</span>
        </RrhButton>
      ),
      value: 'export',
    },

    {
      label: (
        <RrhButton variant="ghost" className="flex w-full items-center justify-start">
          <UserRoundCog className="size-4" />
          <span>{t('CRMAccountPage.SetRolesInBatches')}</span>
        </RrhButton>
      ),
      value: 'setRolesInBatches',
    },
    {
      label: (
        <RrhButton variant="ghost" className="flex w-full items-center justify-start">
          <UsersRound className="size-4" />
          <span>{t('CRMAccountPage.UserStatistics')}</span>
        </RrhButton>
      ),
      value: 'userStatistics',
    },
    {
      label: (
        <RrhButton variant="ghost" className="flex w-full items-center justify-start">
          <Tag className="size-4" />
          <span>{t('CRMAccountPage.LifecycleAndUserTags')}</span>
        </RrhButton>
      ),
      value: 'lifecycleAndUserTags',
    },
  ];

  return (
    <div>
      <PageInfo
        title={t('CRMAccountPage.title')}
        desc={t('CRMAccountPage.desc')}
        wrapperCls="-mx-6 px-6 pt-2 pb-4"
      />
      <AccountTags
        userCount={crmUsers?.total || '0'}
        setTags={setTags}
        tagUserCountList={tagUserCountList?.data || []}
        tagUserCountListLoading={tagUserCountListLoading}
      />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="flex gap-2">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.NameOrAccountId') })}
              className="h-9 w-95"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, threeCons: keyword }));
                setPageNum(0);
              }}
            />
            <RrhDrawer
              headerShow={false}
              asChild
              Trigger={
                <Button variant="ghost" className="size-8">
                  <Funnel className="size-4" />
                </Button>
              }
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <CRMAccountsForm
                tagsUserList={tagUserCountList?.data || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                setTags={setTags}
                reset={reset}
                params={params}
                otherParams={otherParams}
              />
            </RrhDrawer>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDropdown Trigger={<Ellipsis className="size-4" />} dropdownList={btnsList} />

            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddUserDialog onSuccess={refetchCrmUser} />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={crmUsers?.rows || []}
          pageCount={Math.ceil(+(crmUsers?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={crmUsersLoading || tagUserCountListLoading}
        />
        <ResetPassword
          id={id}
          type="password"
          title={t('common.resetPassword')}
          isResetDialogOpen={isResetPasswordDialogOpen}
          setIsResetDialogOpen={setIsResetPasswordDialogOpen}
        />
        <ResetPassword
          id={id}
          type="fundPassword"
          title={t('common.resetFundPassword')}
          isResetDialogOpen={isResetFundsPasswordDialogOpen}
          setIsResetDialogOpen={setIsResetFundsPasswordDialogOpen}
        />
        {id && (
          <DeleteAccount
            id={id}
            title={t('common.deleteAccount')}
            isResetDialogOpen={isDeleteDialogOpen}
            setIsResetDialogOpen={setIsDeleteDialogOpen}
          />
        )}
      </TableContentWrapper>
    </div>
  );
};
