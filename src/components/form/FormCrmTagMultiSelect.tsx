import { useCrmTag } from '@/api/hooks/system/system';
import { CrmUserTagItem } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '../common/RrhMultiSelect';
import { FormSearchMultiSelect } from './FormSearchMultiSelect';

interface FormCrmTagMultiSelectProps<T extends FieldValues> {
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

export function FormCrmTagMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 15,
  showRowValue = false,
  initialOptions = [],
}: FormCrmTagMultiSelectProps<T>) {
  const { mutateAsync: getTagList } = useCrmTag();

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
      const res = await getTagList({
        status: '1',
        tagName: keyword,
        pageNum,
        pageSize,
      });
      const rows = res.rows || [];

      return {
        list: rows.map((item: CrmUserTagItem) => ({
          value: String(item.id || ''),
          label: item.tagName || '',
        })),
        total: Number(res.total || 0),
        hasMore: pageNum * pageSize < Number(res.total || 0),
      };
    },
    [getTagList],
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
