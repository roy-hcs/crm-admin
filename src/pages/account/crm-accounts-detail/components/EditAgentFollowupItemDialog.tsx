import { useEditAgentCustomerFollowup } from '@/api/hooks/agent/agent';
import { CustomerFollowupInfoItem } from '@/api/hooks/agent/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenLine } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

type FormValues = {
  userId: string;
  title: string;
  content: string;
};
export const EditAgentFollowupItemDialog = ({
  userId,
  refetch,
  followupItem,
}: {
  userId: string;
  refetch: () => void;
  followupItem: CustomerFollowupInfoItem;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutate: editFollowup, isPending } = useEditAgentCustomerFollowup();
  const schema = z.object({
    userId: z.string(),
    title: z.string().min(1, t('rules.required', { field: t('table.title') })),
    content: z.string().min(1, t('rules.required', { field: t('table.content') })),
  });
  const form = useForm<FormValues>({
    defaultValues: {
      userId,
      title: followupItem.title,
      content: followupItem.content,
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = (values: FormValues) => {
    console.log('submit', values);
    editFollowup(
      {
        id: followupItem.id,
        title: values.title,
        content: values.content,
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
      trigger={
        <RrhButton variant="ghost" className="!p-2">
          <PenLine className="size-5" />
        </RrhButton>
      }
      title={t('common.Edit') + t('CRMAccountPage.followup')}
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
