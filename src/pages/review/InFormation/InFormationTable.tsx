import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { CrmInfoVerifyItem } from '@/api/hooks/review/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifyStatusOptions } from '@/lib/const';
import { InfoTypeItem } from '@/api/hooks/system/types';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';

export const InFormationTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  isAsc,
  setIsAsc,
  orderByColumn,
  setOrderByColumn,
  infoTypeList,
}: {
  data: CrmInfoVerifyItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc';
  setIsAsc: (isAsc: 'asc' | 'desc') => void;
  orderByColumn: 'infoType' | 'status' | 'subTime' | 'verifyTime';
  setOrderByColumn: (orderByColumn: 'infoType' | 'status' | 'subTime' | 'verifyTime') => void;
  infoTypeList: InfoTypeItem[];
}) => {
  const { t } = useTranslation();
  const baseColumns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [
    {
      fixed: true,
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
      size: 50,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      accessorFn: row => `${row.userLastName} ${row.userName}`,
      cell: ({ row }) => {
        return !row.original.userLastName && !row.original.userShowId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.userLastName}</div>
            <div>{row.original.userShowId}</div>
          </div>
        );
      },
    },
  ];
  const commonColumns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [
    {
      id: 'infoType',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('review.information.infoType')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('infoType');
              }}
            >
              {orderByColumn === 'infoType' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
          </div>
        );
      },
      accessorKey: 'infoType',
      cell: ({ row }) => {
        const infoType = infoTypeList.find(
          item => Number(item.dictValue) === Number(row.original.infoType),
        );
        return <div>{infoType ? infoType.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'status',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.status')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('status');
              }}
            >
              {orderByColumn === 'status' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
          </div>
        );
      },
      accessorKey: 'status',
      cell: ({ row }) => (
        <RrhOrderStatusTag status={String(row.original.status)} options={VerifyStatusOptions} />
      ),
    },
    {
      id: 'subTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.subTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('subTime');
              }}
            >
              {orderByColumn === 'subTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
          </div>
        );
      },
      accessorKey: 'subTime',
      cell: ({ row }) => row.original.subTime || '-',
    },
    {
      id: 'verifyUserName',
      header: t('review.information.verifyUserName'),
      accessorKey: 'verifyUserName',
      cell: ({ row }) => row.original.verifyUserName || '-',
    },
    {
      id: 'verifyTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('review.information.verifyTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('verifyTime');
              }}
            >
              {orderByColumn === 'verifyTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
          </div>
        );
      },
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
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
    },
  ];
  const Columns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [...baseColumns, ...commonColumns];
  return (
    <DataTable
      columns={Columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
