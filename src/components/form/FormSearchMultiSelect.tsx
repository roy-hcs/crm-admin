import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { FormMultiSelect } from './FormMultiSelect';
import {
  SearchFetchParams,
  SearchFetchResult,
  useSearchOptions,
} from '../../hooks/useSearchOptions';

interface FormSearchMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  fetchOptions: (params: SearchFetchParams) => Promise<SearchFetchResult>;
  showRowValue?: boolean;
  initialOptions?: BaseOption[];
}

export function FormSearchMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder = '',
  pageSize = 10,
  showRowValue = false,
  initialOptions = [],
  fetchOptions,
}: FormSearchMultiSelectProps<T>) {
  const { keyword, setKeyword, options, hasMore, loading, loadingMore, handleLoadMore } =
    useSearchOptions({
      pageSize,
      initialOptions,
      fetchOptions,
    });

  return (
    <FormMultiSelect<T, BaseOption>
      name={name}
      label={label}
      options={options}
      placeholder={placeholder}
      verticalLabel={verticalLabel}
      className={className}
      showRowValue={showRowValue}
      searchSupport
      searchValue={keyword}
      searchPlaceholder={searchPlaceholder}
      onSearchChange={setKeyword}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onDropdownReachEnd={handleLoadMore}
    />
  );
}
