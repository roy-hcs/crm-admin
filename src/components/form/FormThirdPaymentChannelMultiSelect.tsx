import { useThirdPaymentSettingList } from '@/api/hooks/system/system';
import { ThirdPaymentSettingItem } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '../common/RrhMultiSelect';
import { FormSearchMultiSelect } from './FormSearchMultiSelect';

interface FormThirdPaymentChannelMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showRowValue?: boolean;
  initialOptions?: BaseOption[];
}

export function FormThirdPaymentChannelMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 10,
  showRowValue = false,
  initialOptions = [],
}: FormThirdPaymentChannelMultiSelectProps<T>) {
  const { mutateAsync: getChannelList } = useThirdPaymentSettingList();

  const fetchOptions = useCallback(
    async ({
      pageNum,
      pageSize,
      keyword,
    }: {
      pageNum: number;
      pageSize: number;
      keyword: string;
    }) => {
      const res = await getChannelList({
        pageSize,
        pageNum,
        orderByColumn: '',
        isAsc: 'asc',
        params: {
          channelName: keyword,
        },
      });

      const rows = res.rows || [];
      const total = Number(res.total || 0);

      return {
        list: rows.map((item: ThirdPaymentSettingItem) => ({
          value: item.id,
          label: item.channelName,
        })),
        total,
        hasMore: pageNum * pageSize < total,
      };
    },
    [getChannelList],
  );

  return (
    <FormSearchMultiSelect<T>
      name={name}
      label={label}
      placeholder={placeholder ?? ''}
      verticalLabel={verticalLabel}
      className={className}
      searchPlaceholder={searchPlaceholder}
      pageSize={pageSize}
      showRowValue={showRowValue}
      initialOptions={initialOptions}
      fetchOptions={fetchOptions}
    />
  );
}
