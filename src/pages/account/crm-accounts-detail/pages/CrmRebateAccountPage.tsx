import { useMtServerGroupInfo, useSetRebateAccount } from '@/api/hooks/agent/agent';
import {
  useAddAccount,
  useGetServer,
  useGetUserRebateAccountTab,
  useGroupList,
} from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { FormInput } from '@/components/form/FormInput';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';
type FormOneValue = {
  accounts: string[];
};
type FormTwoValue = {
  serviceType: string;
  server: string;
  serverGroup: string;
  account?: number;
  lever: string;
  accountGroupId?: string;
  directBroker?: string;
};
export const CrmRebateAccountPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { data, refetch } = useGetUserRebateAccountTab(userId);
  const { mutate: setRebateAccount, error } = useSetRebateAccount();
  const { mutate: getTraderServer, isPending: isGettingTraderServer } = useGetServer();
  const rebateAccountsInfo = data?.data;
  const [type, setType] = useState('one');
  const form = useForm<FormOneValue>();
  useEffect(() => {
    const selectedAccountIds =
      rebateAccountsInfo?.accountList
        ?.filter(item => rebateAccountsInfo.accountIds.includes(item.name))
        .map(item => item.id) || [];
    form.setValue('accounts', selectedAccountIds);
  }, [rebateAccountsInfo, form]);
  const accountOptions = useMemo(() => {
    return (
      rebateAccountsInfo?.accountList.map(item => ({ label: item.name, value: item.id })) || []
    );
  }, [rebateAccountsInfo?.accountList]);
  const onSubmitFormOne = (data: FormOneValue) => {
    const accounts =
      rebateAccountsInfo?.accountList
        .filter(item => data.accounts.includes(item.id))
        .map(item => ({
          type: item.type,
          value: item.id,
        })) || [];
    console.log('accounts', accounts);
    setRebateAccount(
      {
        userId,
        accounts,
      },
      {
        onSuccess: () => {
          toast.success(t('common.success'));
          refetch();
        },
        onError: () => {
          toast.error(error?.message || t('common.modifyFailed'));
        },
      },
    );
  };
  const schemaTwo = z.object({
    serviceType: z.string(),
    server: z.string().min(1, t('rules.required', { field: t('table.server') })),
    serverGroup: z.string().min(1, t('rules.required', { field: t('table.groups') })),
    account: z.number().optional(),
    lever: z.string().min(1, t('rules.required', { field: t('common.level') })),
    accountGroupId: z.string().optional(),
    directBroker: z.string().optional(),
  });
  const { mutateAsync: addAccount } = useAddAccount();
  const formTwo = useForm<FormTwoValue>({
    resolver: zodResolver(schemaTwo),
    defaultValues: {
      serviceType: '1',
      server: '',
      serverGroup: '',
      lever: '',
    },
  });
  const serverTypeOptions = [
    { label: 'MT5', value: '1' },
    { label: 'MT4', value: '2' },
    { label: 'Sirix', value: '3' },
    { label: 'XForce', value: '4' },
  ];
  const [serverOptions, setServerOptions] = useState<{ label: string; value: string }[]>([]);
  const selectedServer = formTwo.watch('server');
  const selectedGroup = formTwo.watch('serverGroup');
  const serverType = formTwo.watch('serviceType');
  const serverGroupParams = useMemo(() => {
    return {
      serverId: selectedServer,
      groupName: selectedGroup,
    };
  }, [selectedServer, selectedGroup]);
  const { data: groupList, isLoading: groupLoading } = useGroupList(selectedServer, {
    enabled: !!selectedServer,
  });
  const { data: mtServerGroupRes, isLoading: mtServerGroupLoading } =
    useMtServerGroupInfo(serverGroupParams);

  const optionsLoading = useMemo(() => {
    return type === 'two' && (isGettingTraderServer || groupLoading || mtServerGroupLoading);
  }, [type, isGettingTraderServer, groupLoading, mtServerGroupLoading]);
  const groupOptions = useMemo(
    () => groupList?.map(item => ({ label: item, value: item })) || [],
    [groupList],
  );
  const maxAccountAmountsTips = useMemo(() => {
    return mtServerGroupRes
      ? t('tradingAccountTransactions.maxAccount', {
          maxAccount: mtServerGroupRes.data.maxAccount || '0',
        })
      : '';
  }, [mtServerGroupRes, t]);
  const leverOptions = useMemo(
    () => rebateAccountsInfo?.allLever.map(lever => ({ label: `1:${lever}`, value: lever })) || [],
    [rebateAccountsInfo?.allLever],
  );
  const changeToTypeOne = () => {
    setType('one');
    formTwo.reset();
  };
  useEffect(() => {
    if (type === 'two') {
      getTraderServer(serverType, {
        onSuccess: data => {
          setServerOptions(
            data
              .filter(item => item.status === 1 && item.serverName && item.id)
              .map(item => ({ label: item.serverName || '', value: item.id || '' })),
          );
        },
      });
    }
  }, [getTraderServer, type, formTwo, serverType]);

  const onSubmitFormTwo = async (data: FormTwoValue) => {
    const selectedDirectBroker = JSON.parse(data.directBroker || '{"id": "", "label": ""}');
    try {
      const res = await await addAccount({
        userId,
        serviceProperty: '1',
        serviceType: data.serviceType,
        server: data.server,
        serverGroup: data.serverGroup,
        account: data.account?.toString() || '',
        lever: data.lever,
        accountGroupId: data.accountGroupId || '',
        directBroker: selectedDirectBroker.id,
        buildRebateAccount: true,
      });
      if (res.code !== 0) {
        toast.error(res.msg || t('common.failed'));
      }
      if (res.code === 0) {
        toast.success(t('common.success'));
        refetch();
        setType('one');
      }
    } catch (error) {
      console.error(error);
      toast.error(t('common.modifyFailed'));
    }
  };

  return (
    <RrhCard>
      <RrhForm
        form={form}
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmitFormOne)}
      >
        <div>
          <div className="flex cursor-pointer items-center gap-2" onClick={() => changeToTypeOne()}>
            <input type="radio" checked={type === 'one'} onChange={() => changeToTypeOne()} />
            <span>{t('CRMAccountPage.rebateToExistAccount')}</span>
          </div>
          {type === 'one' && (
            <>
              <FormMultiSelect
                name="accounts"
                verticalLabel
                options={accountOptions}
                label={''}
                placeholder={t('common.pleaseSelect')}
              />
              <div className="mt-4 flex justify-end">
                <RrhButton type="submit">{t('common.submit')}</RrhButton>
              </div>
            </>
          )}
        </div>
      </RrhForm>
      <RrhForm
        form={formTwo}
        className="relative mt-4 flex flex-col gap-4"
        onSubmit={formTwo.handleSubmit(onSubmitFormTwo)}
      >
        <div>
          <div className="flex cursor-pointer items-center gap-2" onClick={() => setType('two')}>
            <input type="radio" checked={type === 'two'} onChange={() => setType('two')} />
            <span>{t('CRMAccountPage.addNewAccountAndBindRebate')}</span>
          </div>
          {type === 'two' && (
            <div className="mt-4 flex flex-col gap-4">
              <FormSelect
                showRowValue={false}
                name="serviceType"
                options={serverTypeOptions}
                label={t('tradingAccountTransactions.serverType')}
              />
              <FormSelect
                name="server"
                showRowValue={false}
                options={serverOptions}
                label={t('table.server')}
              />
              <FormSelect
                name="serverGroup"
                showRowValue={false}
                label={t('table.groups')}
                options={groupOptions}
                disabled={groupOptions.length === 0}
              />
              <FormInput
                name="account"
                type="number"
                label={`${t('table.account')}(${t('common.optional')})`}
                placeholder={t('common.pleaseInput', { field: t('table.account') })}
              />
              {maxAccountAmountsTips && <div>{maxAccountAmountsTips}</div>}
              <FormSelect
                name="lever"
                showRowValue={false}
                label={t('common.level')}
                options={leverOptions}
              />
              <FormSelect
                name="accountGroupId"
                showRowValue={false}
                label={`${t('table.accountGroup')}(${t('common.optional')})`}
                options={
                  rebateAccountsInfo?.allDealAccountGroup.map(item => ({
                    label: item.name,
                    value: item.id,
                  })) || []
                }
              />
              <SelectUpperDropdown
                rawLabel={`${t('table.directAgent')} (${t('common.optional')})`}
                name="directBroker"
              />
              <div>{t('table.accountBelongToUpper') + (rebateAccountsInfo?.userInviter || '')}</div>
              <div className="flex justify-end">
                <RrhButton type="submit">{t('common.submit')}</RrhButton>
              </div>
            </div>
          )}
        </div>

        {optionsLoading && (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
            <RrhCircleLoading />
          </div>
        )}
      </RrhForm>
    </RrhCard>
  );
};
