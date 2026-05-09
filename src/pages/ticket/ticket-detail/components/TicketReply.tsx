import { Replies } from '@/api/hooks/ticket/types';
import { RrhCard } from '@/components/common/RrhCard';
import { FormTextarea } from '@/components/form/FormTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { UploadFile } from '../../ticket-list/components/UploadFile';
import { toast } from 'sonner';
import { uploadFilesInArr } from '../../ticket-list/components/AddTicketDialog';
import { useUploadFile } from '@/api/hooks/system/system';
import { useDeleteReply, useReplyOrder } from '@/api/hooks/ticket/ticket';
import { RrhButton } from '@/components/common/RrhButton';
import { useGlobalLoading } from '@/contexts/loading';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useState } from 'react';

type FormValues = {
  orderId?: string;
  content: string;
  fileUrls?: string;
  fileNames?: string;
  fileList?: File[];
};

const schema = (t: TFunction<'translation', undefined>) => {
  return z.object({
    content: z.string().min(1, t('rules.required', { field: t('ticketList.content') })),
    orderId: z.string().optional(),
    fileUrls: z.string().optional(),
    fileNames: z.string().optional(),
    fileList: z.array(z.instanceof(File)).optional(),
  });
};

export function TicketReply({
  replies,
  orderId,
  onSuccess,
}: {
  replies: Replies[];
  orderId?: string;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [id, setId] = useState('');
  const { mutateAsync: deleteReply } = useDeleteReply();
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: replyOrder } = useReplyOrder();
  const { withLoading } = useGlobalLoading();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      orderId: orderId || '',
      content: '',
      fileUrls: '',
      fileNames: '',
      fileList: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
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
          orderId: orderId || '',
          content: data.content,
          fileUrls,
          fileNames,
        };
        const res = await replyOrder(param);
        if (res.code === 0) {
          form.reset();
          toast.success(t('common.success'));
          onSuccess();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setId(id);
    setDeleteAlert(true);
  };

  return (
    <RrhCard>
      <div className="grid gap-6">
        <div className="text-foreground text-sm leading-5">{t('ticketList.ticketReply')}</div>
        <RrhForm
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6"
        >
          <FormTextarea
            name="content"
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

          <div className="text-right">
            <RrhButton type="submit">{t('common.submit')}</RrhButton>
          </div>
        </RrhForm>
        <div className="bg-border h-0.25 w-full"></div>
        {replies.length ? (
          <div className="grid gap-6">
            {replies.map(i => (
              <div className="bg-primary-foreground grid gap-3 rounded-lg p-3" key={i.id}>
                <div className="flex gap-3">
                  <div className="size-12 overflow-hidden rounded-full">
                    <img src={i?.replyerAvatar || ''} />
                  </div>
                  <div className="grid flex-1 gap-1">
                    <div className="text-card-foreground text-sm leading-5">{i.replyer}</div>
                    <div className="text-muted-foreground text-sm leading-5">{i.replyTime}</div>
                  </div>
                  <div
                    onClick={() => handleDelete(i?.id || '')}
                    className="flex size-9 cursor-pointer items-center justify-center"
                  >
                    <Trash2 className="size-4" />
                  </div>
                </div>
                <div className="text-card-foreground text-sm leading-5">{i.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground flex size-30 w-full items-center justify-center text-xs">
            {t('common.NoData')}
          </div>
        )}
      </div>

      <RrhDeleteAlert<{
        id: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={onSuccess}
        confirmFunction={deleteReply}
        params={{ id }}
        tipsText={t('ticketList.confirmDeleteReply')}
      />
    </RrhCard>
  );
}
