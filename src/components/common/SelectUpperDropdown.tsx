import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhSearchSelect } from './RrhSearchSelect';
import { CrmUserParams, CrmUserItem, useMutationCrmUser } from '@/api/hooks/account';
import { useCrmFormContext } from '@/contexts/form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

export const SelectUpperDropdown = ({
  name = 'accounts',
  rawLabel,
  customMapOptions,
  labelShow = true,
  className = '',
}: {
  name?: 'inviter' | 'accounts' | 'agentUserId' | string;
  rawLabel?: string;
  customMapOptions?: (item: CrmUserItem) => { value: string; label: string };
  labelShow?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  const label = rawLabel ?? t('CRMAccountPage.AccountRange');
  const { mutateAsync: getUserList } = useMutationCrmUser();
  const { form } = useCrmFormContext<Record<string, string>>();
  const watchedValue = useWatch({
    control: form.control,
    name,
  });
  const [fallbackDisplayLabel, setFallbackDisplayLabel] = useState('');
  const resolvingIdRef = useRef('');

  const parseAccountValue = useCallback((value: unknown): { id: string; label: string } | null => {
    if (typeof value !== 'string' || !value) return null;
    try {
      const parsed = JSON.parse(value) as { id?: string; label?: string };
      if (typeof parsed?.id === 'string' && parsed.id) {
        return {
          id: parsed.id,
          label: typeof parsed.label === 'string' ? parsed.label : '',
        };
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const accountIdForBackfill = useMemo(() => {
    if (name !== 'accounts') return '';
    const parsed = parseAccountValue(watchedValue);
    if (parsed?.id) return parsed.id;
    return typeof watchedValue === 'string' ? watchedValue : '';
  }, [name, parseAccountValue, watchedValue]);

  const accountLabelForBackfill = useMemo(() => {
    if (name !== 'accounts') return '';
    return parseAccountValue(watchedValue)?.label ?? '';
  }, [name, parseAccountValue, watchedValue]);

  const mapOption = useCallback(
    (item: CrmUserItem) => {
      return customMapOptions
        ? customMapOptions(item)
        : {
            value: item.id,
            label: `${item.lastName ?? ''} ${item.name ?? ''}${name === 'inviter' ? ` (${item.showId})` : `-${t('common.subordinate')}`}`,
          };
    },
    [name, t, customMapOptions],
  );

  useEffect(() => {
    if (name !== 'accounts') return;

    if (!accountIdForBackfill) {
      setFallbackDisplayLabel('');
      return;
    }

    if (accountLabelForBackfill) {
      setFallbackDisplayLabel(accountLabelForBackfill);
      return;
    }

    if (resolvingIdRef.current === accountIdForBackfill) return;

    let mounted = true;
    resolvingIdRef.current = accountIdForBackfill;

    const resolveAccountLabel = async () => {
      try {
        const res = await getUserList({
          pageSize: 1,
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
            accounts: accountIdForBackfill,
          },
          isAsc: 'asc',
          status: '',
          role: '',
          certiricateNo: '',
          accountType: '',
          tags: '',
          accounts: accountIdForBackfill,
        });

        if (!mounted) return;

        const first = res?.rows?.[0];
        if (!first) {
          setFallbackDisplayLabel('');
          return;
        }

        const option = mapOption(first);
        setFallbackDisplayLabel(option.label);

        const currentValue = form.getValues(name);
        if (typeof currentValue === 'string' && currentValue === accountIdForBackfill) {
          form.setValue(name, JSON.stringify({ id: accountIdForBackfill, label: option.label }), {
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      } catch {
        if (mounted) {
          setFallbackDisplayLabel('');
        }
      } finally {
        if (resolvingIdRef.current === accountIdForBackfill) {
          resolvingIdRef.current = '';
        }
      }
    };

    void resolveAccountLabel();

    return () => {
      mounted = false;
    };
  }, [accountIdForBackfill, accountLabelForBackfill, form, getUserList, mapOption, name]);

  const fetchFunction = useCallback((params: CrmUserParams) => getUserList(params), [getUserList]);

  const buildInviterSearchParams = useCallback(
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

  const getInviterNextParams = useCallback(
    (current: CrmUserParams): CrmUserParams => ({
      ...current,
      pageNum: Number(current.pageNum ?? 1) + 1,
    }),
    [],
  );

  const params = useMemo(
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
      name={name}
      render={({ field }) => {
        const parsedAccountsValue =
          name === 'accounts' && typeof field.value === 'string' && field.value
            ? (() => {
                try {
                  return JSON.parse(field.value) as { id?: string; label?: string };
                } catch {
                  return null;
                }
              })()
            : null;

        const selectValue =
          name === 'accounts'
            ? (parsedAccountsValue?.id ?? (typeof field.value === 'string' ? field.value : ''))
            : (field.value ?? '');
        const displayLabel =
          name === 'accounts'
            ? (parsedAccountsValue?.label ?? fallbackDisplayLabel) || undefined
            : undefined;

        return (
          <FormItem className={className}>
            <div className="grid gap-2">
              {labelShow && <FormLabel className="h-5 leading-5">{label}</FormLabel>}
              <FormControl>
                <RrhSearchSelect<CrmUserParams, CrmUserItem>
                  fetchFunction={fetchFunction}
                  mapOption={mapOption}
                  params={params}
                  buildSearchParams={buildInviterSearchParams}
                  getNextParams={getInviterNextParams}
                  value={selectValue}
                  displayLabel={displayLabel}
                  onSelect={(option: { value: string; label: string }) => {
                    switch (name) {
                      case 'inviter':
                        field.onChange(option.value);
                        break;
                      case 'accounts':
                        setFallbackDisplayLabel(option.label);
                        field.onChange(JSON.stringify({ id: option.value, label: option.label }));
                        break;
                      case 'agentUserId':
                        field.onChange(option.value);
                        break;
                      default:
                        field.onChange(option.value);
                    }
                  }}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
