import { AllocatedUsersItem, OrderItem } from '@/api/hooks/ticket/types';
import { RrhCard } from '@/components/common/RrhCard';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextarea } from '@/components/form/FormTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { FormField } from '@/components/ui/form';
import { useGlobalLoading } from '@/contexts/loading';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { uploadFilesInArr } from '../../ticket-list/components/AddTicketDialog';
import { useUploadFile } from '@/api/hooks/system/system';
import { useGetAllocatedUsers, useTicketEdit } from '@/api/hooks/ticket/ticket';
import { toast } from 'sonner';
import { UploadFile, UploadItem } from '../../ticket-list/components/UploadFile';
import { SelectOption } from '@/api/types';
import { useUserStore } from '@/store/userStore';
import { priorityMap, statusMap } from '@/lib/const';
import { RrhLever } from '@/components/common/RrhLever';
import { KycStatus, RrhKycStatus } from '@/components/common/RrhKycStatus';

type FormValues = {
  belongUserId?: string;
  content: string;
  roleId?: string;
  receiverId?: string;
  carbonCopy?: string[];
  priority?: string;
  isFollow?: string;
  fileList?: UploadItem[];
  status?: string;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  const existedFileSchema = z.object({
    id: z.string().nullable().optional(),
    linkId: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    sort: z.number().nullable().optional(),
  });

  return {
    belongUserId: z.string().optional(),
    content: z.string().min(1, t('rules.required', { field: t('ticketList.content') })),
    roleId: z.string().optional(),
    receiverId: z.string().optional(),
    carbonCopy: z.array(z.string()).optional(),
    priority: z.string().optional(),
    isFollow: z.string().optional(),
    fileList: z.array(z.union([z.instanceof(File), existedFileSchema])).optional(),
    status: z.string().optional(),
  };
};

