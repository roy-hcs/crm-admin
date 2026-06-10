import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { RoleItem, UserListParams } from '@/api/hooks/system';
import { FormSelect } from '@/components/form/FormSelect';
import { onlineStatusOptions, statusOptions } from '@/lib/const';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  userName: string;
  roleId: string;
  status: string;
  phonenumber: string;
  email: string;
  onlineStatus: string;
  time: { from: string; to: string };
};

export const AdminAccountsForm = ({
  setOtherParams,
  setParams,
  loading,
  roleList,
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<UserListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<UserListParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
  roleList: RoleItem[];
  reset: () => void;
  params: UserListParams['params'];
  otherParams: Omit<UserListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      userName: otherParams?.userName || '',
      roleId: otherParams?.roleId || '',
      status: otherParams?.status || '',
      phonenumber: otherParams?.phonenumber || '',
      email: otherParams?.email || '',
      onlineStatus: otherParams?.onlineStatus || '',
      time: { from: params?.beginTime || '', to: params?.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      userName: data.userName,
      roleId: data.roleId,
      status: data.status,
      phonenumber: data.phonenumber,
      email: data.email,
      onlineStatus: data.onlineStatus,
    });
    setParams(pre => ({
      ...pre,
      beginTime: data.time.from,
      endTime: data.time.to,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      userName: '',
      roleId: '',
      status: '',
      phonenumber: '',
      email: '',
      onlineStatus: '',
      time: { from: '', to: '' },
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (e.target instanceof HTMLTextAreaElement) return;

          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="userName"
        label={t('table.fullName')}
        placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
      />
      <FormSelect
        verticalLabel
        name="roleId"
        label={t('adminAccounts.roleName')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={roleList.map(i => ({ label: i.roleName, value: i.roleId }))}
      />
      <FormSelect
        verticalLabel
        name="status"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={statusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormInput
        name="phonenumber"
        label={t('table.mobile')}
        placeholder={t('common.pleaseInput', { field: t('table.mobile') })}
      />
      <FormInput
        name="email"
        label={t('table.email')}
        placeholder={t('common.pleaseInput', { field: t('table.email') })}
      />
      <FormSelect
        verticalLabel
        name="onlineStatus"
        label={t('loginPage.login')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={onlineStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormField
        name="time"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="time" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton type="reset" variant="outline" onClick={onReset}>
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit" loading={loading}>
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
