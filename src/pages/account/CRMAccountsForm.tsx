import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { TagUserItem } from '@/api/hooks/system/types';
export const CRMForm = ({ tagsUserList }: { tagsUserList: TagUserItem[] }) => {
  const form = useForm({
    defaultValues: {
      threeCons: '',
      regStartTime: '',
      // Add more fields as needed
    },
  });
  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
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
                  className="border px-2"
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
                  className="border px-2"
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
                <input type="text" {...field} placeholder="请输入邮箱" className="border px-2" />
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
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">上级:</FormLabel>
              <FormControl className="basis-9/12">
                <input type="date" {...field} className="border px-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accounts"
          render={({ field }) => (
            <FormItem className="flex text-sm">
              <FormLabel className="basis-3/12">账户范围:</FormLabel>
              <FormControl className="basis-9/12">
                <input type="date" {...field} className="border px-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
                  className="border px-2"
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
