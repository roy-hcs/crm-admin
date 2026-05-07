import { useCreateAgentCustomerFollowup } from '@/api/hooks/agent/agent';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhDialog } from '@/components/common/RrhDialog';
import { SelectAdminUserDropdown } from '@/components/common/SelectAdminUserDropdown';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import FormDateInput from '@/components/form/FormDateInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormTextarea } from '@/components/form/FormTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

type FormValues = {
  userId: string;
  title: string;
  content: string;
  followTime?: Date;
  remind: string;
  remindAdmins: string;
  remindUsers: string;
  remindWay: string;
  remindTime?: Date;
};
export const AddAgentFollowupItemDialog = ({
  userId,
  refetch,
}: {
  userId: string;
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutate: addFollowup, isPending } = useCreateAgentCustomerFollowup();
  const schema = z
    .object({
      userId: z.string(),
      title: z.string().min(1, t('rules.required', { field: t('table.title') })),
      content: z.string().min(1, t('rules.required', { field: t('table.content') })),
      followTime: z.date().optional(),
      remind: z.string(),
      remindAdmins: z.string(),
      remindUsers: z.string(),
      remindWay: z.string(),
      remindTime: z.date().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.remind === '1') {
        const adminUserInfo = JSON.parse(data.remindAdmins || '{"id": "", "label": ""}');
        const userInfo = JSON.parse(data.remindUsers || '{"id": "", "label": ""}');
        if (!adminUserInfo.id && !userInfo.id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('CRMAccountPage.reminder') }),
            path: ['remindAdmins'],
          });
        }
        if (!data.remindWay) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('CRMAccountPage.remindWay') }),
            path: ['remindWay'],
          });
        }
        if (!data.remindTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('CRMAccountPage.remindTime') }),
            path: ['remindTime'],
          });
        } else if (data.remindTime <= new Date()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.timeShouldBeFuture', { field: t('CRMAccountPage.remindTime') }),
            path: ['remindTime'],
          });
        }
      }
    });
  const form = useForm<FormValues>({
    defaultValues: {
      userId,
      title: '',
      content: '',
      followTime: undefined,
      remind: '',
      remindAdmins: '',
      remindUsers: '',
      remindWay: '',
      remindTime: undefined,
    },
    resolver: zodResolver(schema),
  });
  const enableRemind = form.watch('remind');
  const onSubmit = (values: FormValues) => {
    console.log('submit', values);
    const adminUserInfo = JSON.parse(values.remindAdmins || '{"id": "", "label": ""}');
    const userInfo = JSON.parse(values.remindUsers || '{"id": "", "label": ""}');
    addFollowup(
      {
        userId,
        title: values.title,
        content: values.content,
        followTime: formatDate(values.followTime || new Date(), 'YYYY-MM-DD HH:mm:ss'),
        remind: values.remind || '0',
        remindAdmins: adminUserInfo.id,
        remindUsers: userInfo.id,
        remindWay: values.remindWay,
        remindTime: values.remindTime ? formatDate(values.remindTime, 'YYYY-MM-DD HH:mm:ss') : '',
      },
      {
        onSuccess: () => {
          refetch();
          cancel();
        },
      },
    );
    return;
  };
  const cancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <RrhDialog
      trigger={<RrhButton>{t('common.add')}</RrhButton>}
      title={t('common.add') + t('CRMAccountPage.followup')}
      footerShow={false}
      open={open}
      onOpenChange={value => {
        setOpen(value);
        if (!value) {
          cancel();
        }
      }}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6"
      >
        <FormInput
          name="title"
          label={t('table.title')}
          verticalLabel
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
        />
        <FormTextarea
          name="content"
          label={t('table.content')}
          placeholder={t('rules.limitLength', { field: 200 })}
          maxLength={200}
        />
        <FormDateInput
          name="followTime"
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('CRMAccountPage.followTimeTip')}
            </div>
          }
          label={t('table.followTime')}
          showTime
        />
        <FormSwitch name="remind" label={t('CRMAccountPage.remind')} verticalLabel />
        {enableRemind === '1' && (
          <>
            <SelectAdminUserDropdown
              name="remindAdmins"
              label={`${t('CRMAccountPage.reminder')} (${t('rolesManagement.administrator')})`}
            />
            <SelectUpperDropdown
              name="remindUsers"
              rawLabel={`${t('CRMAccountPage.reminder')} (${t('rolesManagement.users')})`}
              customMapOptions={item => {
                return {
                  value: item.id,
                  label: `${item.lastName || ''} ${item.name || ''} (${item.email})`,
                };
              }}
            />
            <FormSelect
              name="remindWay"
              verticalLabel
              showRowValue={false}
              label={t('CRMAccountPage.remindWay')}
              options={[
                {
                  value: '1',
                  label: t('common.mail'),
                },
                {
                  value: '2',
                  label: t('common.siteMessage'),
                },
              ]}
            />
            <FormDateInput name="remindTime" label={t('CRMAccountPage.remindTime')} showTime />
          </>
        )}
        <div className="border-border -mx-6 flex justify-end gap-4 border-t px-6 pt-3 pb-3 md:pt-6 md:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={cancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2" loading={isPending}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
        {isPending && (
          <div className="bg-accent-foreground/8 absolute inset-0 flex items-center justify-center">
            <RrhCircleLoading />
          </div>
        )}
      </RrhForm>
    </RrhDialog>
  );
};
