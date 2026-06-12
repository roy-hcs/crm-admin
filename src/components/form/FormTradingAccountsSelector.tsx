import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhSearchSelect } from '@/components/common/RrhSearchSelect';
import { useCallback, useMemo } from 'react';
import { apiFormPostCustom } from '@/api/client';
import { CrmDealAccountListItem, CrmDealAccountListRes } from '@/api/hooks/account/types';

// 交易账户列表请求参数
type TradingAccountParams = {
  origin: number;
  username: string;
  pageNum: number;
  pageSize: number;
  page: number;
};

export const FormTradingAccountsSelector = ({
  name,
  label,
  serverId,
  origin,
  customMapOptions,
}: {
  name: string;
  label: string;
  // 服务器ID，由父组件传入
  serverId: string;
  // 账户来源类型，由父组件传入
  origin: number;
  customMapOptions?: (item: CrmDealAccountListItem) => { value: string; label: string };
}) => {
  // 直接调用接口，以便支持 RrhSearchSelect 的动态查询
  const fetchFunction = useCallback(
    (params: TradingAccountParams) =>
      apiFormPostCustom<CrmDealAccountListRes>(
        `/system/crmDealAccount/accountList?serverId=${serverId}`,
        params,
      ),
    [serverId],
  );

  const mapOption = useCallback(
    (item: CrmDealAccountListItem) => {
      return customMapOptions
        ? customMapOptions(item)
        : {
            value: item.id ?? '',
            label: `${item.account ?? ''} (${item.username ?? ''})`,
          };
    },
    [customMapOptions],
  );

  // 搜索时将输入内容作为 username 参数，并重置分页
  const buildSearchParams = useCallback(
    (baseParams: TradingAccountParams, keyword: string): TradingAccountParams => ({
      ...baseParams,
      pageNum: 1,
      page: 1,
      username: keyword,
    }),
    [],
  );

  const getNextParams = useCallback(
    (current: TradingAccountParams): TradingAccountParams => ({
      ...current,
      pageNum: Number(current.pageNum ?? 1) + 1,
      page: Number(current.page ?? 1) + 1,
    }),
    [],
  );

  const params = useMemo<TradingAccountParams>(
    () => ({
      origin,
      username: '',
      pageNum: 1,
      pageSize: 15,
      page: 1,
    }),
    [origin],
  );

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2">
            <FormLabel className="h-5 leading-5">{label}</FormLabel>
            <div>
              <FormControl>
                <RrhSearchSelect<TradingAccountParams, CrmDealAccountListItem>
                  fetchFunction={fetchFunction}
                  mapOption={mapOption}
                  params={params}
                  buildSearchParams={buildSearchParams}
                  getNextParams={getNextParams}
                  lazy
                  value={field.value}
                  onSelect={option => {
                    field.onChange(option.value);
                  }}
                />
              </FormControl>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
