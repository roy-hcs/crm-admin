import { useCrmUsers } from '@/api/hooks/system/system';
import { CrmUser } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormSearchMultiSelect } from './FormSearchMultiSelect';
import { BaseOption } from '../common/RrhMultiSelect';

interface FormCrmUserMultiSelectProps<T extends FieldValues> {
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

export function FormCrmUserMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 15,
  showRowValue = false,
  initialOptions = [],
}: FormCrmUserMultiSelectProps<T>) {
  const { mutateAsync: getUserList } = useCrmUsers();

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
      const params = {
        origin: '',
        pageSize,
        pageNum,
        params: {
          threeCons: keyword,
        },
      };

      const res = await getUserList(params);
      const rows = res.rows || [];

      return {
        list: rows.map((item: CrmUser) => ({
          value: item.id,
          label: `${item.lastName ?? ''} ${item.name ?? ''} (${item.showId ?? '-'})`,
        })),
        total: Number(res.total || 0),
        hasMore: pageNum * pageSize < Number(res.total || 0),
      };
    },
    [getUserList],
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
