import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { BindVerifyListItem } from '@/api/hooks/review/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { RrhTag } from '@/components/common/RrhTag';
import { VerifyStatusOptions } from '@/lib/const';
import { cn } from '@/lib/utils';

export const BindingTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  isAsc,
  setIsAsc,
  setOrderByColumn,
}: {
  data: BindVerifyListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: (isAsc: 'asc' | 'desc' | '') => void;
  setOrderByColumn: (
    orderByColumn: 'status desc,subTime desc' | 'lever' | 'status' | 'subTime' | 'verifyTime',
  ) => void;
}) => {
  const { t } = useTranslation();
  const baseColumns: CRMColumnDef<BindVerifyListItem, unknown>[] = [
    {
      fixed: true,
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row?.original?.userLastName || row?.original?.userShowId || row?.original?.userName) {
          return (
            <div>
              <div>
                {(row?.original?.userLastName || '') + ' ' + (row?.original?.userName || '')}
              </div>
              <div>{row?.original?.userShowId}</div>
            </div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
  ];
  const commonColumns: CRMColumnDef<BindVerifyListItem, unknown>[] = [
    {
      id: 'aliasName',
      header: t('common.server'),
      accessorKey: 'aliasName',
      cell: ({ row }) => {
        if (row?.original?.aliasName && row?.original?.severProperty) {
          return (
            <div>
              {row?.original?.aliasName}
              {Number(row?.original?.severProperty || 0) === 1
                ? t('common.live')
                : t('common.demo')}
            </div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'staName',
      header: t('table.tradingAccount'),
      accessorKey: 'staName',
      cell: ({ row }) => row.original.login || '-',
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
              {isAsc === '' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              )}
            </button>
          </div>
        );
      },
      accessorKey: 'status',
      cell: ({ row }) => (
        <RrhTag status={String(row.original.status)} options={VerifyStatusOptions} />
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
              {isAsc === '' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
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
            <div>{t('common.verifyTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('verifyTime');
              }}
            >
              {isAsc === '' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
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
  const Columns: CRMColumnDef<BindVerifyListItem, unknown>[] = [...baseColumns, ...commonColumns];
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
