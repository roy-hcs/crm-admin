import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { CrmInfoVerifyItem } from '@/api/hooks/review';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { VerifyStatusOptions } from '@/lib/const';
import { InfoTypeItem } from '@/api/hooks/system/types';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { Dispatch, SetStateAction } from 'react';
import { RrhSorter } from '@/components/common/RrhSorter';

export const InformationTable = ({
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
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="infoType"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <div>{t('review.information.verifyTime')}</div>
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
