import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhForm } from '@/components/form/RrhForm';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAdjustBalance, useDictType, useGetCrmDealAccountList } from '@/api/hooks/system/system';
import { FormSelect } from '@/components/form/FormSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RrhAlert } from '@/components/common/RrhAlert';
import { toast } from 'sonner';
import { useInitServerId } from '@/hooks/useInitServerId';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { RrhMultiSelect } from '@/components/common/RrhMultiSelect';
import { CrmDealAccountListItem } from '@/api/hooks/account/types';
import { CrmDealAccountListParams, DictTypeItem } from '@/api/hooks/system/types';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
const FormTradingAccountsSelector = ({
  serverId,
  origin,
}: {
  // 服务器ID，由父组件传入
  serverId: string;
  // 账户来源类型，由父组件传入
  origin: number;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getCrmDealAccountList } = useGetCrmDealAccountList(serverId);
  const fetchFunction = useCallback(
    (params: CrmDealAccountListParams) => getCrmDealAccountList(params),
    [getCrmDealAccountList],
  );
  const mapOption = useCallback(
    (item: CrmDealAccountListItem) => {
      return {
        value: item.account ?? '',
        label: `[${item.account}]${item.name} | ${t('table.balance')}:${item.balance} | ${t('table.netWorth')}:${item.netWorth} | ${item.currency}`,
      };
    },
    [t],
  );
  const buildSearchParams = useCallback(
    (baseParams: CrmDealAccountListParams, keyword: string): CrmDealAccountListParams => ({
      ...baseParams,
      pageNum: 1,
      page: 1,
      username: keyword,
    }),
    [],
  );

  const getNextParams = useCallback(
    (current: CrmDealAccountListParams): CrmDealAccountListParams => ({
      ...current,
      pageNum: Number(current.pageNum ?? 1) + 1,
      page: Number(current.page ?? 1) + 1,
    }),
    [],
  );

  const params = useMemo<CrmDealAccountListParams>(
    () => ({
      origin,
      username: '',
      pageNum: 1,
      pageSize: 15,
      page: 1,
    }),
    [origin],
  );

  // 多选搜索状态管理
  const [itemsData, setItemsData] = useState<CrmDealAccountListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentParams, setCurrentParams] = useState(params);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // 防抖处理搜索关键词
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(searchKeyword), 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // serverId变化时重置搜索关键词
  useEffect(() => {
    setSearchKeyword('');
    setDebouncedKeyword('');
  }, [serverId]);

  // serverId/关键词/参数变化时重新加载第一页
  useEffect(() => {
    if (!serverId) {
      setItemsData([]);
      setHasMore(false);
      return;
    }
    let ignore = false;
    const searchParams = buildSearchParams(params, debouncedKeyword);
    setLoading(true);
    setItemsData([]);
    setHasMore(true);
    setCurrentParams(searchParams);
    fetchFunction(searchParams).then(res => {
      if (ignore) return;
      const rows = res.rows ?? [];
      setItemsData(rows);
      setHasMore(rows.length < Number(res.total));
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [serverId, fetchFunction, params, buildSearchParams, debouncedKeyword]);

  const options = useMemo(
    () => itemsData.map(mapOption).filter(item => item.value !== ''),
    [itemsData, mapOption],
  );

  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    const nextParams = getNextParams(currentParams);
    setLoadingMore(true);
    const res = await fetchFunction(nextParams);
    const rows = res.rows ?? [];
    if (rows.length === 0) {
      setHasMore(false);
    } else {
      setItemsData(prev => {
        const merged = [...prev, ...rows];
        setHasMore(merged.length < Number(res.total));
        return merged;
      });
      setCurrentParams(nextParams);
    }
    setLoadingMore(false);
  }, [loading, loadingMore, hasMore, currentParams, getNextParams, fetchFunction]);

  return (
    <FormField
      name="logins"
      render={({ field }) => {
        // 从已选 JSON 字符串中解析 id，用于控制多选组件的选中状态
        const selectedIds = ((field.value as string[]) || []).map((v: string) => {
          try {
            return (JSON.parse(v) as { id: string }).id;
          } catch {
            return v;
          }
        });
        return (
          <FormItem>
            <div className="grid w-full gap-2">
              <FormLabel className="h-5 leading-5">{t('table.tradingAccount')}</FormLabel>
              <FormControl>
                <RrhMultiSelect
                  options={options}
                  value={selectedIds}
                  onValueChange={(_, option, operator) => {
                    if (!option || !operator) return;
                    if (operator === 'add') {
                      const selectedOption = options.find(o => o.value === option);
                      if (selectedOption) {
                        const data = {
                          id: selectedOption.value,
                          label: selectedOption.label,
                        };
                        field.onChange([...(field.value || []), JSON.stringify(data)]);
                      }
                    } else {
                      field.onChange(
                        ((field.value as string[]) || []).filter((v: string) => {
                          try {
                            return (JSON.parse(v) as { id: string }).id !== option;
                          } catch {
                            return true;
                          }
                        }),
                      );
                    }
                  }}
                  className="w-150"
                  searchSupport
                  searchValue={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  loadingMore={loadingMore || loading}
                  hasMore={hasMore}
                  onDropdownReachEnd={handleLoadMore}
                  placeholder={t('common.pleaseSelect', { field: t('table.tradingAccount') })}
                  disabled={!serverId}
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
type FormValues = {
  serverId: string;
  logins: string[];
  amount: string;
  remark?: string;
  opType?: string;
};

export const AccountAdjustmentPage = () => {
  const { t } = useTranslation();
  const [activeWay, setActiveWay] = useState('301');
  const schema = z.object({
    logins: z.array(z.string()).min(1, t('rules.required', { field: t('table.tradingAccount') })),
    serverId: z.string().min(1, t('rules.required', { field: t('table.server') })),
    amount: z.string().min(1, t('rules.required', { field: t('table.operationAmount') })),
    remark: z
      .string()
      .max(32, t('rules.limitLength', { field: 32 }))
      .optional(),
    opType: ['301', '302'].includes(activeWay)
      ? z.string().min(1, t('rules.required', { field: t('table.operationType') }))
      : z.string().optional(),
  });

  const { serverId, setServerId, server } = useInitServerId();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      logins: [],
      serverId: serverId,
      amount: '',
      remark: '',
      opType: '',
    },
  });
  const btnArr = [
    {
      label: t('table.Deposit'),
      value: '301',
    },
    {
      label: t('table.Withdrawal'),
      value: '302',
    },
    {
      label: t('table.creditAmountDeposit'),
      value: '401',
    },
    {
      label: t('table.creditAmountWithdrawal'),
      value: '402',
    },
  ];

  const [open, setOpen] = useState(false);
  const { data: adjustInType } = useDictType('crm_adjust_in_type', { enabled: true });
  const { data: adjustOutType } = useDictType('crm_adjust_out_type', { enabled: true });
  const { mutate: adjustBalance, isPending } = useAdjustBalance();
  const operationTypes = useMemo(() => {
    if (!adjustInType || !adjustOutType) return [];
    let adjustTypes: DictTypeItem[] = [];
    if (activeWay === '301') {
      adjustTypes = adjustInType;
    } else if (activeWay === '302') {
      adjustTypes = adjustOutType;
    }
    return adjustTypes
      .map(item => ({
        label: item.dictLabel,
        value: item.dictValue,
      }))
      .filter(item => item.value !== '6');
  }, [activeWay, adjustInType, adjustOutType]);
  const onSubmit = () => {
    setOpen(true);
  };
  // hook 异步加载完成后，将初始 serverId 同步到 form 字段
  useEffect(() => {
    if (serverId && !form.getValues('serverId')) {
      form.setValue('serverId', serverId, { shouldValidate: false });
    }
  }, [serverId, form]);

  // 用户手动切换服务器时，反向同步到 hook 状态
  const selectedServerId = form.watch('serverId');
  useEffect(() => {
    if (selectedServerId) {
      setServerId(selectedServerId);
    }
  }, [selectedServerId, setServerId]);
  const onConfirm = () => {
    const values = form.getValues();
    const logins = values.logins.map(item => JSON.parse(item).id);
    adjustBalance(
      {
        logins: logins,
        serverId: values.serverId,
        amount: values.amount,
        remark: values.remark || '',
        opType: values.opType,
        operationType: activeWay,
      },
      {
        onSuccess: result => {
          if (result?.code === 0) {
            form.reset();
            setOpen(false);
            const data = result.data;
            if (data.failedMsg) {
              toast.error(
                `${t('accountAdjustment.operateAccountNumber')}: ${data.total}, ${t('common.success')}: ${data.successNum}, ${t('common.failed')}: ${data.failedNum} ${data.failedMsg}`,
              );
            } else {
              toast.success(
                `${t('accountAdjustment.operateAccountNumber')}: ${data.total}, ${t('common.success')}: ${data.successNum}, ${t('common.failed')}: ${data.failedNum}`,
              );
            }
          } else {
            toast.error(
              result?.msg || t('common.modifyFieldFailed', { field: t('table.balance') }),
            );
          }
        },
        onError: error => {
          toast.error(
            error?.message || t('common.modifyFieldFailed', { field: t('table.balance') }),
          );
        },
      },
    );
  };
  return (
    <div className="relative">
      <PageInfo title={t('accountAdjustment.title')} desc={t('walletAdjustment.desc')} />
      <RrhCard className="mt-4 flex justify-between gap-50">
        <RrhForm
          form={form}
          className="flex flex-1 flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <RrhServerSelector serverOptions={server?.rows || []} />
          <FormTradingAccountsSelector serverId={serverId} origin={0} />
          <FormItem>
            <FormLabel>{t('table.inMethod')}</FormLabel>
            <div className="flex gap-4">
              {btnArr.map(item => (
                <RrhButton
                  key={item.value}
                  variant={activeWay === item.value ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveWay(item.value);
                    form.setValue('opType', '');
                    form.clearErrors('opType');
                  }}
                >
                  {item.label}
                </RrhButton>
              ))}
            </div>
          </FormItem>
          {['301', '302'].includes(activeWay) && (
            <FormSelect
              name="opType"
              showRowValue={false}
              label={t('table.operationType')}
              options={operationTypes}
            />
          )}
          <FormInput
            name="amount"
            label={t('table.operationAmount')}
            placeholder={t('common.pleaseInput', { field: t('table.operationAmount') })}
          />
          <FormTextarea
            name="remark"
            label={`${t('table.remarks')} (${t('common.optional')})`}
            placeholder={t('rules.limitLength', { field: 32 })}
            maxLength={32}
          />
          <div>
            <RrhButton type="submit">{t('common.submit')}</RrhButton>
          </div>
        </RrhForm>
        <div className="flex flex-1 flex-col items-start gap-2 pt-6"></div>
      </RrhCard>
      <RrhAlert
        open={open}
        onOpenChange={setOpen}
        trigger={null}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={t('common.confirmToProceed')}
        onConfirm={onConfirm}
        confirmLoading={isPending}
      />
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <RrhCircleLoading />
        </div>
      )}
    </div>
  );
};
