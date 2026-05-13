import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhSearchSelect } from './RrhSearchSelect';
import { CrmUserParams, CrmUserItem, useMutationCrmUser } from '@/api/hooks/account';
import { useCallback, useMemo } from 'react';

export const SelectUpperDropdown = ({
  name = 'accounts',
  rawLabel,
  labelShow = true,
  className = '',
}: {
  name?: 'inviter' | 'accounts' | 'agentUserId';
  rawLabel?: string;
  labelShow?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  const label = rawLabel ?? t('CRMAccountPage.AccountRange');
  const { mutateAsync: getUserList } = useMutationCrmUser();
  const fetchFunction = useCallback((params: CrmUserParams) => getUserList(params), [getUserList]);

  const mapOption = useCallback(
    (item: CrmUserItem) => {
      return {
        value: `${item.id}`,
        label: `${item.lastName ?? ''} ${item.name ?? ''}${name === 'inviter' ? ` (${item.showId})` : `-${t('common.subordinate')}`}`,
      };
    },
    [name, t],
  );

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
          name === 'accounts' ? (parsedAccountsValue?.id ?? '') : (field.value ?? '');
        const displayLabel =
          name === 'accounts' ? (parsedAccountsValue?.label ?? undefined) : undefined;

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
