import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { CrmUserParams, TagUserItem } from '@/api/hooks/account';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { crmAccountTypeOptions, statusOptions } from '@/lib/const';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';
import { useGetUserRoles } from '@/api/hooks/system/system';

type FormData = {
  accountType: string;
  regStartTime: { from: string; to: string };
  name: string;
  status: string;
  mobile: string;
  email: string;
  role: string;
  inviter: string;
  accounts: string;
  certiricateNo: string;
  tags: string;
};

export interface CRMFormRef {
  onReset: () => void;
}

export const CRMAccountsForm = ({
  tagsUserList,
  setOtherParams,
  setParams,
  setTags,
  reset,
  params,
  otherParams,
}: {
  tagsUserList: TagUserItem[];
  setOtherParams: Dispatch<SetStateAction<Omit<CrmUserParams, 'params' | keyof BasicParams>>>;
  setParams: Dispatch<SetStateAction<CrmUserParams['params']>>;
  setTags: (tags: string) => void;
  reset: () => void;
  params: CrmUserParams['params'];
  otherParams: Omit<CrmUserParams, 'params' | keyof BasicParams>;
}) => {
  const form = useForm({
    defaultValues: {
      regStartTime: { from: '', to: '' },
      name: params.threeCons || '',
      status: otherParams.status || '',
      mobile: params.fuzzyMobile || '',
      email: params.fuzzyEmail || '',
      role: otherParams.role || '',
      inviter: params.inviter || '',
      accounts: params.accounts || '',
      certiricateNo: otherParams.certiricateNo || '',
      tags: '',
      accountType: otherParams.accountType || '',
    },
  });
  const { data: userRoles } = useGetUserRoles();
  console.log('userRoles', userRoles);

  const { t } = useTranslation();

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      threeCons: data.name,
      regStartTime: formatDate(data.regStartTime.from),
      regEndTime: formatDate(data.regStartTime.to),
      fuzzyMobile: data.mobile,
      fuzzyEmail: data.email,
      inviter: data.inviter,
      accounts: selectedAccounts.label,
    });
    setOtherParams({
      status: data.status,
      role: data.role,
      certiricateNo: data.certiricateNo,
      accountType: data.accountType,
      accounts: selectedAccounts.id,
    });
    setTags(data.tags);
  };
  const onReset = () => {
    reset();
    setTags('');
    form.reset({
      regStartTime: { from: '', to: '' },
      name: '',
      status: '',
      mobile: '',
      email: '',
      role: '',
      inviter: '',
      accounts: '',
      certiricateNo: '',
      tags: '',
      accountType: '',
    });
  };

  const tagsOptions = tagsUserList.map(tag => ({
    label: tag.tagName,
    value: tag.id,
  }));

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="name"
        label={t('CRMAccountPage.NameOrAccountId')}
        placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.NameOrAccountId') })}
      />
      <FormInput
        name="email"
        label={t('loginPage.email')}
        placeholder={t('common.pleaseInput', { field: t('loginPage.email') })}
      />
      <FormInput
        name="certiricateNo"
        label={t('CRMAccountPage.ID')}
        placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.ID') })}
      />
      <FormInput
        name="mobile"
        label={t('CRMAccountPage.Mobile')}
        placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.Mobile') })}
      />
      <FormSelect
        name="status"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        options={statusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormSelect
        name="role"
        label={t('table.role')}
        placeholder={t('common.pleaseSelect')}
        options={(userRoles?.data || [])?.map(i => ({ label: t(i.roleName), value: i.roleId }))}
      />

      <FormField
        name="regStartTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('CRMAccountPage.registerTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="regStartTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SelectUpperDropdown
        rawLabel={`${t('CRMAccountPage.Superior')} (${t('common.optional')})`}
        name="inviter"
      />
      <SelectUpperDropdown />

      <FormSelect
        name="accountType"
        label={t('CRMAccountPage.CRMAccountType')}
        placeholder={t('common.pleaseSelect')}
        options={crmAccountTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormSelect
        name="tags"
        label={t('CRMAccountPage.TagsName')}
        placeholder={t('common.pleaseSelect')}
        options={tagsOptions}
      />
      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton
          variant="outline"
          onClick={onReset}
          type="reset"
          className="flex items-center gap-2"
        >
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit" className="flex items-center gap-2">
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
