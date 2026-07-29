import { useCallback, useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { DownloadsListParams, DownloadsListItem } from '@/api/hooks/report';
import { Ellipsis, Funnel, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useDownloadsList,
  useMarkFileAsDownloaded,
  useRemoveFile,
} from '@/api/hooks/report/report';
import { DownloadsForm } from './DownloadsForm';
import { BasicParams } from '@/api/types';
import { downloadStatusOptions } from '@/lib/const';
import { formatFileSize } from '@/lib/utils';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { API_BASE_URL } from '@/api/client';
import { RrhAlert } from '@/components/common/RrhAlert';
import { toast } from 'sonner';
export function DownloadsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commonParams, setCommonParams] = useState<Omit<DownloadsListParams, keyof BasicParams>>({
    exportPath: '',
    status: '',
    beginTime: '',
    endTime: '',
  });

  const {
    data: downloadsData,
    isLoading: downloadsLoading,
    refetch,
  } = useDownloadsList({
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });

  const reset = () => {
    setCommonParams({
      exportPath: '',
      status: '',
      beginTime: '',
      endTime: '',
    });
    setPageNum(0);
    setPageSize(10);
  };
  const [id, setId] = useState<string>('');
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteConfirmAlert, setDeleteConfirmAlert] = useState(false);
  const { mutateAsync: remove } = useRemoveFile();
  const { mutateAsync: markAsDownloaded } = useMarkFileAsDownloaded();

  // 下载文件
  const handleDownload = useCallback(
    async (row: DownloadsListItem) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/system/export/download/${encodeURIComponent(row.taskId)}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error(`下载失败 (${response.status})`);
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `export_${row.taskId}.csv`; // 默认
        if (contentDisposition) {
          const utf8NameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
          const normalNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

          if (utf8NameMatch?.[1]) {
            filename = decodeURIComponent(utf8NameMatch[1]);
          } else if (normalNameMatch?.[1]) {
            filename = normalNameMatch[1];
          }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        await markAsDownloaded({ taskId: row.taskId });
        setDeleteConfirmAlert(true);
        setId(row.taskId);
      } catch (err) {
        console.error('下载文件失败:', err);
      }
    },
    [markAsDownloaded],
  );

  const allColumns = useMemo<CRMColumnDef<DownloadsListItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'name',
        header: t('downloadsPage.taskName'),
        accessorFn: row => `${row.businessName}-${row.createTime}`,
      },
      {
        id: 'businessName',
        header: t('downloadsPage.moduleName'),
        accessorFn: row => row.businessName || '-',
      },
      {
        id: 'status',
        header: t('table.status'),
        accessorFn: row => {
          const text = downloadStatusOptions.find(i => i.value === row.status);
          return text ? t(text.label) : '-';
        },
      },
      {
        id: 'fileSize',
        header: t('downloadsPage.size'),
        accessorFn: row => {
          if (!row.fileSize) return '-';
          return formatFileSize(row.fileSize);
        },
      },
      {
        id: 'username',
        header: t('downloadsPage.initiator'),
        accessorFn: row => row.username || '-',
      },
      {
        id: 'createTime',
        header: t('common.createTime'),
        accessorFn: row => row.createTime || '-',
      },
      {
        id: 'operate',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => {
          return (
            <RrhDropdown
              Trigger={<Ellipsis className="size-4" />}
              dropdownList={[
                {
                  label: t('common.download'),
                  value: 'download',
                  disabled: row.original.status !== 'SUCCESS',
                },
                {
                  label: t('common.delete'),
                  value: 'delete',
                  disabled: row.original.status !== 'SUCCESS',
                },
              ]}
              callToAction={action => {
                if (action === 'download') {
                  handleDownload(row.original);
                } else if (action === 'delete') {
                  setId(row.original.taskId);
                  setDeleteAlert(true);
                }
              }}
            />
          );
        },
        fixed: 'right',
        size: 50,
      },
    ],
    [t, handleDownload, setId, setDeleteAlert],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('reports-downloads-table', allColumns);

  const onConfirm = async () => {
    const res = await remove({ ids: id });
    if (res.code === 0) {
      toast.success(t('common.success'));
    } else {
      toast.error(res.msg);
    }
    setDeleteConfirmAlert(false);
    refetch();
  };

  return (
    <div>
      <PageInfo title={t('common.downloadManagement')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-end">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              asChild
              Trigger={
                <Button variant="ghost" className="size-8 cursor-pointer">
                  <Funnel className="size-4" />
                </Button>
              }
              title="Filter"
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <DownloadsForm
                reset={reset}
                commonParams={commonParams}
                setCommonParams={setCommonParams}
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
          data={downloadsData?.rows || []}
          pageCount={Math.ceil(+(downloadsData?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={downloadsLoading}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={remove}
          params={{ ids: id }}
          tipsText={t('downloadsPage.deleteTips')}
        />

        <RrhAlert
          trigger={null}
          open={deleteConfirmAlert}
          onOpenChange={setDeleteConfirmAlert}
          cancelText={t('common.Cancel')}
          confirmText={t('common.delete')}
          title={t('downloadsPage.deleteConfirmAlert.title')}
          content={t('downloadsPage.deleteConfirmAlert.content')}
          onConfirm={onConfirm}
        />
      </TableContentWrapper>
    </div>
  );
}
