import { useCountryList } from '@/api/hooks/system/system';
import { CountryItem } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '../common/RrhMultiSelect';
import { FormSearchSelect } from './FormSearchSelect';

interface FormCountrySelectProps<T extends FieldValues> {
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

export function FormCountrySelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 20,
  showRowValue = false,
  initialOptions = [],
}: FormCountrySelectProps<T>) {
  const { mutateAsync: getCountryList } = useCountryList();

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
      const res = await getCountryList({
        countryName: keyword || undefined,
        status: 1,
        pageNum,
        pageSize,
      });
      const rows = res.rows || [];
      const total = Number(res.total || 0);

      return {
        list: rows.map((item: CountryItem) => ({
          value: item.id.toString(),
          label: item.countryName,
        })),
        total,
        hasMore: pageNum * pageSize < total,
      };
    },
    [getCountryList],
  );

  return (
    <FormSearchSelect<T>
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
