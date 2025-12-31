import { CrmUserItem, CrmUserParams, useCrmUser, useTagUserCountList } from '@/api/hooks/account';
import { TagUserItem } from '@/api/hooks/account';
import { EmblaCarousel } from '@/components/common/EmblaCarousel';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  CircleChevronLeft,
  Download,
  Ellipsis,
  Funnel,
  Menu,
  RefreshCcw,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { FC, useRef, useState } from 'react';
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

const TagItem: FC<TagUserItem & { setTags: (id: string) => void; className?: string }> = ({
  userCount,
  id,
  tagName,
  setTags,
  className,
}) => {
  return (
    <div
      onClick={() => setTags(id)}
      className={cn(
        'bg-card group/tag border-border relative min-w-27.5 cursor-pointer rounded-lg border p-3',
        className,
      )}
    >
      <div className="mb-1 text-xs">{tagName}</div>
      <div className="font-medium">{userCount}</div>
      <Search className="absolute top-2 right-2 hidden size-3 group-hover/tag:block" />
    </div>
  );
};

export const CRMAccounts = () => {
  const formRef = useRef<CRMFormRef>(null);
  const [actionBtnsShow, setActionBtnsShow] = useState(false);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tags, setTags] = useState('');
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
  const { data: crmUsers, isLoading: crmUsersLoading } = useCrmUser(
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
          <div className="flex max-w-50 flex-wrap items-center gap-1">
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
        const latestFollowupTime = row.original.latestFollowupTime || '-';
        return (
          <div className="max-w-25 whitespace-pre-wrap">
            <div>{latestFollowupTime}</div>
          </div>
        );
      },
    },
    {
      id: 'createTime',
      accessorKey: 'createTime',
      header: t('CRMAccountPage.RegisterTime'),
      cell: ({ row }) => {
        return <div className="max-w-25 whitespace-pre-wrap">{row.original.createTime}</div>;
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
            <div>{row.original.nameOne}</div>
            <div>{row.original.nameTwo}</div>
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
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.View'), value: 'view' },
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
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, columnMeta, tableColumns } =
    useColumnVisibility('crm-accounts-table', allColumns);
  return (
    <div>
      <PageInfo
        title={t('CRMAccountPage.title')}
        desc={t('CRMAccountPage.desc')}
        wrapperCls="-mx-6 border-b px-6 pt-2 pb-4"
      />
      <div className="group/swiper mt-4 flex items-center gap-4">
        <TagItem
          tagName="总计(客户)"
          userCount={crmUsers?.total || '0'}
          setTags={setTags}
          id={''}
          className="shrink-0"
        />
        {tagUserCountListLoading ? (
          <div className="flex h-full basis-full animate-pulse items-center justify-center">
            {t('common.loading')}
          </div>
        ) : (
          <EmblaCarousel
            options={{
              align: 'start',
              containScroll: 'trimSnaps',
            }}
            PreButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="hidden h-full cursor-pointer group-hover/swiper:block disabled:cursor-not-allowed"
              >
                <CircleChevronLeft className="text-foreground" />
              </button>
            )}
            NextButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="hidden h-full cursor-pointer group-hover/swiper:block disabled:cursor-not-allowed"
              >
                <CircleChevronLeft className="text-foreground rotate-180" />
              </button>
            )}
            wrapperCls="gap-1"
          >
            {tagUserCountList?.data.map(item => (
              <TagItem
                key={item.id}
                id={item.id}
                tagName={item.tagName}
                userCount={item.userCount}
                setTags={setTags}
                className="shrink-0 grow-0"
              />
            ))}
          </EmblaCarousel>
        )}
      </div>
      <div className="mt-4">
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            {actionBtnsShow && (
              <>
                <RrhButton variant="outline">
                  <Download className="size-3.5" />
                  <span>{t('CRMAccountPage.Export')}</span>
                </RrhButton>
                <RrhButton variant="outline">
                  <Menu className="size-3.5" />
                  <span>{t('CRMAccountPage.SetRolesInBatches')}</span>
                </RrhButton>
                <RrhButton variant="outline">
                  <Users className="size-3.5" />
                  <span>{t('CRMAccountPage.UserStatistics')}</span>
                </RrhButton>
                <RrhButton variant="outline">
                  <Settings className="size-3.5" />
                  <span>{t('CRMAccountPage.LifecycleAndUserTags')}</span>
                </RrhButton>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => setActionBtnsShow(!actionBtnsShow)}
            >
              <Ellipsis />
            </Button>
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
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddUserDialog />
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
      </div>
    </div>
  );
};
