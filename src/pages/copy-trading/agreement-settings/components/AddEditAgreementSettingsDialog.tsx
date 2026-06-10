import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { SelectOption } from '@/api/types';
import {
  useAddMamProtocol,
  useEditMamProtocol,
  useMamProtocolDetail,
} from '@/api/hooks/copyTrading';
import { AddMamProtocolParams, LanguagesItem } from '@/api/hooks/copyTrading/type';
import { FormSwitch } from '@/components/form/FormSwitch';
import { RichTextEditor } from '@/pages/message/management/components/RichTextEditor';
import { useUploadFile } from '@/api/hooks/system/system';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { FormRadio } from '@/components/form/FormRadio';
import { uploadFilesInArr } from '@/lib/upload';
import {
  ExistingUploadFile,
  UploadFile,
  UploadItem,
} from '@/pages/ticket/ticket-list/components/UploadFile';

type LanguageFormItem = LanguagesItem & {
  uploadFiles: UploadItem[];
};

type FormValues = {
  applicableScenarios: string;
  sort: string;
  status: string;
  languages: LanguageFormItem[];
};

function getUploadItemsFromFileUrl(fileUrl: string): UploadItem[] {
  if (!fileUrl) return [];
  const fileName = decodeURIComponent(fileUrl.split('/').pop() || 'file.pdf');
  const existing: ExistingUploadFile = {
    fileName,
    fileUrl,
  };
  return [existing];
}

function createLanguages(options: SelectOption[], source: Partial<LanguagesItem>[] = []) {
  return options.map(option => {
    const sourceLanguage = source.find(item => item.language === option.value);
    const sourceType = String(sourceLanguage?.type || '0');
    const normalizedType = sourceType === '2' ? '1' : sourceType;
    return {
      language: option.value,
      name: sourceLanguage?.name || '',
      type: normalizedType === '0' || normalizedType === '1' ? normalizedType : '0',
      content: sourceLanguage?.content || '',
      fileUrl: sourceLanguage?.fileUrl || '',
      uploadFiles: getUploadItemsFromFileUrl(sourceLanguage?.fileUrl || ''),
    };
  });
}

export const AddEditAgreementSettingsDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  title,
  scenarioOptions,
  languageOptions,
}: {
  mode: 'add' | 'edit' | 'view';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  title: string;
  scenarioOptions: SelectOption[];
  languageOptions: SelectOption[];
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('');
  const isAddMode = mode === 'add';

  const schema = useMemo(
    () =>
      z.object({
        applicableScenarios: z.string().min(
          1,
          t('rules.required', {
            field: t('CopyTradingSettings.applicableScenarios'),
          }),
        ),
        sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
        status: z.string(),
        languages: z.array(
          z.object({
            language: z.string(),
            name: z.string(),
            type: z.string(),
            content: z.string(),
            fileUrl: z.string(),
            uploadFiles: z.array(z.any()),
          }),
        ),
      }),
    [t],
  );

  const defaultLanguages = useMemo(() => createLanguages(languageOptions), [languageOptions]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      applicableScenarios: '',
      sort: '',
      status: '1',
      languages: defaultLanguages,
    },
  });
  const { mutateAsync: add } = useAddMamProtocol();
  const { mutateAsync: edit } = useEditMamProtocol();
  const { mutateAsync: getDetail } = useMamProtocolDetail();
  const { mutateAsync: uploadFile } = useUploadFile();

  const validateActiveLanguage = (data: FormValues) => {
    // 校验当前语言必填项，避免用户切换语言后提交导致数据不完整
    const activeIndex = data.languages.findIndex(item => item.language === activeLang);
    if (activeIndex < 0) {
      toast.error(t('common.fail'));
      return false;
    }
    const activeItem = data.languages[activeIndex];
    const namePath = `languages.${activeIndex}.name` as const;
    const typePath = `languages.${activeIndex}.type` as const;
    const contentPath = `languages.${activeIndex}.content` as const;
    const uploadFilesPath = `languages.${activeIndex}.uploadFiles` as const;

    form.clearErrors([namePath, typePath, contentPath, uploadFilesPath]);

    let hasError = false;
    if (!activeItem.name?.trim()) {
      form.setError(namePath, {
        type: 'manual',
        message: t('rules.required', { field: t('table.protocolName') }),
      });
      hasError = true;
    }
    if (!activeItem.type?.trim()) {
      form.setError(typePath, {
        type: 'manual',
        message: t('rules.required', { field: t('CopyTradingSettings.type') }),
      });
      hasError = true;
    }
    if (activeItem.type === '0') {
      if (!activeItem.content?.trim()) {
        form.setError(contentPath, {
          type: 'manual',
          message: t('rules.required', { field: t('CopyTradingSettings.content') }),
        });
        hasError = true;
      }
    } else {
      if (!activeItem.uploadFiles?.length) {
        form.setError(uploadFilesPath, {
          type: 'manual',
          message: t('rules.required', { field: t('ticketList.attachment') }),
        });
        hasError = true;
      }
    }
    return !hasError;
  };

  const onSubmit = async (data: FormValues) => {
    if (!validateActiveLanguage(data)) return;

    try {
      setIsSubmitting(true);

      const resolvedLanguages = await Promise.all(
        data.languages.map(async item => {
          if (item.type !== '1') {
            return {
              ...item,
              fileUrl: '',
            };
          }

          const fileData = await uploadFilesInArr(
            item.uploadFiles,
            file => uploadFile(file),
            t('common.fail'),
          );
          const firstFileUrl = fileData.find(i => i.fileUrls)?.fileUrls || '';

          return {
            ...item,
            fileUrl: firstFileUrl,
          };
        }),
      );

      const params: AddMamProtocolParams = {
        applicableScenarios: data.applicableScenarios,
        sort: data.sort,
        status: data.status || '0',
        languages: resolvedLanguages
          .filter(
            item =>
              item.name?.trim() &&
              ((item.type === '0' && item.content?.trim()) ||
                (item.type === '1' && item.fileUrl?.trim())),
          )
          .map(item => ({
            language: item.language,
            name: item.name.trim(),
            type: item.type || '0',
            content: item.type === '0' ? item.content.trim() : '',
            fileUrl: item.type === '1' ? item.fileUrl || '' : '',
          })),
      };

      const res = mode === 'add' ? await add(params) : await edit({ ...params, id: id || '' });
      if (res.code === 0) {
        toast.success(t('common.success'));
        handleOpenChange(false);
        onSuccess();
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
    handleOpenChange(false);
  };

  const onConfirm = () => {
    void form.handleSubmit(onSubmit)();
  };

  const resetForm = () => {
    form.reset({
      applicableScenarios: '',
      sort: '',
      status: '1',
      languages: createLanguages(languageOptions),
    });
    setActiveLang(languageOptions[0]?.value || '');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
      return;
    }
    if (isAddMode) {
      resetForm();
    }
  };

  useEffect(() => {
    if (!languageOptions.length) return;
    if (!activeLang || !languageOptions.some(item => item.value === activeLang)) {
      setActiveLang(languageOptions[0].value);
    }
  }, [activeLang, languageOptions]);

  useEffect(() => {
    // 编辑和查看模式打开弹窗时需要初始化详情数据
    if (isAddMode || !id || !open) return;
    const protocolId = id;

    async function fetchDetail() {
      try {
        setIsDetailLoading(true);
        const res = await getDetail(protocolId);
        if (res.code === 0) {
          const detail = res.data;
          const languages = createLanguages(
            languageOptions,
            (detail.languages || []).map(item => ({
              language: item.language,
              name: item.name,
              type: String(item.type),
              content: item.content,
              fileUrl: item.fileUrl,
            })),
          );
          form.reset({
            applicableScenarios: String(detail.applicableScenarios ?? ''),
            sort: String(detail.sort ?? ''),
            status: String(detail.status ?? '0'),
            languages,
          });
          setActiveLang(languages[0]?.language || languageOptions[0]?.value || '');
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.fail'));
      } finally {
        setIsDetailLoading(false);
      }
    }

    void fetchDetail();
  }, [form, getDetail, id, isAddMode, languageOptions, open, t]);

  return (
    <RrhDialog
      trigger={
        isAddMode ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={title}
      isConfirmDisabled={isSubmitting || isDetailLoading}
      open={open}
      onOpenChange={handleOpenChange}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      confirmText={t('common.Confirm')}
      cancelShow={true}
      formLoading={isSubmitting || isDetailLoading}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormSelect
            name="applicableScenarios"
            label={t('CopyTradingSettings.applicableScenarios')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={scenarioOptions}
          />

          <FormSwitch name="status" label={t('table.status')} verticalLabel />

          <FormInput name="sort" label={t('table.sort')} placeholder="1-999" />
          <div>
            <RrhSwitchGroup
              value={activeLang}
              onValueChange={value => {
                setActiveLang(value);
              }}
              labelClassName="font-medium"
              switchItems={languageOptions}
            />
          </div>
          <div>
            {languageOptions.map((i, index) => {
              return (
                <div key={i.value} className={cn(activeLang === i.value ? 'block' : 'hidden')}>
                  <div className="grid gap-6">
                    <FormInput
                      name={`languages.${index}.name`}
                      label={t('table.protocolName')}
                      placeholder={t('common.pleaseInput', { field: t('table.protocolName') })}
                      maxLength={50}
                    />

                    <FormRadio
                      name={`languages.${index}.type`}
                      orientation="horizontal"
                      label={t('CopyTradingSettings.type')}
                      options={[
                        { label: t('CopyTradingSettings.typeOptions.0'), value: '0' },
                        { label: t('CopyTradingSettings.typeOptions.1'), value: '1' },
                      ]}
                    />

                    <FormField
                      name={`languages.${index}.uploadFiles`}
                      render={({ field: fileField }) => {
                        const currentType = form.watch(`languages.${index}.type`);
                        if (currentType === '0') {
                          return (
                            <FormField
                              name={`languages.${index}.content`}
                              render={({ field }) => {
                                return (
                                  <RichTextEditor
                                    field={field}
                                    title={t('CopyTradingSettings.content')}
                                    placeholder={t('common.pleaseInput', {
                                      field: t('CopyTradingSettings.content'),
                                    })}
                                  />
                                );
                              }}
                            />
                          );
                        }

                        return (
                          <UploadFile
                            label={t('ticketList.attachment')}
                            field={fileField}
                            description={t('ticketList.attachmentDescription', {
                              fileTypes: 'pdf',
                              maxSize: 10,
                            })}
                            accept=".pdf"
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
