import { Form, FormField } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { SelectUser } from '@/pages/account/trading-accounts/components/SelectUser';
import { useGetAllocatedUsers, useTicketAdd } from '@/api/hooks/ticket/ticket';
import { SelectOption } from '@/api/types';
import { AllocatedUsersItem } from '@/api/hooks/ticket/types';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormTextarea } from '@/components/form/FormTextarea';
import { UploadFile } from './UploadFile';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { useUploadFile } from '@/api/hooks/system/system';
import { useUserStore } from '@/store/userStore';

type FormValues = {
  belongUserId?: string;
  content: string;
  roleId?: string;
  receiverId?: string;
  carbonCopy?: string[];
  priority?: string;
  isFollow?: string;
  fileList?: File[];
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    belongUserId: z.string().optional(),
    content: z.string().min(1, t('rules.required', { field: t('ticketList.content') })),
    roleId: z.string().optional(),
    receiverId: z.string().optional(),
    carbonCopy: z.array(z.string()).optional(),
    priority: z.string().optional(),
    isFollow: z.string().optional(),
    fileList: z.array(z.instanceof(File)).optional(),
  };
};

/**
 * 并发上传数组中的所有 File 类型值
 * @param arr 原始数组 [File]
 * @param uploadFn 上传函数
 * @param errorMsg 错误提示信息
 */
async function uploadFilesInArr(
  arr: File[] | undefined,
  uploadFn: (file: File) => Promise<{ code: number; url: string; msg?: string }>,
  errorMsg: string = 'Upload failed',
): Promise<Array<{ fileUrls: string; fileNames: string }>> {
  if (!arr) return [];

  // 创建并发任务
  const tasks = arr.map(async file => {
    if (file instanceof File) {
      try {
        const res = await uploadFn(file);
        if (res.code === 0) {
          return { fileUrls: res.url, fileNames: file.name };
        } else {
          toast.error(errorMsg);
          return { fileUrls: '', fileNames: '' };
        }
      } catch (e) {
        console.error(e);
        toast.error(errorMsg);
        return { fileUrls: '', fileNames: '' };
      }
    }
    // 如果原本就是字符串（链接）或其他，保持原样
    return { fileUrls: '', fileNames: '' };
  });

  // 等待所有上传完成
  const results = await Promise.all(tasks);

  // 组装回对象
  return results.map(({ fileUrls, fileNames }) => ({ fileUrls, fileNames }));
}

export const AddTicketDialog = ({
  onSuccess,
  roleOptions,
  userOptions,
}: {
  onSuccess?: () => void;
  roleOptions: SelectOption[];
  userOptions: SelectOption[];
}) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allocatedList, setAllocatedList] = useState<SelectOption[]>([]);

  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      belongUserId: '',
      content: '',
      roleId: '',
      receiverId: '',
      carbonCopy: [],
      priority: '0',
      isFollow: '0',
      fileList: [],
    },
  });
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: getAllocatedUsers } = useGetAllocatedUsers();
  const { mutateAsync: addTicket } = useTicketAdd();

  const roleId = form.watch('roleId');

  useEffect(() => {
    if (!open) return;
    // 获取下级用户
    let mounted = true;
    const fetchAllocatedUsers = async (roleId?: string) => {
      if (!roleId) {
        if (!mounted) return;
        if (user?.userId) {
          setAllocatedList([
            {
              label: user.userLastName + user.userName,
              value: user.userId,
            },
          ]);
          form.setValue('receiverId', user.userId || '');
        } else {
          setAllocatedList([]);
          form.setValue('receiverId', '');
        }
        return;
      }
      try {
        setLoading(true);
        form.setValue('receiverId', '');
        const res = await getAllocatedUsers({ roleId });
        if (!mounted) return;
        if (res?.code === 0 && res?.rows) {
          const options = res.rows.map((i: AllocatedUsersItem) => ({
            label: i.userLastName + i.userName,
            value: i.userId,
          }));
          setAllocatedList(options);
        } else {
          setAllocatedList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setAllocatedList([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAllocatedUsers(roleId);
    return () => {
      mounted = false;
    };
  }, [open, getAllocatedUsers, form, roleId, user]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const fileData = await uploadFilesInArr(
        data.fileList,
        file => upload(file),
        t('ads.uploader'),
      );
      const fileUrls = fileData
        .map(i => i.fileUrls)
        .filter(url => url)
        .join(',');
      const fileNames = fileData
        .map(i => i.fileNames)
        .filter(name => name)
        .join(',');
      const param = {
        belongUserId: data.belongUserId || '',
        content: data.content || '',
        receiverId: data.receiverId || '',
        priority: data.priority || '',
        carbonCopy: data.carbonCopy ? data.carbonCopy.join(',') : '',
        isFollow: data.isFollow || '',
        fileUrls: fileUrls,
        fileNames: fileNames,
      };
      const res = await addTicket(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
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

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
    if (!open) {
      setAllocatedList([]);
    }
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('ticketList.addTicket')}
        </RrhButton>
      }
      title={t('ticketList.addTicket')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={() => form.handleSubmit(onSubmit)()}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              name="belongUserId"
              render={({ field }) => {
                return <SelectUser verticalLabel field={field} title={t('table.threeCons')} />;
              }}
            />

            <FormTextarea
              name="content"
              label={t('ticketList.content')}
              verticalLabel
              placeholder={t('rules.limitLength', { field: 600 })}
              maxLength={600}
            />

            <FormField
              name="fileList"
              render={({ field }) => {
                return (
                  <UploadFile
                    label={t('ticketList.attachment')}
                    field={field}
                    description={t('ticketList.attachmentDescription', {
                      fileTypes: 'txt, doc, docx, ppt, pptx, xlsx, pdf, jpg, jpeg, png, gif',
                      maxSize: 10,
                    })}
                  />
                );
              }}
            />

            <FormSelect
              name="roleId"
              label={t('ticketList.receiverId')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={roleOptions}
            />

            <FormSelect
              name="receiverId"
              label={''}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={allocatedList}
              loading={loading}
            />

            <FormMultiSelect
              name="carbonCopy"
              label={t('ticketList.carbonCopy')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={userOptions}
            />

            <FormSelect
              name="priority"
              label={t('ticketList.priority')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={[
                { label: t('ticketList.priorityOptions.0'), value: 0 },
                { label: t('ticketList.priorityOptions.1'), value: 1 },
                { label: t('ticketList.priorityOptions.2'), value: 2 },
              ]}
            />

            <FormSwitch verticalLabel name="isFollow" label={t('ticketList.isFollow')} />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
