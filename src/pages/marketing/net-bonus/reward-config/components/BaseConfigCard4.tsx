import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { RrhSearchSelect } from '@/components/common/RrhSearchSelect';
import { CrmUserItem, CrmUserParams, useMutationCrmUser } from '@/api/hooks/account';
import { useCallback, useMemo, useRef } from 'react';
import { FieldPath, useFieldArray } from 'react-hook-form';

type FixedParamFormItem = {
  userId: string;
  userLabel?: string;
  rewardParam: string;
  type: string;
};

type BaseConfigCard4FormValues = {
  fixedParams: FixedParamFormItem[];
};

const createEmptyFixedParam = (): FixedParamFormItem => ({
  userId: '',
  userLabel: '',
  rewardParam: '',
  type: '1',
});

export function BaseConfigCard4({ editable }: { editable: boolean }) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<BaseConfigCard4FormValues>();
  const { mutateAsync: getUserList } = useMutationCrmUser();
  const userQueryCacheRef = useRef<
    Map<string, { expiredAt: number; data: CrmUserItem[]; total: string | number }>
  >(new Map());
  const inFlightRef = useRef<Map<string, Promise<{ rows: CrmUserItem[]; total: string | number }>>>(
    new Map(),
  );
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fixedParams',
  });

  const fetchFunction = useCallback(
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
    <RrhCard>
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('netBonusRewardConfig.setRewardLevelParams')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('netBonusRewardConfig.setRewardLevelParamsDesc')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              disabled={!editable}
              onClick={() => append(createEmptyFixedParam())}
            >
              +
            </RrhButton>
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              disabled={!editable || fields.length <= 1}
              onClick={() => {
                if (fields.length > 1) {
                  remove(fields.length - 1);
                }
              }}
            >
              -
            </RrhButton>
          </div>
        </div>
        <div className="grid gap-3">
          {fields.map((item, index) => {
            const userIdName =
              `fixedParams.${index}.userId` as FieldPath<BaseConfigCard4FormValues>;
            const userLabelName =
              `fixedParams.${index}.userLabel` as FieldPath<BaseConfigCard4FormValues>;
            const rewardParamName =
              `fixedParams.${index}.rewardParam` as FieldPath<BaseConfigCard4FormValues>;
            const typeName = `fixedParams.${index}.type` as FieldPath<BaseConfigCard4FormValues>;

            return (
              <div
                key={item.id}
                className="bg-primary-foreground grid grid-cols-1 gap-3 rounded-2xl p-3 md:grid-cols-2"
              >
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormField
                      name={userIdName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="h-5 leading-5">{t('home.CRMUserCount')}</FormLabel>
                          <FormControl>
                            <div
                              className={cn(
                                'w-full',
                                !editable && 'pointer-events-none opacity-60',
                              )}
                            >
                              <RrhSearchSelect<CrmUserParams, CrmUserItem>
                                fetchFunction={fetchFunction}
                                mapOption={mapOption}
                                params={userSearchParams}
                                buildSearchParams={buildSearchParams}
                                getNextParams={getNextParams}
                                lazy
                                value={field.value ?? ''}
                                displayLabel={
                                  (form.watch(userLabelName) as string | undefined) || undefined
                                }
                                onSelect={option => {
                                  field.onChange(option.value);
                                  form.setValue(userLabelName, option.label);
                                  form.setValue(typeName, '1');
                                }}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormInputWithUnit<BaseConfigCard4FormValues>
                      name={rewardParamName}
                      unit="%"
                      label={t('table.rewardParams')}
                      verticalLabel
                      disabled={!editable}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RrhCard>
  );
}
