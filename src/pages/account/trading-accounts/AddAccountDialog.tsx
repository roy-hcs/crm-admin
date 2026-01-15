import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { SelectUser } from './SelectUser';
import { SelectType } from './selectType';
import { serverMap } from '@/lib/constant';
import {
  useGetLever,
  useGetServer,
  useGetGroup,
  useGetAccountInfo,
  useAddAccount,
} from '@/api/hooks/system/system';
import { MtServerItem } from '@/api/hooks/system';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type FormValues = {
  userId: string;
  serviceProperty: string;
  serviceType: string;
  server: string;
  serverGroup: string;
  account?: string;
  lever: string;
  accountGroupId?: string;
  directBroker?: string;
};

const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    userId: z.string().min(1, t('rules.required', { field: t('table.threeCons') })),
    serviceProperty: z.string().min(1, t('rules.required', { field: t('common.type') })),
    serviceType: z
      .string()
      .min(1, t('rules.required', { field: t('financial.tradingAccountTransactions.serverType') })),
    server: z.string().min(1, t('rules.required', { field: t('table.server') })),
    serverGroup: z.string().min(1, t('rules.required', { field: t('table.groups') })),
    account: z.string().optional(),
    lever: z.string().min(1, t('rules.required', { field: t('common.level') })),
    accountGroupId: z.string().optional(),
    directBroker: z.string().optional(),
  };
};

