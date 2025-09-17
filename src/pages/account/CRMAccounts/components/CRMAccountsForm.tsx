import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { TagUserItem } from '@/api/hooks/system/types';
import { forwardRef, useImperativeHandle } from 'react';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { SelectUpperPopup } from './SelectUpperPopup';
import { crmAccountTypeOptions, roleOptions, statusOptions } from '@/lib/const';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';

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

export const CRMAccountsForm = forwardRef<
  CRMFormRef,
  {
    tagsUserList: TagUserItem[];
    setOtherParams: (params: {
      status: string;
      role: string;
      certiricateNo: string;
      accountType: string;
    }) => void;
    setParams: (params: {
      threeCons: string;
      regEndTime: string;
      regStartTime: string;
      fuzzyMobile: string;
      fuzzyEmail: string;
      inviter: string;
      accounts: string;
    }) => void;
    setTags: (tags: string) => void;
  }
>(({ tagsUserList, setOtherParams, setParams, setTags }, ref) => {
  const form = useForm({
    defaultValues: {
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
    },
  });
  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const { t } = useTranslation();

  const onSubmit = (data: FormData) => {
    setParams({
      threeCons: data.name,
      regStartTime: data.regStartTime.from,
      regEndTime: data.regStartTime.to,
      fuzzyMobile: data.mobile,
      fuzzyEmail: data.email,
      inviter: data.inviter,
      accounts: data.accounts,
    });
    setOtherParams({
      status: data.status,
      role: data.role,
      certiricateNo: data.certiricateNo,
      accountType: data.accountType,
    });
    setTags(data.tags);
  };
  const onReset = () => {
    form.reset();
    setParams({
      threeCons: '',
      regEndTime: '',
      regStartTime: '',
      fuzzyMobile: '',
      fuzzyEmail: '',
      inviter: '',
      accounts: '',
    });
    setOtherParams({
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
    });
    setTags('');
  };

  const tagsOptions = tagsUserList.map(tag => ({
    label: tag.tagName,
    value: tag.id,
  }));

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="name"
            label={t('CRMAccountPage.NameOrAccountId')}
            placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.NameOrAccountId') })}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('loginPage.email')}
            placeholder={t('common.pleaseInput', { field: t('loginPage.email') })}
          />
          <FormInput
            verticalLabel
            name="certiricateNo"
            label={t('CRMAccountPage.ID')}
            placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.ID') })}
          />
          <FormInput
            verticalLabel
            name="mobile"
            label={t('CRMAccountPage.Mobile')}
            placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.Mobile') })}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('CRMAccountPage.Status')}
            placeholder={t('common.pleaseSelect')}
            options={statusOptions}
          />
          <FormSelect
            verticalLabel
            name="role"
            label={t('CRMAccountPage.Role')}
            placeholder={t('common.pleaseSelect')}
            options={roleOptions}
          />

          <FormField
            name="regStartTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('CRMAccountPage.RegisterTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="regStartTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="inviter"
            render={({ field }) => {
              return <SelectUpperPopup verticalLabel field={field} />;
            }}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />

          <FormSelect
            name="accountType"
            label={t('CRMAccountPage.CRMAccountType')}
            placeholder={t('common.pleaseSelect')}
            verticalLabel
            options={crmAccountTypeOptions}
          />
          <FormSelect
            name="tags"
            verticalLabel
            label={t('CRMAccountPage.TagsName')}
            placeholder={t('common.pleaseSelect')}
            options={tagsOptions}
          />
          <div className="flex justify-end gap-4">
            <RrhButton
              type="reset"
              className="flex h-9 items-center gap-2 border border-[#1E1E1E] bg-white !px-6 text-sm text-[#1E1E1E]"
            >
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton
              type="submit"
              className="flex h-9 items-center gap-2 border-[#1E1E1E] bg-[#1E1E1E] !px-6 text-sm text-white"
            >
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
});
