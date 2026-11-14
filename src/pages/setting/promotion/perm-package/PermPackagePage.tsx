import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CRMColumnDef, DataTable } from '@/components/table';
import { PageInfo } from '@/components/common/PageInfo';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useChangePermPackageStatus,
  usePermPackageList,
  useRemovePermPackage,
} from '@/api/hooks/setting/spreadPermPackage';
import type { PermPackageDialogMode, PermPackageItem } from '@/api/hooks/setting/permPackageTypes';
import { PermPackageDialog } from './components/PermPackageDialog';

/**
 * 权限包管理（P3a）
 * 旧 RuoYi 页 `templates/system/spreadPermPackage/spreadPermPackage.html` 的 SPA 复刻：
 * name + status 搜索、resetForm 清空、列表、新增/编辑、启停、删除。
 */
export const PermPackagePage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState({ name: '', status: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<PermPackageDialogMode>('add');
  const [current, setCurrent] = useState<PermPackageItem | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<PermPackageItem | undefined>(undefined);

  const { data, isLoading, refetch } = usePermPackageList({
    pageNum: pageNum + 1,
    pageSize,
    name: query.name,
    status: query.status,
  });
  const { mutateAsync: changeStatus } = useChangePermPackageStatus();
  const { mutateAsync: remove } = useRemovePermPackage();

  const search = useCallback(() => {
    setPageNum(0);
    setQuery({ name, status });
  }, [name, status]);

  /** 旧页 resetForm()：清空全部搜索条件并回到第一页 */
  const reset = useCallback(() => {
    setName('');
    setStatus('');
    setQuery({ name: '', status: '' });
    setPageNum(0);
    setPageSize(10);
  }, []);

  const openAdd = useCallback(() => {
    setCurrent(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((item: PermPackageItem) => {
    setCurrent(item);
    setDialogMode('edit');
    setDialogOpen(true);
  }, []);

  const onToggleStatus = useCallback(
    async (item: PermPackageItem) => {
      const next = item.status === '1' ? '0' : '1';
      try {
        await changeStatus({ id: item.id, status: next });
        toast.success(t('common.success'));
        await refetch();
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    },
    [changeStatus, refetch, t],
  );

  const onConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await remove(String(deleteTarget.id));
      toast.success(t('common.success'));
      setDeleteTarget(undefined);
      await refetch();
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  }, [deleteTarget, remove, refetch, t]);

  const columns = useMemo<CRMColumnDef<PermPackageItem, unknown>[]>(
    () => [
      {
        id: 'name',
        header: t('permPackagePage.name'),
        cell: ({ row }) => row.original.name || '-',
      },
      {
        id: 'code',
        header: t('permPackagePage.code'),
        cell: ({ row }) => row.original.code || '-',
      },
      {
        id: 'status',
        header: t('permPackagePage.status'),
        cell: ({ row }) =>
          row.original.status === '0' ? t('permPackagePage.disable') : t('permPackagePage.enable'),
      },
      {
        id: 'applicableUserCount',
        header: t('permPackagePage.applicableUserCount'),
        cell: ({ row }) => row.original.applicableUserCount ?? '-',
      },
      {
        id: 'remark',
        header: t('permPackagePage.remark'),
        cell: ({ row }) => row.original.remark || '-',
      },
      {
        id: 'operate',
        header: t('common.Operation'),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="link"
              size="sm"
              data-testid="spread-perm-edit-button"
              onClick={() => openEdit(row.original)}
            >
              {t('common.Edit')}
            </Button>
            <Button
              type="button"
              variant="link"
              size="sm"
              data-testid="spread-perm-change-status-button"
              onClick={() => void onToggleStatus(row.original)}
            >
              {row.original.status === '1'
                ? t('permPackagePage.disable')
                : t('permPackagePage.enable')}
            </Button>
            <Button
              type="button"
              variant="link"
              size="sm"
              data-testid="spread-perm-delete-button"
              onClick={() => setDeleteTarget(row.original)}
            >
              {t('common.delete')}
            </Button>
          </div>
        ),
      },
    ],
    [onToggleStatus, openEdit, t],
  );

  return (
    <div data-testid="spread-perm-screen">
      <PageInfo title={t('permPackagePage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input
            className="w-56"
            value={name}
            placeholder={t('permPackagePage.namePlaceholder')}
            onChange={event => setName(event.target.value)}
          />
          <select
            aria-label={t('permPackagePage.status')}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            value={status}
            onChange={event => setStatus(event.target.value)}
          >
            <option value="">{t('common.select')}</option>
            <option value="1">{t('permPackagePage.enable')}</option>
            <option value="0">{t('permPackagePage.disable')}</option>
          </select>
          <RrhButton type="button" data-testid="spread-perm-search-button" onClick={search}>
            {t('common.Search')}
          </RrhButton>
          <RrhButton
            type="button"
            variant="outline"
            data-testid="spread-perm-reset-button"
            onClick={reset}
          >
            {t('common.Reset')}
          </RrhButton>
          <RrhButton type="button" className="ml-auto" onClick={openAdd}>
            {t('common.add')}
          </RrhButton>
        </div>

        <div data-testid="spread-perm-list">
          <DataTable
            columns={columns}
            data={data?.rows ?? []}
            pageCount={Math.ceil(Number(data?.total ?? 0) / pageSize)}
            pageIndex={pageNum}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={setPageSize}
            loading={isLoading}
          />
        </div>
      </TableContentWrapper>

      <PermPackageDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        mode={dialogMode}
        item={current}
        onSuccess={() => void refetch()}
      />

      <RrhDialog
        title={t('common.SystemPrompt')}
        open={Boolean(deleteTarget)}
        onOpenChange={open => !open && setDeleteTarget(undefined)}
        onCancel={() => setDeleteTarget(undefined)}
        onConfirm={() => void onConfirmDelete()}
        type="view"
      >
        {t('permPackagePage.deleteConfirm')}
      </RrhDialog>
    </div>
  );
};