export const AddAccountDialog = ({
  onSuccess,
  dealAccountGroup,
}: {
  onSuccess?: () => void;
  dealAccountGroup: Array<{ label: string; value: string }>;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverList, setServerList] = useState<Array<{ label: string; value: string }>>([]); // 服务器列表
  const [leverList, setLeverList] = useState<Array<{ label: string; value: string }>>([]); // 杠杆列表
  const [groupList, setGroupList] = useState<Array<{ label: string; value: string }>>([]); // 组别列表
  const [groupLoading, setGroupLoading] = useState(false); // 组别加载状态
  const [accountInfo, setAccountInfo] = useState<{
    accountStart: number;
    accountEnd: number;
    maxAccount: number;
  }>(); // 账号信息

  const schema = useMemo(() => z.object(addUserSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: '',
      serviceProperty: '1',
      serviceType: '1',
      server: '',
      serverGroup: '',
      account: '',
      lever: '',
      accountGroupId: '',
      directBroker: '',
    },
  });
  const { mutateAsync: getServerData } = useGetServer();
  const { mutateAsync: getLeverData } = useGetLever();
  const { mutateAsync: getGroupData } = useGetGroup();
  const { mutateAsync: getAccountInfoData } = useGetAccountInfo();
  const { mutateAsync: addAccountData } = useAddAccount();

  const serviceType = form.watch('serviceType');
  const serverId = form.watch('server');
  const serverGroup = form.watch('serverGroup');

  useEffect(() => {
    form.setValue('server', '');
    form.setValue('serverGroup', '');
    form.setValue('account', '');
    form.setValue('lever', '');
    // 获取服务器列表杠杆列表
    let mounted = true;
    const fetchServers = async (type?: string) => {
      if (!type) {
        if (mounted) setServerList([]);
        return;
      }
      try {
        const [server, lever] = await Promise.all([getServerData(type), getLeverData(type)]);
        if (!mounted) return;
        if (server?.length > 0) {
          const list = server
            .filter(i => String(i.status) === '1') //status 1表示启用
            .map((item: MtServerItem) => ({
              label: item?.serverName || '',
              value: item?.id || '',
            }));
          setServerList(list);
        } else {
          setServerList([]);
        }

        if (lever?.length > 0) {
          const leverOptions = lever.map((item: string) => ({
            label: item,
            value: item,
          }));
          setLeverList(leverOptions);
        } else {
          setLeverList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setServerList([]);
          setLeverList([]);
        }
      }
    };

    fetchServers(serviceType);
    return () => {
      mounted = false;
    };
  }, [serviceType, getServerData, getLeverData, form]);

  useEffect(() => {
    form.setValue('serverGroup', '');
    form.setValue('account', '');
    let mounted = true;
    const fetch = async (serverId?: string) => {
      if (!serverId) {
        if (mounted) setGroupList([]);
        return;
      }
      if (mounted) setGroupLoading(true);
      try {
        const gruop = await getGroupData(serverId);
        if (!mounted) return;
        if (gruop?.length > 0) {
          const leverOptions = gruop.map((item: string) => ({
            label: item,
            value: item,
          }));
          setGroupList(leverOptions);
        } else {
          setGroupList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setGroupList([]);
      } finally {
        if (mounted) setGroupLoading(false);
      }
    };

    fetch(serverId);
    return () => {
      // 防止关闭弹窗后 请求设置状态 以及重置状态
      setGroupLoading(false);
      mounted = false;
    };
  }, [serverId, form, getGroupData]);

  useEffect(() => {
    form.setValue('account', '');
    let mounted = true;
    const fetch = async (serverGroup?: string, serverId?: string) => {
      if (!serverGroup || !serverId) {
        return;
      }
      try {
        const res = await getAccountInfoData({
          serverId: serverId,
          groupName: serverGroup,
        });
        if (!mounted) return;
        if (res.code === 0) {
          setAccountInfo({
            accountStart: res?.data?.accountStart || 0,
            accountEnd: res?.data?.accountEnd || 0,
            maxAccount: Number(res?.data?.maxAccount) || 999999,
          });
        } else {
          setAccountInfo(undefined);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setAccountInfo(undefined);
      }
    };

    fetch(serverGroup, serverId);
    return () => {
      mounted = false;
    };
  }, [serverGroup, form, getAccountInfoData, serverId]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        ...data,
        account: data.account || '',
        accountGroupId: data.accountGroupId || '',
        directBroker: data.directBroker || '',
      };
      const res = await addAccountData(param);
      if (res.code === 0) {
        form.reset();
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const serverTypeList = useMemo(() => {
    return Object.keys(serverMap).map(key => ({ label: serverMap[Number(key)], value: key }));
  }, []);

  return (
    <RrhDialog
      trigger={
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-1 border px-4 text-sm text-[#1E1E1E]"
        >
          <Plus className="size-3.5" />
          <span>{t('financial.tradingAccountTransactions.addLogin')}</span>
        </Button>
      }
      title={t('financial.tradingAccountTransactions.addLogin')}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="large"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
          >
            <FormField
              name="userId"
              render={({ field }) => {
                return <SelectUser verticalLabel field={field} title={t('table.threeCons')} />;
              }}
            />

            <FormField
              name="serviceProperty"
              render={({ field }) => {
                return <SelectType verticalLabel field={field} />;
              }}
            />

            <FormSelect
              name="serviceType"
              label={t('financial.tradingAccountTransactions.serverType')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={serverTypeList}
            />

            <FormSelect
              name="server"
              label={t('table.server')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={serverList}
            />

            <FormSelect
              name="serverGroup"
              label={t('table.groups')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={groupList}
              loading={groupLoading}
            />

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <div className={cn('text-foreground text-sm')}>
                    <FormLabel className={'mb-2'}>{t('table.account')}</FormLabel>
                    <FormControl className="shrink-0 basis-9/12">
                      <div>
                        <Input
                          type="text"
                          className={cn('h-9 w-full border px-2')}
                          placeholder={
                            (accountInfo?.accountStart || 0) > 0
                              ? t('financial.tradingAccountTransactions.accountPlaceholder', {
                                  accountStart: accountInfo?.accountStart,
                                  accountEnd: accountInfo?.accountEnd,
                                })
                              : t('common.pleaseInput', { field: t('table.account') })
                          }
                          value={field.value}
                          onChange={e => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {accountInfo?.maxAccount && (
                          <div className="text-muted-foreground mt-2 text-sm leading-5">
                            {t('financial.tradingAccountTransactions.maxAccount', {
                              maxAccount: accountInfo?.maxAccount,
                            })}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            <FormSelect
              name="lever"
              label={t('common.level')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={leverList}
            />

            <FormSelect
              name="accountGroupId"
              label={t('table.accountGroup')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={dealAccountGroup}
            />

            <FormField
              name="directBroker"
              render={({ field }) => {
                return <SelectUser verticalLabel field={field} title={t('table.directAgent')} />;
              }}
            />

            <div className="border-muted col-span-full -mx-6 flex justify-end border-t px-6 pt-6 pb-6 sm:pb-0">
              <div className="flex justify-end gap-4">
                <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="submit" className="px-4 py-2" disabled={isSubmitting}>
                  {t('common.Confirm')}
                </RrhButton>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
