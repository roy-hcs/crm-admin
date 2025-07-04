import Dialog from '@/components/common/Dialog';
import { FormInput } from '@/components/form/FormInput';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SelectUpperPopup } from './SelectUpperPopup';
import { FormSelect } from '@/components/form/FormSelect';
import { colorPreferenceOptions, crmAccountTypeOptions, roleOptions } from '@/lib/const';
import { CrmSelect } from '@/components/common/CrmSelect';
import mobileZone from '@/data/mzone.json';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';

// the data form needs to collect
// {
//     "deptId=",
//     "lastName=chen",
//     "name=roy",
//     "fullName=",
//     "mzone=86",
//     "mobile=15705958081",
//     "email=680%40qq.com",
//     "inviter=",
//     "pwd=LYubfUaY%2FrmxDSMz16TxCBuKKxcW6aPZ3JyBqdGsoopvuVkOL1MdIRic6OpkRwILbromw5GT8ZaBhvySZqtldVWhTFYkFiLcTj12uRkx4cIAOQWse1liS7OAefcIRSqfy1NyV2TRiIqd7pVh7N9a1VvewkJE6q9yiJIpVDGnSqI%3D",
//     "preferenceLanguage=zh-CN",
//     "accountType=1",
//     "roleId=131",
//     "colorPreference=1",
//     "source=3",
//     "status=1"
// }

// create a zod schema for the form data
const addUserSchema = {
  lastName: z.string().min(1, '姓不能为空'),
  name: z.string().min(1, '名不能为空'),
  mobile: z
    .string()
    .min(1, '手机号码不能为空')
    .regex(/^\d{11}$/, '手机号码格式不正确'),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  inviter: z.string().optional(),
  pwd: z.string().min(1, '密码不能为空'),
  preferenceLanguage: z.string().min(1, '语言不能为空'),
  accountType: z.string().min(1, '账户类型不能为空'),
  roleId: z.string().min(1, '角色不能为空'),
  colorPreference: z.string().min(1, '颜色不能为空'),
  status: z.string().min(1, '状态不能为空'),
};

export const AddUserDialog = () => {
  const [open, setOpen] = useState(false);
  // const [mzone, setMzone] = useState('+86');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // const mobileZoneOptions = mobileZone.mzone.map(item => {
  //   return {
  //     label: `${item.area} ${item.code}`,
  //     value: `+${item.code}`,
  //   };
  // });

  const form = useForm({
    resolver: zodResolver(z.object(addUserSchema)),
    defaultValues: {
      lastName: '',
      name: '',
      mobile: '',
      email: '',
      inviter: '',
      pwd: '',
      preferenceLanguage: 'zh-CN',
      accountType: '',
      roleId: '',
      colorPreference: '',
      status: '1',
    },
  });
  const onSubmit = async data => {
    console.log('on submit---', data);
    // try {
    //   setIsSubmitting(true);
    //   // Make your API request here
    //   // const response = await api.createUser(data);
    //   console.log('Form submitted:', data);

    //   // If the request is successful, close the dialog
    //   // setOpen(false);
    // } catch (error) {
    //   // If the request fails, keep the dialog open and show error
    //   console.error('Error submitting form:', error);
    //   // You can set an error state and display it in your form
    // } finally {
    //   setIsSubmitting(false);
    // }
  };
  const onCancel = () => {
    // Reset the form when the dialog is closed
    form.reset();
  };

  return (
    <Dialog
      trigger={
        <button className="flex cursor-pointer items-center gap-1 border bg-blue-500 px-4 text-sm text-white">
          <Plus className="size-3.5" />
          <span>新增</span>
        </button>
      }
      title="新增CRM账户"
      className="flex min-h-1/2 min-w-1/2 flex-col"
      cancelText="取消"
      confirmText="确认"
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
    >
      <div>
        <FormProvider form={form}>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2"
            >
              <FormInput name="lastName" label="姓:" placeholder="请输入姓" />
              <FormInput name="name" label="名:" placeholder="请输入名" />
              <FormInput name="mobile" label="手机号码:" placeholder="请输入手机号码" />
              <FormPhoneInput
                name="mobile"
                label="手机号码:"
                placeholder="请输入手机号码"
                className="col-span-1 md:col-span-2"
              />
              {/* <FormField
                name="mobile"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel className="basis-3/12">手机号码:</FormLabel>
                    <div className="flex basis-9/12 items-center">
                      <CrmSelect
                        options={mobileZoneOptions}
                        value={mzone}
                        showRowValue={true}
                        onValueChange={setMzone}
                        className="basis-2/12 rounded-none"
                      />
                      <input
                        type="text"
                        {...field}
                        placeholder="请输入手机号码"
                        className="h-9 w-full basis-10/12 border-y border-r px-2 text-sm"
                      />
                    </div>
                  </FormItem>
                )}
              /> */}
              <FormInput name="email" label="邮箱:" placeholder="请输入邮箱" />
              <FormField
                name="inviter"
                render={({ field }) => {
                  return <SelectUpperPopup field={field} />;
                }}
              />
              <FormInput name="pwd" label="密码:" placeholder="请输入密码" />
              <FormInput name="preferenceLanguage" label="语言:" placeholder="请选择语言" />
              <FormSelect
                name="roleId"
                label="账户类型:"
                placeholder="请选择账户类型"
                options={crmAccountTypeOptions}
              />
              <FormSelect
                name="roleId"
                label="角色:"
                placeholder="请选择角色"
                options={roleOptions}
              />
              <FormSelect
                name="roleId"
                label="涨跌颜色偏好:"
                placeholder="请选择涨跌颜色偏好"
                options={colorPreferenceOptions}
              />
              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel className="basis-3/12">状态:</FormLabel>
                    <div className="basis-9/12">
                      <Switch
                        checked={field.value === '1'}
                        onCheckedChange={checked => field.onChange(checked ? '1' : '0')}
                      />
                    </div>
                  </FormItem>
                )}
                control={form.control}
              />
              <div className="col-span-full flex justify-end">
                <button type="button" className="px-4 py-2" onClick={onCancel}>
                  取消
                </button>
                <button type="submit" className="px-4 py-2">
                  确认
                </button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </Dialog>
  );
};