export function TicketInfo({
  order,
  ccNames,
  editStatus,
  roleOptions,
  userOptions,
  cancelSignal,
  submitSignal,
  onSuccess,
}: {
  order: OrderItem;
  ccNames?: string;
  editStatus: boolean;
  roleOptions: SelectOption[];
  userOptions: SelectOption[];
  cancelSignal: number;
  submitSignal: number;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();

  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: edit } = useTicketEdit();
  const { mutateAsync: getAllocatedUsers } = useGetAllocatedUsers();
  const { user } = useUserStore();
  const { withLoading } = useGlobalLoading();
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
      status: '0',
    },
  });
  const [loading, setLoading] = useState(false);
  const [allocatedList, setAllocatedList] = useState<SelectOption[]>([]);
  const lastSubmitSignalRef = useRef(0);

  const initialValues = useMemo<FormValues>(() => {
    if (!order) {
      return {
        belongUserId: '',
        content: '',
        roleId: '',
        receiverId: '',
        carbonCopy: [],
        priority: '0',
        isFollow: '0',
        fileList: [],
        status: '0',
      };
    }

    const carbonCopyList = order.carbonCopy
      ? order.carbonCopy
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      : [];

    return {
      belongUserId: order.belongUserId || '',
      content: order.content || '',
      roleId: '',
      receiverId: order.receiverId || '',
      carbonCopy: carbonCopyList,
      priority: String(order.priority || '0'),
      isFollow: String(order.isFollow ?? 0),
      fileList: order.orderFiles || [],
      status: String(order.status || '0'),
    };
  }, [order]);

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    if (cancelSignal === 0) return;
    form.reset(initialValues);
  }, [cancelSignal, form, initialValues]);

  const detailInfo = useMemo(() => {
    if (!order) return [];
    const priority = String(order.priority || '0');
    const priorityLevelMap: Record<string, 'low' | 'medium' | 'high'> = {
      '0': 'low',
      '1': 'medium',
      '2': 'high',
    };
    const priorityLevel = priorityLevelMap[priority];
    const priorityText = t(priorityMap.find(i => String(i.value) === priority)?.label || '') || '-';
    const reviewStatus = order.status as KycStatus;
    const carbonCopy = ccNames || '-';

    const statusDom = <RrhKycStatus status={reviewStatus} />;
    const priorityDom = <RrhLever level={priorityLevel} text={priorityText} />;

    const orderFiles = order?.orderFiles?.map(i => i.fileName).join(', ') || '';

    const detailInfo: { label: string; value: string | React.ReactNode }[] = [
      {
        label: t('ticketList.belongUser'),
        value: order?.belongUser,
      },
      {
        label: t('ticketList.content'),
        value: order?.content,
      },
      {
        label: t('ticketList.attachment'),
        value: orderFiles || '-',
      },
      {
        label: t('ticketList.receiverId'),
        value: order?.receiver || '-',
      },
      {
        label: t('ticketList.carbonCopy'),
        value: carbonCopy,
      },
      {
        label: t('table.status'),
        value: statusDom,
      },
      {
        label: t('ticketList.priority'),
        value: priorityDom,
      },
      {
        label: t('ticketList.orderId'),
        value: order?.orderId || '-',
      },
      {
        label: t('common.createTime'),
        value: order?.createTime || '-',
      },
      {
        label: t('ticketList.lastModifiedTime'),
        value: order?.updateTime || '-',
      },
    ];
    return detailInfo;
  }, [order, ccNames, t]);

  const roleId = form.watch('roleId');

  useEffect(() => {
    let mounted = true;
    const fetchAllocatedUsers = async (roleId?: string) => {
      if (!roleId) {
        if (!mounted) return;
        const currentReceiverId = form.getValues('receiverId');
        const receiverOption = currentReceiverId
          ? userOptions.find(option => option.value === currentReceiverId)
          : undefined;

        if (receiverOption) {
          setAllocatedList([receiverOption]);
          return;
        }

        if (user?.userId) {
          setAllocatedList([
            {
              label: user.userLastName + user.userName,
              value: user.userId,
            },
          ]);
          if (!currentReceiverId) {
            form.setValue('receiverId', user.userId || '');
          }
        } else {
          setAllocatedList([]);
          if (!currentReceiverId) {
            form.setValue('receiverId', '');
          }
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
  }, [getAllocatedUsers, form, roleId, user, userOptions]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      await withLoading(async () => {
        try {
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
            id: order.id || '',
            content: data.content,
            receiverId: data.receiverId || '',
            status: order.status || '',
            priority: data.priority || '',
            fileUrls: fileUrls,
            fileNames: fileNames,
            carbonCopy: data.carbonCopy ? data.carbonCopy.join(',') : '',
          };
          const res = await edit(param);
          if (res.code === 0) {
            toast.success(t('common.success'));
            onSuccess();
          } else {
            toast.error(res.msg);
          }
        } catch {
          toast.error(t('common.AnErrorOccurred'));
        }
      });
    },
    [edit, onSuccess, order.id, order.status, t, upload, withLoading],
  );

  useEffect(() => {
    if (!editStatus || submitSignal === 0) return;
    if (submitSignal === lastSubmitSignalRef.current) return;
    lastSubmitSignalRef.current = submitSignal;
    form.handleSubmit(onSubmit)();
  }, [editStatus, form, onSubmit, submitSignal]);

  return (
    <RrhCard>
      <div className="grid grid-cols-1 gap-3">
        <div className="text-foreground text-sm leading-5">{t('ticketList.ticketDetail')}</div>

        {editStatus ? (
          <div>
            <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormTextarea
                name="content"
                label={t('ticketList.content')}
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
                      fileWrapperCls="md:grid-cols-1"
                    />
                  );
                }}
              />

              <div className="flex items-end gap-6">
                <div className="flex-1">
                  <FormSelect
                    name="roleId"
                    label={t('ticketList.receiverId')}
                    verticalLabel
                    placeholder={t('common.pleaseSelect')}
                    showRowValue={false}
                    options={roleOptions}
                  />
                </div>

                <div className="flex-1">
                  <FormSelect
                    name="receiverId"
                    label={''}
                    verticalLabel
                    placeholder={t('common.pleaseSelect')}
                    showRowValue={false}
                    options={allocatedList}
                    loading={loading}
                  />
                </div>
              </div>

              <FormMultiSelect
                name="carbonCopy"
                label={t('ticketList.carbonCopy')}
                verticalLabel
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={userOptions}
              />

              <FormSelect
                name="status"
                label={t('table.status')}
                verticalLabel
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={statusMap.map(i => ({
                  label: t(i.label),
                  value: String(i.value),
                }))}
              />

              <FormSelect
                name="priority"
                label={t('ticketList.priority')}
                verticalLabel
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={priorityMap.map(i => ({
                  label: t(i.label),
                  value: String(i.value),
                }))}
              />
            </RrhForm>
          </div>
        ) : (
          <div>
            {detailInfo.map(item => (
              <div key={item.label} className="grid grid-cols-1 gap-2 py-3">
                <div className="text-muted-foreground text-sm leading-5">{item.label}</div>
                <div className="text-foreground text-sm leading-5 break-words whitespace-pre-wrap">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RrhCard>
  );
}
