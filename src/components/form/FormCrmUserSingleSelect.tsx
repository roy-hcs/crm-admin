import { useCrmUsers } from '@/api/hooks/system/system';
import { CrmUser } from '@/api/hooks/system/types';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { useCallback, useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { RrhSearchSelect } from '../common/RrhSearchSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface FormCrmUserSingleSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showRowValue?: boolean;
}

export function FormCrmUserSingleSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 15,
  showRowValue = false,
}: FormCrmUserSingleSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  const { mutateAsync: getUserList } = useCrmUsers();

  const fetchFunction = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getUserList({
        origin: '',
        pageSize: params.pageSize,
        pageNum: params.pageNum,
        params: {
          threeCons: params.keyword,
        },
      });

      return {
        rows: res.rows || [],
        total: Number(res.total || 0),
      };
    },
    [getUserList],
  );

  const mapOption = useCallback(
    (item: CrmUser) => ({
      value: item.id,
      label: `${item.lastName ?? ''} ${item.name ?? ''} (${item.showId ?? '-'})`,
    }),
    [],
  );

  const params = useMemo(
    () => ({
      pageNum: 1,
      pageSize,
      keyword: '',
    }),
    [pageSize],
  );

  const buildSearchParams = useCallback(
    (
      baseParams: { pageNum: number; pageSize: number; keyword: string },
      keyword: string,
    ): { pageNum: number; pageSize: number; keyword: string } => ({
      ...baseParams,
      pageNum: 1,
      keyword,
    }),
    [],
  );

  const getNextParams = useCallback(
    (current: { pageNum: number; pageSize: number; keyword: string }) => ({
      ...current,
      pageNum: Number(current.pageNum ?? 1) + 1,
    }),
    [],
  );

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
          <div className="flex items-center gap-2">
            <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
              {label}
            </FormLabel>
          </div>

          <FormControl className={cn('grow-0', verticalLabel ? 'w-full' : 'basis-9/12')}>
            <RrhSearchSelect<{ pageNum: number; pageSize: number; keyword: string }, CrmUser>
              fetchFunction={fetchFunction}
              mapOption={mapOption}
              params={params}
              buildSearchParams={buildSearchParams}
              getNextParams={getNextParams}
              value={field.value ?? ''}
              placeholder={searchPlaceholder || placeholder}
              lazy
              onSelect={option => {
                field.onChange(option.value);
              }}
            />
          </FormControl>
          {showRowValue && (
            <div className="text-muted-foreground mt-1 text-xs">{field.value || ''}</div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
