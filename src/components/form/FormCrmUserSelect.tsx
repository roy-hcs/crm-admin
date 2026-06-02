import { CrmUserItem, CrmUserParams, useMutationCrmUser } from '@/api/hooks/account';
import { RrhSearchSelect } from '@/components/common/RrhSearchSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useRef } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type SearchOption = { value: string; label: string };

interface FormCrmUserSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  verticalLabel?: boolean;
  className?: string;
  disabled?: boolean;
  labelName?: FieldPath<T>;
  labeTipsDom?: React.ReactNode;
  onSelect?: (option: SearchOption) => void;
}

export function FormCrmUserSelect<T extends FieldValues>({
  name,
  label,
  verticalLabel = false,
  className,
  disabled = false,
  labelName,
  labeTipsDom,
  onSelect,
}: FormCrmUserSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  const { mutateAsync: getUserList } = useMutationCrmUser();

  const userQueryCacheRef = useRef<
    Map<string, { expiredAt: number; data: CrmUserItem[]; total: string | number }>
  >(new Map());
  const inFlightRef = useRef<Map<string, Promise<{ rows: CrmUserItem[]; total: string | number }>>>(
    new Map(),
  );

  const fetchUser = useCallback(
    async (params: CrmUserParams) => {
      const cacheKey = JSON.stringify(params);
      const now = Date.now();
      const cached = userQueryCacheRef.current.get(cacheKey);

      if (cached && cached.expiredAt > now) {
        return {
          rows: cached.data,
          total: cached.total,
        };
      }

      const inFlight = inFlightRef.current.get(cacheKey);
      if (inFlight) {
        return inFlight;
      }

      const request = getUserList(params)
        .then(res => {
          const rows = res.rows ?? [];
          const total = res.total ?? 0;
          userQueryCacheRef.current.set(cacheKey, {
            expiredAt: now + 30_000,
            data: rows,
            total,
          });
          return { rows, total };
        })
        .finally(() => {
          inFlightRef.current.delete(cacheKey);
        });

      inFlightRef.current.set(cacheKey, request);
      return request;
    },
    [getUserList],
  );

  const mapOption = useCallback(
    (item: CrmUserItem) => ({
      value: item.id,
      label: `${item.lastName ?? ''} ${item.name ?? ''} (${item.showId ?? '-'})`,
    }),
    [],
  );

  const buildSearchParams = useCallback(
    (baseParams: CrmUserParams, keyword: string): CrmUserParams => ({
      ...baseParams,
      pageNum: 1,
      params: {
        ...baseParams.params,
        fiveCons: keyword,
      },
    }),
    [],
  );

  const getNextParams = useCallback(
    (current: CrmUserParams): CrmUserParams => ({
      ...current,
      pageNum: Number(current.pageNum ?? 1) + 1,
    }),
    [],
  );

  const userSearchParams = useMemo<CrmUserParams>(
    () => ({
      pageSize: 15,
      pageNum: 1,
      orderByColumn: '',
      params: {
        threeCons: '',
        fiveCons: '',
        regEndTime: '',
        regStartTime: '',
        fuzzyMobile: '',
        fuzzyEmail: '',
        inviter: '',
        accounts: '',
      },
      isAsc: 'asc',
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
      tags: '',
    }),
    [],
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'text-foreground text-sm',
            verticalLabel ? '' : 'flex items-center',
            className,
          )}
        >
          {label && (
            <div className="flex items-center gap-2">
              <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12')}>{label}</FormLabel>
              {labeTipsDom && <div>{labeTipsDom}</div>}
            </div>
          )}

          <FormControl
            className={cn('shrink-0', verticalLabel || !label ? 'basis-full' : 'basis-9/12')}
          >
            <div className="w-full">
              <RrhSearchSelect<CrmUserParams, CrmUserItem>
                fetchFunction={fetchUser}
                mapOption={mapOption}
                params={userSearchParams}
                buildSearchParams={buildSearchParams}
                getNextParams={getNextParams}
                lazy
                disabled={disabled}
                value={field.value ?? ''}
                displayLabel={
                  labelName ? (form.watch(labelName) as string | undefined) || undefined : undefined
                }
                onSelect={option => {
                  field.onChange(option.value);
                  if (labelName) {
                    form.setValue(labelName, option.label as T[FieldPath<T>]);
                  }
                  onSelect?.(option);
                }}
              />
            </div>
          </FormControl>

          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
