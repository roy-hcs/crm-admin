import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdsList, AdsListItem, useChangeAdsStatus, useRemoveAds } from '@/api/hooks/marketing';
import { PageInfo } from '@/components/common/PageInfo';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { AddEditAdsDialog } from './components/AddEditAdsDialog';
import { useDictType, useUserRoleList } from '@/api/hooks/system';
import { useMsgTemplateList } from '@/api/hooks/message';

export const AdsPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const { data: languageList, isLoading: languageLoading } = useDictType('sys_language');
  const { data: msgTemplateList, isLoading: templateListLoading } = useMsgTemplateList({});

  const { mutateAsync: modifyStatus } = useChangeAdsStatus();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // const [detailOpen, setDetailOpen] = useState(false);
  const [id, setId] = useState('');
  const { mutateAsync: remove } = useRemoveAds();
  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useAdsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
  });

  const { data: userRoleList, isLoading: userRoleListLoading } = useUserRoleList({});

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
  };

  const allColumns: CRMColumnDef<AdsListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('ads.name'),
      accessorFn: row => row.name,
      cell: ({ row }) => {
        return <div>{row?.original?.name || '-'}</div>;
      },
    },
    {
      id: 'position',
      header: t('ads.position'),
      accessorFn: row => row.position,
      cell: ({ row }) => {
        return <div>{t(`ads.positionType.${row?.original?.position}`) || '-'}</div>;
      },
    },
    {
      id: 'sort',
      label: t('table.sort'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.sort')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="sort"
          />
        </div>
      ),
      accessorFn: row => row.sort,
      cell: ({ row }) => {
        return <div>{row?.original?.sort || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        return (
          <RrhStatusAlert<{
            id: string;
            status: number;
          }>
            params={{
              id: String(row.original.id),
              status: row.original.status === 1 ? 0 : 1,
            }}
            tipsText={row.original.status === 1 ? t('ads.confirm.stop') : t('ads.confirm.open')}
            checked={row.original.status === 1}
            confirmFunction={modifyStatus}
            onSuccess={refetch}
          />
        );
      },
    },
    {
      id: 'clickCount',
      label: t('ads.clickCount'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('ads.clickCount')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="clickCount"
          />
        </div>
      ),
      accessorFn: row => row.clickCount,
      cell: ({ row }) => {
        return <div>{row?.original?.clickCount || '-'}</div>;
      },
    },
    {
      id: 'updateBy',
      header: t('table.operator'),
      accessorFn: row => row.updateBy,
      cell: ({ row }) => {
        return <div>{row?.original?.updateBy || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      label: t('table.updateTime'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.updateTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="updateTime"
          />
        </div>
      ),
      accessorFn: row => row.updateTime,
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setId(row.original.id || '');
              if (action === 'edit') {
                setEditOpen(true);
              } else if (action === 'delete') {
                setDeleteAlert(true);
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
    useColumnVisibility('marketing-ads-table', allColumns);

  const languageOptions = useMemo(
    () =>
      languageList?.map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })) || [],
    [languageList],
  );

  const roleOptions = useMemo(
    () =>
      userRoleList?.rows.map(i => ({
        label: i.roleName,
        value: String(i.roleId),
      })) || [],
    [userRoleList?.rows],
  );

  const templateOptions = useMemo(
    () =>
      msgTemplateList?.rows?.map(i => ({
        label: i.title || '',
        value: i.id || '',
      })) || [],
    [msgTemplateList?.rows],
  );

  return (
    <div>
      <PageInfo title={t('ads.name')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
          </div>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <AddEditAdsDialog
            mode="add"
            onSuccess={refetch}
            languageOptions={languageOptions}
            roleOptions={roleOptions}
            templateOptions={templateOptions}
          />
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading || languageLoading || userRoleListLoading || templateListLoading}
        />
        <AddEditAdsDialog
          mode="edit"
          open={editOpen}
          onOpenChange={v => {
            if (!v) setId('');
            setEditOpen(v);
          }}
          id={id}
          onSuccess={refetch}
          languageOptions={languageOptions}
          roleOptions={roleOptions}
          templateOptions={templateOptions}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={remove}
          params={{ ids: id }}
          tipsText={t('products.confirmDeleteTips')}
        />
      </TableContentWrapper>
    </div>
  );
};
