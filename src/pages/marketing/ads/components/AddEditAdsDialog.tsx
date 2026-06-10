import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/form/FormInput';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { toast } from 'sonner';
import { useAddAds, useAdsDetail, useEditAds } from '@/api/hooks/marketing';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { UploadFile } from './components/UploadFile';
import { useUploadFile } from '@/api/hooks/system/system';
import { cloneDeep } from 'es-toolkit';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  name: string;
  position: string;
  sort: string;
  status: string;
  webPicture: File | string;
  appPicture?: File | string;
  jumpType: string;
  customLink: string;
  msgId: string;
  crmRoleIds?: Array<string>;
  pc?: Record<string, File | string>;
  mobile?: Record<string, File | string>;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    name: z.string().min(1, t('rules.required', { field: t('ads.adsName') })),
    position: z.string().min(1, t('rules.required', { field: t('ads.position') })),
    sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
    status: z.string().min(1, t('rules.required', { field: t('table.status') })),
    webPicture: z
      .union([z.instanceof(File), z.string()])
      .refine(
        val => (typeof val === 'string' && val.length > 0) || val instanceof File,
        t('rules.required', { field: t('ads.webPicture') }),
      ),
    appPicture: z.union([z.instanceof(File), z.string()]).optional(),
    jumpType: z.string().min(1, t('rules.required', { field: t('ads.jumpPath') })),
    customLink: z.string().min(1, t('rules.required', { field: t('ads.customLink') })),
    msgId: z.string().min(1, t('rules.required', { field: t('ads.announcementDetail') })),
    crmRoleIds: z.array(z.string()).optional(),
    pc: z.record(z.union([z.string(), z.instanceof(File)])).optional(),
    mobile: z.record(z.union([z.string(), z.instanceof(File)])).optional(),
  };
};

