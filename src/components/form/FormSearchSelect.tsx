import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption, RrhMultiSelect } from '../common/RrhMultiSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
  SearchFetchParams,
  SearchFetchResult,
  useSearchOptions,
} from '../../hooks/useSearchOptions';

interface FormSearchSelectProps<T extends FieldValues> {
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
  disabled?: boolean;
}

export function FormSearchSelect<T extends FieldValues>({
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
  disabled = false,
}: FormSearchSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  const { keyword, setKeyword, options, hasMore, loading, loadingMore, handleLoadMore } =
    useSearchOptions({
      pageSize,
      initialOptions,
      fetchOptions,
    });

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem
          className={cn(
            'text-foreground text-sm',
            verticalLabel ? '' : 'flex items-center',
            className,
          )}
        >
          {label && (
            <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12')}>{label}</FormLabel>
          )}

          <FormControl className={cn('grow-0', verticalLabel ? 'w-full' : 'basis-9/12')}>
            <RrhMultiSelect<BaseOption>
              options={options}
              value={field.value ? [String(field.value)] : []}
              onValueChange={(value, option, operator) => {
                if (operator === 'add' && option) {
                  field.onChange(option);
                  return;
                }

                field.onChange(value.length ? value[value.length - 1] : '');
              }}
              className="w-full"
              placeholder={placeholder}
              showRowValue={showRowValue}
              searchSupport
              searchValue={keyword}
              searchPlaceholder={searchPlaceholder}
              onSearchChange={setKeyword}
              loadingMore={loadingMore || loading}
              hasMore={hasMore}
              onDropdownReachEnd={handleLoadMore}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
