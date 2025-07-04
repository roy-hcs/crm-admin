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
import { Cascader, CascaderProps } from 'antd';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { SelectUpperPopup } from './SelectUpperPopup';
import { crmAccountTypeOptions, roleOptions, statusOptions } from '@/lib/const';

interface CascaderOption {
  value: string;
  label: string;
  isLeaf: boolean;
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
}: {
  field: ControllerRenderProps<FieldValues, 'accounts'>;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string>('');
  const { data: relations, isLoading } = useCustomerRelationsPostList(
    selectedId ? { userId: selectedId } : null,
  );

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

  const loadData = (selectedOptions: CascaderOption[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // Mark as loading
    targetOption.loading = true;
    setOptions(options => updateOptionChildren(options, targetOption.value, []));
    // Set selectedId to trigger data fetch
    setSelectedId(targetOption.value);
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
  const onChange: CascaderProps<CascaderOption>['onChange'] = (value, selectedOptions) => {
    setSelectedOptionId(value[value.length - 1]);
    setSelectedOptionLabel(selectedOptions?.[selectedOptions.length - 1]?.label || '');
  };

  return (
    <FormItem className="flex text-sm">
      <FormLabel className="basis-3/12">账户范围:</FormLabel>
      <FormControl className="basis-9/12">
        <Dialog
          title="请选择上级范围"
          className="flex min-h-1/2 min-w-1/2 flex-col"
          trigger={
            <div className="h-9 w-full shrink-0 basis-9/12 cursor-pointer border p-2">
              {selectedOptionLabel ? selectedOptionLabel : '请选择'}
            </div>
          }
          cancelText="取消"
          confirmText="确认"
          onConfirm={() => {
            field.onChange(selectedOptionId);
          }}
        >
          <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
            <input
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
                <button
                  type="button"
                  className="flex h-9 cursor-pointer items-center gap-1 border bg-blue-500 px-2 text-white"
                >
                  选择
                </button>
              }
              onConfirm={() => {
                field.onChange('');
              }}
            />
            <button
              type="reset"
              className="flex h-9 cursor-pointer items-center gap-1 border bg-white px-2 text-blue-500"
            >
              重置
            </button>
          </form>
          <div className="flex-1">
            {/* TODO: use regular ul li instead of Cascader here may be better */}
            <Cascader
              options={options}
              loadData={loadData}
              onChange={onChange}
              notFoundContent={isLoading ? '加载中...' : '无数据'}
              displayRender={labels => labels[labels.length - 1]}
              changeOnSelect
              // add this to make sure the children options can unfold normally
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
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

export const CRMForm = forwardRef<
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
        >
          <FormInput name="name" label="姓名/账户ID:" placeholder="请输入姓名/账户ID" />
          <FormSelect name="status" label="状态:" placeholder="请选择" options={statusOptions} />

          <FormField
            name="regStartTime"
            render={() => (
              <FormItem className="flex text-sm">
                <FormLabel className="basis-3/12">注册时间:</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="regStartTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput name="mobile" label="手机号:" placeholder="请输入手机号码" />
          <FormInput name="email" label="邮箱:" placeholder="请输入邮箱" />
          <FormSelect name="role" label="角色:" placeholder="请选择" options={roleOptions} />
          <FormField
            name="inviter"
            render={({ field }) => {
              return <SelectUpperPopup field={field} />;
            }}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <SelectAccountsPopup field={field} />;
            }}
          />
          <FormInput name="certiricateNo" label="证件号码:" placeholder="请输入证件号码" />
          <FormSelect
            name="accountType"
            label="CRM账户类型:"
            placeholder="请选择"
            options={crmAccountTypeOptions}
          />
          <FormSelect name="tags" label="标签名称:" placeholder="请选择" options={tagsOptions} />
          <div className="col-span-1 flex justify-center gap-4 sm:col-span-2 md:col-span-4">
            <button
              type="submit"
              className="flex h-9 cursor-pointer items-center gap-2 border-blue-500 bg-blue-500 px-4 text-sm text-white"
            >
              <Search className="size-3.5" />
              <span>搜索</span>
            </button>
            <button
              type="reset"
              className="flex h-9 cursor-pointer items-center gap-2 border border-blue-500 bg-white px-4 text-sm text-blue-500"
            >
              <RefreshCcw className="size-3.5" />
              <span>重置</span>
            </button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
});