export const AddEditAdsDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  languageOptions,
  roleOptions,
  templateOptions,
}: {
  mode: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  languageOptions: Array<{ label: string; value: string }>;
  roleOptions: Array<{ label: string; value: string }>;
  templateOptions: Array<{ label: string; value: string }>;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('one' as 'one' | 'two');
  const [activeLang, setActiveLang] = useState('zh-CN');
  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      position: '',
      sort: '',
      status: '1',
      webPicture: '',
      appPicture: '',
      jumpType: '1',
      customLink: '',
      msgId: '',
      crmRoleIds: [],
      pc: {},
      mobile: {},
    },
  });
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: add } = useAddAds();
  const { mutateAsync: edit } = useEditAds();
  const { mutateAsync: getAdsDetail } = useAdsDetail();

  const jumpType = form.watch('jumpType');

  /**
   * 并发上传对象中的所有 File 类型值
   * @param obj 原始对象 { key: File | string }
   * @param uploadFn 上传函数
   * @param errorMsg 错误提示信息
   */
  async function uploadFilesInObject(
    obj: Record<string, File | string> | undefined,
    uploadFn: (file: File) => Promise<{ code: number; url: string; msg?: string }>,
    errorMsg: string = 'Upload failed',
  ): Promise<Record<string, string>> {
    if (!obj) return {};

    const keys = Object.keys(obj);
    // 创建并发任务
    const tasks = keys.map(async key => {
      const value = obj[key];
      if (value instanceof File) {
        try {
          const res = await uploadFn(value);
          if (res.code === 0) {
            return { key, value: res.url };
          } else {
            toast.error(errorMsg);
            return { key, value: '' }; // 上传失败置空
          }
        } catch (e) {
          console.error(e);
          toast.error(errorMsg);
          return { key, value: '' };
        }
      }
      // 如果原本就是字符串（链接）或其他，保持原样
      return { key, value: value as string };
    });

    // 等待所有上传完成
    const results = await Promise.all(tasks);

    // 组装回对象
    return results.reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      // 如果用户手动删除了默认的简体中文 把第一步上传的文件放到pc和mobile对象的zh-CN字段中 这样在第二步上传的时候就不会丢失
      if (data.pc?.['zh-CN'] === '') {
        form.setValue('pc.zh-CN', form.getValues('webPicture') || '');
      }
      if (data.mobile?.['zh-CN'] === '') {
        form.setValue('mobile.zh-CN', form.getValues('appPicture') || '');
      }
      // 1. 处理 PC 端图片
      const pcImages = await uploadFilesInObject(
        data.pc,
        file => upload(file), // 适配你的上传已函数签名
        t('ads.uploader'),
      );
      // 2. 处理 Mobile 端图片
      const mobileImages = await uploadFilesInObject(
        data.mobile,
        file => upload(file),
        t('ads.uploader'),
      );
      const languageList = languageOptions.map(i => {
        return {
          language: i.value,
          webPicture: pcImages[i.value] || '',
          appPicture: mobileImages[i.value] || '',
        };
      });
      const crmRoleIds = data.crmRoleIds?.length ? data.crmRoleIds.join(',') : '';
      const params = {
        name: data.name,
        position: data.position,
        sort: data.sort,
        status: data.status,
        webPicture: languageList.find(i => i.language === 'zh-CN')?.webPicture || '',
        appPicture: languageList.find(i => i.language === 'zh-CN')?.appPicture || '',
        jumpType: data.jumpType,
        customLink: data.jumpType === '1' ? data.customLink : '',
        msgId: data.jumpType === '2' ? data.msgId || null : null,
        crmRoleIds: data.jumpType === '1' ? crmRoleIds || null : null,
        languageList: languageList,
      };
      const res = mode === 'add' ? await add(params) : await edit({ ...params, id: id || '' });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
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
    switch (step) {
      case 'one': {
        onClose(false);
        break;
      }
      case 'two':
        setStep('one');
        break;
    }
  };

  const onConfirm = async () => {
    switch (step) {
      case 'one': {
        let ok;
        if (jumpType === '1') {
          ok = await form.trigger(['name', 'position', 'webPicture', 'customLink']);
        } else {
          ok = await form.trigger(['name', 'position', 'webPicture', 'msgId']);
        }
        if (ok) {
          setStep('two');
          // 初始化pc 和 mobile 的初始值
          const pc = { ...form.getValues('pc') } as Record<string, File | string>;
          const mobile = { ...form.getValues('mobile') } as Record<string, File | string>;
          if (form.getValues('webPicture')) {
            // 深拷贝 防止 用户在第二步手动删除后 全部丢失
            pc['zh-CN'] = cloneDeep(form.getValues('webPicture'));
          }
          if (form.getValues('appPicture')) {
            mobile['zh-CN'] = cloneDeep(form.getValues('appPicture')) || '';
          }

          languageOptions.forEach(lang => {
            pc[lang.value] = lang.value in pc ? pc[lang.value] : '';
            mobile[lang.value] = lang.value in mobile ? mobile[lang.value] : '';
          });
          form.setValue('pc', pc);
          form.setValue('mobile', mobile);
        }
        break;
      }
      case 'two':
        // 不需要校验 直接调用接口
        onSubmit(form.getValues());
        break;
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
    setStep('one');
  };

  useEffect(() => {
    // 编辑模式 初始数据
    if (mode !== 'edit' || !id) return;
    if (!languageOptions.length) return;
    async function fetchDetail() {
      const res = await getAdsDetail(id || '');
      if (res.code === 0) {
        const advertise = res.data.advertise;
        form.setValue('name', advertise.name);
        form.setValue('position', `${advertise.position}`);
        form.setValue('sort', advertise.sort);
        form.setValue('status', String(advertise.status));
        form.setValue('webPicture', advertise.webPicture || '');
        form.setValue('appPicture', advertise.appPicture || '');
        form.setValue('jumpType', String(advertise.jumpType));
        form.setValue('customLink', advertise.customLink || '');
        form.setValue('msgId', advertise.msgId || '');
        form.setValue(
          'crmRoleIds',
          advertise.crmRoleIds?.split(',').filter((id: string) => id) || [],
        );
      }
    }
    fetchDetail();
  }, [mode, form, id, getAdsDetail, languageOptions, open]);

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={mode === 'add' ? t('ads.add') : t('ads.edit')}
      isConfirmDisabled={isSubmitting}
      open={open}
      cancelText={step === 'one' ? t('common.Cancel') : t('common.previous')}
      confirmText={step === 'one' ? t('common.next') : t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn(step === 'one' ? 'block' : 'hidden')}>
          <div className="grid gap-6">
            <FormInput
              name="name"
              label={t('ads.adsName')}
              placeholder={t('common.pleaseInput', { field: t('ads.adsName') })}
              maxLength={64}
            />

            <FormSelect
              name="position"
              label={t('ads.position')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={[{ label: t('ads.positionType.1'), value: '1' }]}
            />

            <FormInput
              name="sort"
              label={t('table.sort')}
              placeholder={t('common.pleaseInput', { field: t('table.sort') })}
              maxLength={64}
            />

            <FormSwitch name="status" label={t('table.status')} />
            <FormField
              name="webPicture"
              render={({ field }) => {
                return (
                  <UploadFile
                    label={t('ads.webPicture')}
                    field={field}
                    description={t('ads.webPictureDescription')}
                  />
                );
              }}
            />

            <FormField
              name="appPicture"
              render={({ field }) => {
                return (
                  <UploadFile
                    field={field}
                    label={t('ads.appPicture')}
                    description={t('ads.appPictureDescription')}
                  />
                );
              }}
            />
            <FormField
              name="jumpType"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t('ads.jumpPath')}</FormLabel>
                    <FormControl>
                      <div className="grid gap-2">
                        <RrhSwitchGroup
                          value={field.value}
                          onValueChange={value => {
                            field.onChange(value);
                            if (value === '1') {
                              form.setValue('customLink', '');
                              form.setValue('crmRoleIds', []);
                            } else {
                              form.setValue('customLink', '');
                            }
                          }}
                          labelClassName="font-medium"
                          switchItems={[
                            { label: t('ads.customLink'), value: '1' },
                            { label: t('ads.announcementDetail'), value: '2' },
                          ]}
                        />
                        {jumpType === '1' && (
                          <FormInput name="customLink" label={''} placeholder={t('ads.entering')} />
                        )}
                        {jumpType === '2' && (
                          <FormSelect
                            name="msgId"
                            label={''}
                            placeholder={t('common.pleaseSelect')}
                            showRowValue={false}
                            options={templateOptions}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {jumpType === '1' && (
              <FormMultiSelect
                name="crmRoleIds"
                label={t('ads.visibleRole')}
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={roleOptions}
              />
            )}
          </div>
        </div>
        {step === 'two' ? (
          <div className="grid gap-6">
            <RrhSwitchGroup
              value={activeLang}
              onValueChange={value => {
                setActiveLang(value);
              }}
              labelClassName="font-medium"
              switchItems={languageOptions.map(lang => ({
                value: lang.value,
                label: lang.label,
              }))}
            />
            <div>
              {languageOptions.map(lang => {
                return (
                  <div
                    key={lang.value}
                    className={cn(activeLang === lang.value ? 'block' : 'hidden')}
                  >
                    <div className="grid gap-6">
                      <FormField
                        name={`pc.${lang.value}`}
                        render={({ field }) => {
                          return (
                            <UploadFile
                              label={t('ads.webPicture')}
                              field={field}
                              description={t('ads.webPictureDescription')}
                            />
                          );
                        }}
                      />
                      <FormField
                        name={`mobile.${lang.value}`}
                        render={({ field }) => {
                          return (
                            <UploadFile
                              field={field}
                              label={t('ads.appPicture')}
                              description={t('ads.appPictureDescription')}
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
        ) : null}
      </RrhForm>
    </RrhDialog>
  );
};
