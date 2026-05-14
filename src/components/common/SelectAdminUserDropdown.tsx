import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhSearchSelect } from './RrhSearchSelect';
import { useCallback, useMemo } from 'react';
import { useMutationUserList } from '@/api/hooks/system/system';
import { UserItem, UserListParams } from '@/api/hooks/system';

export const SelectAdminUserDropdown = ({
  name,
  label,
  customMapOptions,
}: {
  name: string;
  label: string;
  customMapOptions?: (item: UserItem) => { value: string; label: string };
}) => {
  const { mutateAsync: getAdminUserList } = useMutationUserList();
  const fetchFunction = useCallback(
    (params: UserListParams) => getAdminUserList(params),
    [getAdminUserList],
  );

  const mapOption = useCallback(
    (item: UserItem) => {
      return customMapOptions
        ? customMapOptions(item)
        : {
            value: item.userId,
            label: `${item.userLastName || ''} ${item.userName || ''} (${item.email})`,
          };
    },
    [customMapOptions],
  );

  const buildInviterSearchParams = useCallback(
    (baseParams: UserListParams): UserListParams => ({
      ...baseParams,
      pageNum: 1,
      params: {
        ...baseParams.params,
      },
    }),
    [],
  );

  const getInviterNextParams = useCallback(
    (current: UserListParams): UserListParams => ({
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
        beginTime: '',
        endTime: '',
      },
      isAsc: 'asc',
      userName: '',
      roleId: '',
      status: '',
      phonenumber: '',
      email: '',
      onlineStatus: '',
    }),
    [],
  );
  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="grid gap-2">
              <FormLabel className="h-5 leading-5">{label}</FormLabel>
              <div>
                <FormControl>
                  <RrhSearchSelect<UserListParams, UserItem>
                    fetchFunction={fetchFunction}
                    mapOption={mapOption}
                    params={params}
                    buildSearchParams={buildInviterSearchParams}
                    getNextParams={getInviterNextParams}
                    value={field.value}
                    onSelect={(option: { value: string; label: string }) => {
                      if (name === 'inviter') {
                        field.onChange(option.value);
                      } else {
                        const data = {
                          id: option.value,
                          label: option.label,
                        };
                        field.onChange(JSON.stringify(data));
                      }
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
