import { useCrmGroup } from '@/api/hooks/system/system';
import { CrmGroupItem } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '../common/RrhMultiSelect';
import { FormSearchMultiSelect } from './FormSearchMultiSelect';

interface FormCrmGroupMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  serverId: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showRowValue?: boolean;
  initialOptions?: BaseOption[];
}

export function FormCrmGroupMultiSelect<T extends FieldValues>({
  name,
  label,
  serverId,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 15,
  showRowValue = false,
  initialOptions = [],
}: FormCrmGroupMultiSelectProps<T>) {
  const { mutateAsync: getGroupList } = useCrmGroup();

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
      if (!serverId) {
        return {
          list: [],
          total: 0,
          hasMore: false,
        };
      }

      const res = await getGroupList({
        serverId,
        params: {
          origin: '0',
          pageNum,
          pageSize,
          params: {
            threeCons: keyword,
          },
        },
      });
      const rows = res.rows || [];

      return {
        list: rows.map((item: CrmGroupItem) => ({
          value: item.id,
          label: item.groupName || '',
        })),
        total: Number(res.total || 0),
        hasMore: pageNum * pageSize < Number(res.total || 0),
      };
    },
    [getGroupList, serverId],
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
