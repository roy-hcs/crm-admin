import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { CrmUserItem, TagUserItem } from '@/api/hooks/system/types';
import Dialog from '@/components/common/Dialog';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { AccountDialog } from './AccountDialog';
import { useCustomerRelationsPostList } from '@/api/hooks/system/system';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { SelectUpperPopup } from './SelectUpperPopup';
import { crmAccountTypeOptions, roleOptions, statusOptions } from '@/lib/const';
import { cn } from '@/lib/utils';
import { RrhButton } from '@/components/common/RrhButton';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { RrhCascader } from '@/components/common/RrhCascader';

interface CascaderOption {
  value: string;
  label: string;
  isLeaf?: boolean;
  children?: CascaderOption[];
  loading?: boolean;
}

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

const SelectAccountsPopup = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'accounts'>;
  verticalLabel?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string>('');
  const { data: relations, isLoading } = useCustomerRelationsPostList(
    selectedId ? { userId: selectedId } : null,
  );
  const { t } = useTranslation();

  const updateOptionChildren = useCallback(
    (
      options: CascaderOption[],
      targetValue: string,
      children: CascaderOption[],
    ): CascaderOption[] => {
      return options.map(option => {
        if (option.value === targetValue) {
          return { ...option, children, loading: false };
        }
        if (option.children) {
          return {
            ...option,
            children: updateOptionChildren(option.children, targetValue, children),
          };
        }
        return option;
      });
    },
    [],
  );

  const loadData = (selectedOptions: CascaderOption[]): Promise<void> => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setOptions(options => updateOptionChildren(options, targetOption.value, []));
    return new Promise<void>(resolve => {
      setSelectedId(targetOption.value);
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };

  useEffect(() => {
    if (relations && !selectedId) {
      setOptions(
        relations
          .map(item => ({
            value: item.id,
            label: item.parentName || 'Unnamed',
            isLeaf: !item.hasChildren,
          }))
          .filter(item => {
            if (selectedUser) {
              return item.value === selectedUser.id;
            }
            return true;
          }),
      );
    }
  }, [relations, selectedId, selectedUser]);

  useEffect(() => {
    if (relations && selectedId) {
      const children = relations.map(child => ({
        value: child.id,
        label: child.parentName || 'Unnamed',
        isLeaf: !child.hasChildren,
      }));
      setOptions(options => updateOptionChildren(options, selectedId, children));
    }
  }, [relations, selectedId, updateOptionChildren]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onChange = (value: string[], selectedOptions: CascaderOption[]) => {
    setSelectedOptionId(value[value.length - 1]);
    setSelectedOptionLabel(selectedOptions?.[selectedOptions.length - 1]?.label || '');
  };

  return (
    <FormItem className={cn('flex text-sm', verticalLabel ? 'flex-col items-start gap-2' : '')}>
      <FormLabel className="basis-3/12 text-[#757F8D]">
        {t('CRMAccountPage.AccountRange')}:
      </FormLabel>
      <FormControl className="basis-9/12">
        <Dialog
          title={t('CRMAccountPage.SelectSuperiorRange')}
          className="flex min-h-1/2 min-w-1/2 flex-col"
          trigger={
            <div className="h-9 w-full shrink-0 basis-9/12 cursor-pointer rounded-md border p-2 text-[#757F8D]">
              {selectedOptionLabel ? selectedOptionLabel : t('common.pleaseSelect')}
            </div>
          }
          cancelText={t('common.Cancel')}
          confirmText={t('common.Confirm')}
          onConfirm={() => {
            field.onChange(selectedOptionId);
          }}
        >
          <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
            <Input
              type="text"
              disabled
              value={selectedUser?.userName || ''}
              className="h-9 border px-2"
              placeholder="请选择CRM"
            />
            <AccountDialog
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              title="请选择上级范围"
              trigger={
                <RrhButton
                  type="button"
                  className="flex h-9 cursor-pointer items-center gap-1 border bg-[#1E1E1E] px-6 text-white"
                >
                  {t('common.select')}
                </RrhButton>
              }
              onConfirm={() => {
                field.onChange('');
              }}
            />
            <RrhButton
              type="reset"
              className="flex h-9 cursor-pointer items-center gap-1 border bg-white px-6 text-[#1E1E1E]"
            >
              {t('common.Reset')}
            </RrhButton>
          </form>
          <div className="flex-1">
            <RrhCascader
              options={options}
              loadData={loadData}
              onChange={onChange}
              notFoundContent={isLoading ? t('common.loading') : t('common.NoData')}
              displayRender={labels => labels[labels.length - 1]}
              changeOnSelect
            />
          </div>
        </Dialog>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
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
              return <SelectAccountsPopup verticalLabel field={field} />;
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
