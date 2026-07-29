import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useDownLoadsList,
  useModifyAppDownloadStatus,
  useRemoveAppDownload,
} from '@/api/hooks/setting/setting';
import { AppDownloadItem } from '@/api/hooks/setting/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useDictType } from '@/api/hooks/system';
import { AddEditAppDialog } from './AddEditAppDialog';

export const DownLoadsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: languageList } = useDictType('sys_language');

  const { data, isLoading, refetch } = useDownLoadsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: modifyStatus } = useModifyAppDownloadStatus();
  const { mutateAsync: removeAppDownload } = useRemoveAppDownload();

  const [item, setItem] = useState<AppDownloadItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const allColumns = useMemo<CRMColumnDef<AppDownloadItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'appName',
        header: t('products.goodsName'),
        cell: ({ row }) => row?.original?.appName || '-',
      },
      {
        id: 'downloadLink',
        header: t('common.downloadLink'),
        cell: ({ row }) => row?.original?.downloadLink || '-',
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
        id: 'qrCodeActive',
        header: t('common.qrcode'),
        accessorFn: row => row.qrCodeActive,
        cell: ({ row }) => {
          return (
            <RrhStatusAlert<{
              id: string;
              qrCodeActive: number;
            }>
              params={{
                id: String(row.original.id),
                qrCodeActive: row.original.qrCodeActive === 1 ? 0 : 1,
              }}
              tipsText={
                row.original.qrCodeActive === 1 ? t('ads.confirm.stop') : t('ads.confirm.open')
              }
              checked={row.original.qrCodeActive === 1}
              confirmFunction={modifyStatus}
              onSuccess={refetch}
            />
          );
        },
      },
      {
        id: 'operate',
        header: () => t('common.Operation'),
        cell: ({ row }) => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setItem(row.original);
              switch (action) {
                case 'edit':
                  setOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
                default:
                  break;
              }
            }}
          />
        ),
        fixed: 'right',
      },
    ],
    [modifyStatus, refetch, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-downLoads-table', allColumns);

  const languageOptions = useMemo(
    () =>
      languageList?.map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })) || [],
    [languageList],
  );

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('common.downloadManagement')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
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
          <AddEditAppDialog mode="add" languageOptions={languageOptions} onSuccess={refetch} />
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={isLoading}
        />
        <AddEditAppDialog
          open={open}
          setOpen={setOpen}
          mode="edit"
          item={item}
          languageOptions={languageOptions}
          onSuccess={refetch}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeAppDownload}
          params={{ ids: item?.id || '' }}
          tipsText={t('common.deleteConfirm', {
            field: t('common.downloadLink'),
          })}
        />
      </TableContentWrapper>
    </div>
  );
};
