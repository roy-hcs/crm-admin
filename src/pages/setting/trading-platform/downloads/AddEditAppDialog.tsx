import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { AppDownloadItem, AppDownloadLanguageItem } from '@/api/hooks/setting/types';
import { useAddAppDownload } from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { SelectOption } from '@/api/types';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { UploadFile } from '@/components/common/UploadFile';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { FormInput } from '@/components/form/FormInput';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useUploadFile } from '@/api/hooks/system/system';
import { toast } from 'sonner';

type FormValues = {
  nameLanguageMap: Record<string, string>;
  downloadLink: string;
  icon: File | string;
  status: string;
  qrCodeActive: string;
  applicableRoles: string[];
};

function parseNameLanguageList(
  input: AppDownloadItem['nameLanguageList'],
): Array<AppDownloadLanguageItem> {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(item => ({
        id: typeof item?.id === 'string' ? item.id : '',
        language: typeof item?.language === 'string' ? item.language : '',
        appName: typeof item?.appName === 'string' ? item.appName : '',
      }))
      .filter(item => item.language);
  } catch {
    return [];
  }
}

export const AddEditAppDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  languageOptions,
  onSuccess,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: AppDownloadItem;
  languageOptions: SelectOption[];
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [activeLang, setActiveLang] = useState('zh-CN');
  const [languageIdMap, setLanguageIdMap] = useState<Record<string, string>>({});

  const { mutateAsync: save, isPending: isSavePending } = useAddAppDownload();
  const { mutateAsync: uploadFile, isPending: isUploadPending } = useUploadFile();

  const schema = useMemo(
    () =>
      z
        .object({
          nameLanguageMap: z.record(z.string(), z.string()),
          downloadLink: z.string().min(1, t('rules.required', { field: t('common.downloadLink') })),
          icon: z
            .union([z.string(), z.instanceof(File)])
            .refine(value => (typeof value === 'string' ? Boolean(value.trim()) : true), {
              message: t('rules.required', { field: t('common.icon') }),
            }),
          status: z.string().min(1, t('rules.required', { field: t('table.status') })),
          qrCodeActive: z.string().min(1, t('rules.required', { field: t('common.qrcode') })),
          applicableRoles: z.array(z.string()),
        })
        .superRefine((values, ctx) => {
          const hasAppName = languageOptions.some(option => {
            const language = String(option.value);
            return Boolean(values.nameLanguageMap?.[language]?.trim());
          });

          if (!hasAppName) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['nameLanguageMap', activeLang],
              message: t('rules.required', { field: t('products.goodsName') }),
            });
          }
        }),
    [t, languageOptions, activeLang],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameLanguageMap: {},
      downloadLink: '',
      icon: '',
      status: '1',
      qrCodeActive: '0',
      applicableRoles: [],
    },
  });

  useEffect(() => {
    if (languageOptions.length === 0) return;
    const firstLanguage = String(languageOptions[0]?.value || '');
    if (!firstLanguage) return;
    if (!languageOptions.some(option => String(option.value) === activeLang)) {
      setActiveLang(firstLanguage);
    }
  }, [languageOptions, activeLang]);

  useEffect(() => {
    if (!open) return;

    const languageMap = languageOptions.reduce<Record<string, string>>((acc, option) => {
      acc[String(option.value)] = '';
      return acc;
    }, {});

    const nameIdMap: Record<string, string> = {};

    if (mode === 'edit' && item) {
      const parsedNameLanguageList = parseNameLanguageList(item.nameLanguageList);
      parsedNameLanguageList.forEach(entry => {
        languageMap[entry.language] = entry.appName || '';
        if (entry.id) {
          nameIdMap[entry.language] = entry.id;
        }
      });
      setLanguageIdMap(nameIdMap);
      form.reset({
        nameLanguageMap: languageMap,
        downloadLink: item.downloadLink || '',
        icon: item.icon || '',
        status: String(item.status ?? 1),
        qrCodeActive: String(item.qrCodeActive ?? 0),
        applicableRoles: (item.applicableRoles || '')
          .split(',')
          .map(i => i.trim())
          .filter(Boolean),
      });
      return;
    }

    setLanguageIdMap({});

    form.reset({
      nameLanguageMap: languageMap,
      downloadLink: '',
      icon: '',
      status: '1',
      qrCodeActive: '0',
      applicableRoles: [],
    });
  }, [open, mode, item, form, languageOptions]);

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setLanguageIdMap({});
    }
  };

  const onSubmit = async (data: FormValues) => {
    // 如果中文名称为空，则提示用户填写中文名称 并且跳转到中文名称的输入框
    const chineseLanguageOption = languageOptions.find(option => String(option.value) === 'zh-CN');
    if (chineseLanguageOption) {
      const chineseName = data.nameLanguageMap?.['zh-CN']?.trim();
      if (!chineseName) {
        setActiveLang('zh-CN');
        form.setError('nameLanguageMap.zh-CN', {
          type: 'manual',
          message: t('rules.required', { field: t('products.goodsName') }),
        });
        return;
      }
    }
    try {
      let iconUrl = '';
      if (typeof data.icon === 'string') {
        iconUrl = data.icon;
      } else if (data.icon instanceof File) {
        const uploadRes = await uploadFile(data.icon);
        if (uploadRes?.code !== 0 || !uploadRes?.url) {
          toast.error(uploadRes?.msg || t('common.fail'));
          return;
        }
        iconUrl = uploadRes.url;
      }

      const nameLanguageList = languageOptions.map(option => {
        const language = String(option.value);
        return {
          id: languageIdMap[language] || '',
          language,
          appName: (data.nameLanguageMap?.[language] || '').trim(),
        };
      });

      const res = await save({
        ...(mode === 'edit' && item?.id ? { id: item.id } : {}),
        downloadLink: data.downloadLink.trim(),
        icon: iconUrl,
        status: Number(data.status),
        qrCodeActive: Number(data.qrCodeActive),
        nameLanguageList,
        applicableRoles: (data.applicableRoles || []).join(','),
      });

      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', {
              field: t('settingsTradingPlatformDownloads.appDownload'),
            })
          : t('common.modify', {
              field: t('settingsTradingPlatformDownloads.appDownload'),
            })
      }
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isSavePending || isUploadPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isSavePending || isUploadPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <RrhSwitchGroup
          value={activeLang}
          onValueChange={value => {
            setActiveLang(value);
          }}
          switchItems={languageOptions}
        />
        <div>
          {languageOptions.map(lang => {
            return (
              <div key={lang.value} className={cn(activeLang === lang.value ? 'block' : 'hidden')}>
                <FormInput
                  name={`nameLanguageMap.${String(lang.value)}`}
                  label={`${t('products.goodsName')} (${lang.label})`}
                  placeholder={t('rules.limitLength', {
                    field: 32,
                  })}
                  maxLength={32}
                />
              </div>
            );
          })}
        </div>

        <FormInput
          name="downloadLink"
          label={t('common.downloadLink')}
          placeholder={t('common.pleaseInput', {
            field: t('common.downloadLink'),
          })}
        />

        <FormField
          name="icon"
          render={({ field }) => {
            return (
              <UploadFile
                label={t('common.icon')}
                field={field}
                description={t('settingsTradingPlatformDownloads.iconDesc')}
                maxSizeMB={0.1}
                accept=".jpg,.jpeg,.png"
                allowedExtensions={['jpg', 'jpeg', 'png']}
              />
            );
          }}
        />

        <FormSwitch name="status" label={t('table.status')} />
        <FormSwitch name="qrCodeActive" label={t('common.qrcode')} />

        <FormCrmRoleMultiSelect<FormValues>
          verticalLabel
          name="applicableRoles"
          label={t('products.applicableRoles')}
        />
      </RrhForm>
    </RrhDialog>
  );
};
