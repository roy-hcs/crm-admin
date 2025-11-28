import { MamFollowItem } from '@/api/hooks/copyTrading/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhTag } from '@/components/common/RrhTag';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { arrivalStatusOptions } from '@/lib/const';
import { reviewStatusMap } from '@/lib/constant';
import { Ellipsis } from 'lucide-react';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export const OrderManagementTable = ({
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
  CustomRow,
}: {
  data: MamFollowItem[];
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
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const columns: CRMColumnDef<MamFollowItem, unknown>[] = [
    {
      fixed: 'left',
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
    },
    {
      id: 'signalSourceName',
      header: t('signals.name'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.signalSourceName}</div>
            <div>{row?.original?.traderServer}</div>
            <div>{row?.original?.trader}</div>
          </div>
        );
      },
    },
    {
      id: 'userName',
      header: t('table.subscriptionUsers'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.userName}</div>
            <div>{row?.original?.email}</div>
          </div>
        );
      },
    },
    {
      id: 'clientServer',
      header: t('table.subscriberAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.clientServer}</div>
            <div>{row?.original?.client}</div>
          </div>
        );
      },
    },
    {
      id: 'subscribeFee',
      header: t('orderManagementTable.subscribeFee'),
      cell: ({ row }) => row?.original?.subscribeFee || '-',
    },
    {
      id: 'managementFeeRatio',
      header: t('orderManagementTable.managementFeeRatio'),
      cell: ({ row }) => row?.original?.managementFeeRatio || '-',
    },
    {
      id: 'payAccountName',
      header: t('orderManagementTable.payAccountName'),
      cell: ({ row }) => row?.original?.payAccountName || '-',
    },
    {
      id: 'createTime',
      header: t('table.subscriptionTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'renewalStatus',
      header: t('table.renewalStatus'),
      cell: ({ row }) => {
        if ([0, 1].includes(row?.original?.renewalStatus || 0)) {
          return row?.original?.renewalStatus === 1
            ? t('table.inSubscription')
            : t('table.notInEffect');
        }
        return '-';
      },
    },
    {
      id: 'renewalType',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.type')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="renewalType"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        if ([0, 1].includes(row?.original?.renewalType || 0)) {
          return row?.original?.renewalType === 0 ? t('table.firstSubscription') : t('table.renew');
        }
        return '-';
      },
    },
    {
      id: 'reviewStatus',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.reviewStatus')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="reviewStatus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
        };
        return (
          <RrhTag type={typeMap[row?.original?.reviewStatus || 0]}>
            {t(`table.${reviewStatusMap[row?.original?.reviewStatus || 0]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'reviewTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.verifyTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="reviewTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.reviewTime || '-',
    },
    {
      id: 'followEndTime',
      header: t('table.followEndTime'),
      cell: ({ row }) => row?.original?.followEndTime || '-',
    },
    {
      id: 'reviewRemark',
      header: t('table.reason'),
      cell: ({ row }) => row?.original?.reviewRemark || '-',
    },
    {
      id: 'arrivalStatus',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.arrivalStatus')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="arrivalStatus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const text = arrivalStatusOptions.find(
          i => i.value === String(row?.original?.arrivalStatus || 0),
        );
        return text ? t(text.label) : '-';
      },
    },
    {
      id: 'actualSubscribeFee',
      header: t('table.amountOfReceipt'),
      cell: ({ row }) => row?.original?.actualSubscribeFee || '-',
    },
    {
      id: 'managementFee',
      header: t('table.managementFee'),
      cell: ({ row }) => row?.original?.managementFee || '-',
    },
    {
      id: 'stopTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.arrivalTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="stopTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.stopTime || '-',
    },
    {
      id: 'remark',
      header: t('table.remarks'),
      cell: ({ row }) => row?.original?.remark || '-',
    },
    {
      fixed: 'right',
      size: 50,
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('common.View'), value: 'edit' }]}
            callToAction={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      CustomRow={CustomRow}
    />
  );
};
