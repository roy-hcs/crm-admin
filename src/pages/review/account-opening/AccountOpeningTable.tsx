import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { CrmNewLoginVerifyItem } from '@/api/hooks/review';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { serverMap } from '@/lib/constant';
import { VerifyStatusOptions } from '@/lib/const';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { RrhSorter } from '@/components/common/RrhSorter';
import { Dispatch, SetStateAction } from 'react';

export const AccountOpeningTable = ({
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
  orderByColumn,
}: {
  data: CrmNewLoginVerifyItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const baseColumns: CRMColumnDef<CrmNewLoginVerifyItem, unknown>[] = [
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
  const commonColumns: CRMColumnDef<CrmNewLoginVerifyItem, unknown>[] = [
    {
      id: 'serverProperty',
      header: t('common.serverType'),
      accessorKey: 'serverProperty',
      cell: ({ row }) => {
        if (row?.original?.serverProperty || row?.original?.serverType) {
          return (
            <div>
              {row?.original?.serverType && serverMap[Number(row?.original?.serverType)]}
              {row?.original?.serverProperty === 1 ? t('common.live') : t('common.demo')}
            </div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'aliasName',
      header: t('common.server'),
      accessorKey: 'aliasName',
      cell: ({ row }) => row.original.aliasName || '-',
    },
    {
      id: 'staName',
      header: t('common.accountType'),
      accessorKey: 'staName',
      cell: ({ row }) => row.original.staName || '-',
    },
    {
      id: 'lever',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.level')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="lever"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorKey: 'lever',
      cell: ({ row }) => (row.original.lever ? `1:${row.original.lever}` : '-'),
    },
    {
      id: 'source',
      header: t('review.accountOpening.source'),
      accessorKey: 'source',
      cell: ({ row }) => row.original.source || '-',
    },
    {
      id: 'status',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.status')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="status"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="subTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="verifyTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
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
  const Columns: CRMColumnDef<CrmNewLoginVerifyItem, unknown>[] = [
    ...baseColumns,
    ...commonColumns,
  ];
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
