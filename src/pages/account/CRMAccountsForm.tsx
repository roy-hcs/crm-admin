import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { CrmUserItem, TagUserItem } from '@/api/hooks/system/types';
import Dialog from '@/components/common/Dialog';
import { useState } from 'react';
import { AccountDialog } from './AccountDialog';
// import { Cascader, CascaderProps } from 'antd';
// import { useCustomerRelationsPostList } from '@/api/hooks/system/system';

// interface Option {
//   value: string;
//   label: string;
//   children?: Option[];
// }

// interface CascaderOption {
//   value: string;
//   label: string;
//   isLeaf: boolean;
//   children?: CascaderOption[];
//   loading?: boolean;
// }

const SelectUpperPopup = ({ field }: { field: ControllerRenderProps<FieldValues, 'inviter'> }) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  return (
    <FormItem className="flex text-sm">
      <FormLabel className="basis-3/12">上级:</FormLabel>
      <FormControl className="basis-9/12">
        <AccountDialog
          trigger={
            <div className="w-full cursor-pointer border p-2">
              {selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : '请选择'}
            </div>
          }
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          title="选择上级"
          onConfirm={string => field.onChange(string)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

const SelectAccountsPopup = ({
  field,
}: {
  field: ControllerRenderProps<FieldValues, 'accounts'>;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  // const [options, setOptions] = useState<Option[]>([]);
  // const [selectedId, setSelectedId] = useState<string>('');
  // const { data: relations, isLoading } = useCustomerRelationsPostList(
  //   selectedId ? { userId: selectedId } : null,
  // );

  // useEffect(() => {
  //   if (selectedUser) {
  //     // Initial query to fetch root level options based on selected user
  //     const rootLevelOptions: CascaderOption[] = [
  //       {
  //         value: selectedUser.id,
  //         label: `${selectedUser.userName}(${selectedUser.showId})`,
  //         isLeaf: false,
  //       },
  //     ];
  //     setOptions(rootLevelOptions);
  //     // Set selectedId to trigger the query for children
  //     setSelectedId(selectedUser.id);
  //   } else {
  //     setOptions([]);
  //     setSelectedId('');
  //   }
  // }, [selectedUser]);

  // useEffect(() => {
  //   if (relations && selectedId) {
  //     // Find the option that needs children
  //     const updateOptionsWithChildren = (opts: CascaderOption[]): CascaderOption[] => {
  //       return opts.map(opt => {
  //         if (opt.value === selectedId) {
  //           // Convert relations data to cascader options
  //           const children = relations.map(item => ({
  //             value: item.id,
  //             label: `${item.childNames || 'Unnamed'}${item.crmRebateLevel ? ` (${item.crmRebateLevel})` : ''}`,
  //             isLeaf: !item.hasChildren,
  //           }));

  //           return {
  //             ...opt,
  //             children,
  //             loading: false,
  //           };
  //         } else if (opt.children) {
  //           return {
  //             ...opt,
  //             children: updateOptionsWithChildren(opt.children),
  //           };
  //         }
  //         return opt;
  //       });
  //     };

  //     setOptions(prev => updateOptionsWithChildren(prev));
  //   }
  // }, [relations, selectedId]);

  // const loadData: CascaderProps['loadData'] = selectedOptions => {
  //   const targetOption = selectedOptions[selectedOptions.length - 1];

  //   // Mark as loading
  //   targetOption.loading = true;
  //   setOptions([...options]);

  //   // Set the ID to trigger the tanstack query
  //   setSelectedId(targetOption.value);
  // };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('on submit');
  };
  // const onChange: CascaderProps<Option>['onChange'] = value => {
  //   console.log(value);
  // };

  return (
    <FormItem className="flex text-sm">
      <FormLabel className="basis-3/12">账户范围:</FormLabel>
      <FormControl className="basis-9/12">
        <Dialog
          title="请选择上级范围"
          className="min-w-1/2"
          trigger={
            <div className="w-full cursor-pointer border p-2">
              {selectedUser ? `${selectedUser.userName}(${selectedUser.showId})` : '请选择'}
            </div>
          }
          cancelText="取消"
          confirmText="确认"
          onConfirm={() => {
            field.onChange('');
          }}
        >
          <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
            <input type="text" disabled className="h-9 border px-2" placeholder="请选择CRM" />
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
          <div>
            <input type="text" />
            {/* <Cascader
              options={options}
              loadData={loadData}
              onChange={onChange}
              notFoundContent={isLoading ? '加载中...' : '无数据'}
              changeOnSelect
              // add this to make sure the children options can unfold normally
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            /> */}
          </div>
        </Dialog>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
export const CRMForm = ({ tagsUserList }: { tagsUserList: TagUserItem[] }) => {
  const form = useForm({
    defaultValues: {
      threeCons: '',
      regStartTime: '',
      // Add more fields as needed
    },
  });
  const onSubmit = () => {
    // console.log('Form submitted with data:', data);
    // Handle form submission logic here
  };
  const statusOptions = [
    { label: '启用', value: '1' },
    { label: '停用', value: '0' },
  ];

  const crmAccountTypeOptions = [
    { label: '用户', value: '1' },
    { label: '代理', value: '2' },
  ];
  const roleOptions = [
    { label: 'CRM用户', value: '131' },
    { label: 'MAM', value: '198' },
    { label: '奖励', value: '197' },
    { label: '消息管理', value: '196' },
    { label: '钱包测试', value: '195' },
  ];

  const tagsOptions = tagsUserList.map(tag => ({
    label: tag.tagName,
    value: tag.id,
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
      >
        <FormField
          name="fuzzyEmail"
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">姓名/账户ID:</FormLabel>
              <FormControl className="basis-9/12">
                <input
                  type="text"
                  {...field}
                  className="h-9 border px-2"
                  placeholder="请输入姓名/账户ID"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="status"
          render={() => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">状态:</FormLabel>
              <FormControl className="basis-9/12">
                <FormSelect options={statusOptions} className="rounded-none" placeholder="请选择" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="registerTime"
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
        <FormField
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">手机号:</FormLabel>
              <FormControl className="basis-9/12">
                <input
                  type="text"
                  {...field}
                  placeholder="请输入手机号码"
                  className="h-9 border px-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">邮箱:</FormLabel>
              <FormControl className="basis-9/12">
                <input
                  type="text"
                  {...field}
                  placeholder="请输入邮箱"
                  className="h-9 border px-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="role"
          render={() => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">角色:</FormLabel>
              <FormControl className="basis-9/12">
                <FormSelect options={roleOptions} className="rounded-none" placeholder="请选择" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="inviter"
          render={({ field }) => {
            // use field.onChange to handle the selection
            return <SelectUpperPopup field={field} />;
          }}
        />
        <FormField
          name="accounts"
          render={({ field }) => {
            return <SelectAccountsPopup field={field} />;
          }}
        />
        <FormField
          name="certiricateNo"
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">证件号码:</FormLabel>
              <FormControl className="basis-9/12">
                <input
                  type="text"
                  {...field}
                  placeholder="请输入证件号码"
                  className="h-9 border px-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountType"
          render={() => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">CRM账户类型:</FormLabel>
              <FormControl className="basis-9/12">
                <FormSelect
                  options={crmAccountTypeOptions}
                  className="rounded-none"
                  placeholder="请选择"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tags"
          render={() => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">标签名称:</FormLabel>
              <FormControl className="basis-9/12">
                <FormSelect options={tagsOptions} className="rounded-none" placeholder="请选择" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1 flex justify-center gap-2 sm:col-span-2 md:col-span-4">
          <button type="submit">submit</button>
          <button type="reset">reset</button>
        </div>
      </form>
    </Form>
  );
};
