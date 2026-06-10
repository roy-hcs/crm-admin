import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { SelectRadio } from './SelectRadio';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { cn } from '@/lib/utils';
import { RichTextEditor } from './RichTextEditor';
import { FormInput } from '@/components/form/FormInput';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { useMsgAdd, useMsgDetail, useMsgEdit } from '@/api/hooks/message';
import { toast } from 'sonner';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import FormDateInput from '@/components/form/FormDateInput';
import { format } from 'date-fns';
import { infoTypeOptions, receiveTypeOptions } from '@/lib/const';
import { useUserRoleList } from '@/api/hooks/system';
import { FormSearchMultiSelect } from '@/components/form/FormSearchMultiSelect';
import { useCrmUsers, useCrmUserTags } from '@/api/hooks/system/system';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  type: string;
  isNow: string;
  expireTime: Date | null;
  sendEmails: string[];
  roles: string[];
  userIds: string[];
  tags: string[];
  accounts: string;
  receiveType: string;
  template?: string;
  language: string;
  primaryLanguage: string;
  content?: Record<string, string>;
  title?: Record<string, string>;
  sendTime: Date | null;
};

const mySchema = (t: TFunction<'translation', undefined>) => {
  return {
    type: z.string().min(1, t('rules.required', { field: t('table.infoType') })),
    isNow: z.string().min(1, t('rules.required', { field: t('messageManagement.sendMethod') })),
    accounts: z
      .string()
      .min(1, t('rules.required', { field: t('messageManagement.receiveTypeOption.3') })),
    expireTime: z
      .date()
      .nullable()
      .refine(date => date !== null, {
        message: t('rules.required', { field: t('messageManagement.expireTime') }),
      }),
    sendTime: z
      .date()
      .nullable()
      .refine(date => date !== null, {
        message: t('rules.required', { field: t('table.sendTime') }),
      }),
    sendEmails: z
      .array(z.string())
      .min(1, t('rules.required', { field: t('table.sendEmailAddress') })),
    roles: z
      .array(z.string())
      .min(1, t('rules.required', { field: t('messageManagement.receiveTypeOption.2') })),
    userIds: z
      .array(z.string())
      .min(1, t('rules.required', { field: t('messageManagement.receiveTypeOption.0') })),
    tags: z
      .array(z.string())
      .min(1, t('rules.required', { field: t('messageManagement.receiveTypeOption.4') })),
    receiveType: z.string().min(1, t('rules.required', { field: t('table.receiver') })),
    language: z
      .string()
      .min(1, t('rules.required', { field: t('messageManagement.sendLanguage') })),
    primaryLanguage: z
      .string()
      .min(1, t('rules.required', { field: t('messageManagement.mainLanguage') })),
    template: z.string().optional(),
    content: z.record(z.string()).optional(),
    title: z.record(z.string()).optional(),
  };
};

export const AddEditNewMessageDialog = ({
  mode,
  title,
  trigger,
  source = 'MessageManagementPage',
  crmUserId,
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  languageOptions,
  emailOptions,
  msgTemplateOptions,
}: {
  mode: 'add' | 'edit';
  title: string;
  trigger?: React.ReactNode;
  source?: 'MessageManagementPage' | 'Customer';
  crmUserId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess?: () => void;
  languageOptions: Array<{ label: string; value: string }>;
  emailOptions: Array<{ label: string; value: string }>;
  msgTemplateOptions: Array<{ label: string; value: string; content: string }>;
}) => {
  const { data: RoleRes } = useUserRoleList({});
  const { mutateAsync: getCrmUsers } = useCrmUsers();
  const { mutateAsync: getCrmUsersTags } = useCrmUserTags();

  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryLanguageOptions, setPrimaryLanguageOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [step, setStep] = useState('one' as 'one' | 'two');
  const [activeLang, setActiveLang] = useState('');
  // 接口返回的主语言，等 options 就绪后再写入表单，避免首次打开时不显示
  const [initialPrimaryLanguage, setInitialPrimaryLanguage] = useState('');

  const schema = useMemo(
    () =>
      z.object(mySchema(t)).superRefine((data, ctx) => {
        const langs = data?.language?.split(',') || [];
        if (step === 'two') {
          langs.forEach(lang => {
            const content = data.content?.[lang];
            const title = data.title?.[lang];
            // 因为富文本编辑器的内容即使没有输入也会有<p></p>这样的标签，所以需要特殊判断一下
            if ((content || '').trim() === '' || content === '<p></p>') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('rules.required', {
                  field: t('table.content'),
                }),
                path: ['content', lang],
              });
            }
            if ((title || '').trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('rules.required', {
                  field: t('table.title'),
                }),
                path: ['title', lang],
              });
            }
          });
        }
      }),
    [step, t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: '',
      isNow: '1',
      sendEmails: [],
      roles: [],
      userIds: [],
      tags: [],
      accounts: '',
      expireTime: null,
      sendTime: null,
      receiveType: '1',
      template: '',
      language: '',
      primaryLanguage: '',
      content: {},
      title: {},
    },
  });

  const { mutateAsync: addMsg } = useMsgAdd();
  const { mutateAsync: editMsg } = useMsgEdit();
  const { mutateAsync: getMsg } = useMsgDetail();

  const type = form.watch('type');
  const isNow = form.watch('isNow');
  const language = form.watch('language');
  const receiveType = form.watch('receiveType');

  const fetchCrmUserOptions = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getCrmUsers({
        origin: '0',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        params: {
          threeCons: params.keyword,
        },
      });

      const rows = res.rows || [];
      const total = Number(res.total || 0);

      return {
        list: rows
          .filter(user => user.id || user.showId)
          .map(user => ({
            value: user.id || user.showId || '',
            label: [user.showId, user.name, user.lastName].filter(Boolean).join(' - '),
          })),
        total,
        hasMore: params.pageNum * params.pageSize < total,
      };
    },
    [getCrmUsers],
  );

  const fetchCrmUserTagsOptions = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getCrmUsersTags({
        status: '1',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        params: {
          threeCons: params.keyword,
        },
      });

      const rows = res.rows || [];
      const total = Number(res.total || 0);

      return {
        list: rows
          .filter(tag => tag.id)
          .map(tag => ({
            value: tag.id,
            label: tag.tagName,
          })),
        total,
        hasMore: params.pageNum * params.pageSize < total,
      };
    },
    [getCrmUsersTags],
  );

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const msgLangs = (data.language?.split(',') || []).map(lang => {
        return {
          content: data.content?.[lang] || '',
          title: data.title?.[lang] || '',
          language: lang,
        };
      });
      const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
        id: string;
        label: string;
      };
      const param = {
        type: data.type,
        isNow: data.isNow,
        sendTime:
          data.isNow === '0' && data.sendTime ? format(data.sendTime, 'yyyy-MM-dd HH:mm:ss') : '',
        expire:
          data.type === '0' && data.expireTime
            ? format(data.expireTime, 'yyyy-MM-dd HH:mm:ss')
            : '',
        sendEmail: data.type === '2' ? data.sendEmails : [],
        receiveType: data.receiveType,
        language: data?.language?.split(',') || [],
        primaryLanguage: data.primaryLanguage,
        accountNames: '',
        msgLangs: msgLangs,
        roles: receiveType === '2' ? data.roles : [],
        userIds: receiveType === '0' ? data.userIds : [],
        tags: receiveType === '4' ? data.tags : [],
        accounts: receiveType === '3' ? selectedAccounts.id : '',
        sendEmails: data.type === '2' ? data.sendEmails : [],
      };
      if (source === 'Customer') {
        param.receiveType = '0';
        param.userIds = [crmUserId || ''];
      }
      const res = mode === 'add' ? await addMsg(param) : await editMsg({ ...param, id: id || '' });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
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
        console.log(form.getValues(), 'form.getValues()');
        let ok;
        if (type === '2') {
          // 邮件通知需要校验sendEmails字段，其他的通知类型不需要校验这个字段
          ok = await form.trigger([
            'type',
            'isNow',
            'sendEmails',
            'receiveType',
            'language',
            'primaryLanguage',
          ]);
        } else if (type === '0') {
          // 弹窗通知需要校验expireTime字段，其他的通知类型不需要校验这个字段
          ok = await form.trigger([
            'type',
            'isNow',
            'receiveType',
            'language',
            'primaryLanguage',
            'expireTime',
          ]);
        } else {
          // 其他通知类型不需要校验sendEmails和expireTime字段
          ok = await form.trigger(['type', 'isNow', 'receiveType', 'language', 'primaryLanguage']);
        }
        if (isNow === '0') {
          // 定时发送需要校验sendTime字段，其他的发送方式不需要校验这个字段
          ok = await form.trigger(['sendTime']);
        }
        if (receiveType === '2') {
          ok = await form.trigger(['roles']);
        }
        if (receiveType === '0') {
          ok = await form.trigger(['userIds']);
        }
        if (receiveType === '4') {
          ok = await form.trigger(['tags']);
        }
        if (receiveType === '3') {
          ok = await form.trigger(['accounts']);
        }
        console.log(ok, 'ok');
        if (ok) {
          const selectLang = (form.getValues('language')?.split(',') || []).filter(Boolean);
          const title = form.getValues('title') || {};
          const content = form.getValues('content') || {};
          const titleObj = {} as Record<string, string>;
          const contentObj = {} as Record<string, string>;
          // 因为有编辑和新增所以 对比用户选择的语言和输入的多语言名称，保证每个选择的语言都有对应的名称 即使用户没有输入也要传一个空字符串，避免zod校验出现默认的required错误提示
          selectLang.forEach(key => {
            titleObj[key] = key in title ? title[key] : '';
            contentObj[key] = key in content ? content[key] : '';
          });
          if (mode === 'add') {
            // 新增要把模板中的标题和内容带过来
            if (!form.getValues('template')) {
              return;
            }
            const templateId = form.getValues('template');
            const template = msgTemplateOptions.find(i => i.value === templateId);
            if (template) {
              selectLang.forEach(key => {
                titleObj[key] = template.label;
                contentObj[key] = template.content;
              });
            }
          }
          // 如果是编辑模式不需要模板 只需要把接口返回的数据带到第二步骤就行了 这是原版后台的逻辑
          form.setValue('title', titleObj);
          form.setValue('content', contentObj);
          // 默认激活第一个语言
          setActiveLang(selectLang[0]);
          setStep('two');
        }
        break;
      }
      case 'two':
        // 只校验某些字段 因为如果校验所有的字段 有些字段是根据通知类型动态展示的 可能会出现用户没有输入但也不需要输入的字段被校验导致无法提交的情况
        {
          const ok = await form.trigger(['title', 'content']);
          if (ok) {
            onSubmit(form.getValues());
          }
        }
        break;
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
    setPrimaryLanguageOptions([]);
    setInitialPrimaryLanguage('');
    setStep('one');
  };

  useEffect(() => {
    // 编辑模式 初始数据
    if (mode !== 'edit' || !id) return;
    if (!languageOptions.length) return;
    async function getDetail() {
      try {
        form.reset({
          type: '',
          isNow: '1',
          sendEmails: [],
          expireTime: null,
          receiveType: '1',
          template: '',
          language: '',
          primaryLanguage: '',
          content: {},
          title: {},
        });
        setIsSubmitting(true);
        const res = await getMsg(String(id) || '');
        if (res?.code !== 0) return;
        const languages = res.data.languages || [];
        const primaryLanguage = res.data.msg.primaryLanguage || '';
        // 先算好 options
        const options = languages.map(lang => ({
          label: languageOptions.find(i => i.value === lang)?.label || '',
          value: lang,
        }));
        setPrimaryLanguageOptions(options);
        // 获取内容和标题
        const content = {} as Record<string, string>;
        const title = {} as Record<string, string>;
        res.data.msgLangs.forEach(i => {
          content[i.language ?? 'key'] = i.content ?? '';
          title[i.language ?? 'key'] = i.title ?? '';
        });
        setIsSubmitting(false);
        setInitialPrimaryLanguage(primaryLanguage);
        form.reset({
          type: String(res.data.msg.type),
          isNow: String(res.data.msg.isNow),
          expireTime: res.data.msg.expire ? new Date(res.data.msg.expire) : null,
          receiveType: String(res.data.msg.receiveType),
          sendEmails: res.data.msg.sendEmail ? res.data.msg.sendEmail.split(',') : [],
          language: languages.join(','),
          primaryLanguage: '',
          template: '',
          content: content,
          title: title,
        });
      } catch {
        setIsSubmitting(false);
      }
    }
    getDetail();
  }, [mode, form, id, getMsg, languageOptions, open]);

  // 只所以单独写入primaryLanguage 是因为它的选项依赖于language字段，必须等options准备好之后才能设置值，否则会出现选了语言但主语言选项里没有的情况
  useEffect(() => {
    if (!initialPrimaryLanguage) return;
    if (!primaryLanguageOptions.length) return;
    form.setValue('primaryLanguage', initialPrimaryLanguage);
  }, [form, initialPrimaryLanguage, primaryLanguageOptions]);

  return (
    <RrhDialog
      trigger={trigger || null}
      title={title}
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
            <FormSelect
              name="type"
              label={t('table.infoType')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={infoTypeOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
            />

            <FormField
              name="isNow"
              render={({ field }) => {
                return (
                  <SelectRadio
                    title={t('messageManagement.sendMethod')}
                    verticalLabel
                    field={field}
                    radioItems={[
                      {
                        value: '1',
                        label: t('messageManagement.immediate'),
                      },
                      {
                        value: '0',
                        label: t('messageManagement.scheduled'),
                      },
                    ]}
                  />
                );
              }}
            />
            {/* 邮件通知专属 */}
            {type === '2' ? (
              <FormMultiSelect
                name="sendEmails"
                label={t('table.sendEmailAddress')}
                verticalLabel
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={emailOptions}
              />
            ) : null}

            {/* 定时发送 */}
            {isNow === '0' ? (
              <FormDateInput label={t('table.sendTime')} name="sendTime" showTime />
            ) : null}

            {/* 弹窗通知专属 */}
            {type === '0' ? (
              <FormDateInput label={t('messageManagement.expireTime')} name="expireTime" showTime />
            ) : null}
            {/* 在消息管理 新增修改消息来源 才使用选择接受对象 在customer来源中 默认接受对象就是当前用户 */}
            {source === 'MessageManagementPage' && (
              <FormField
                name="receiveType"
                render={({ field }) => {
                  return (
                    <SelectRadio
                      title={t('table.receiver')}
                      verticalLabel
                      field={field}
                      orientation="horizontal"
                      radioItems={receiveTypeOptions.map(i => ({
                        label: t(i.label),
                        value: i.value,
                      }))}
                    />
                  );
                }}
              />
            )}
            {receiveType === '2' && (
              <FormMultiSelect
                verticalLabel
                name="roles"
                label={t('messageManagement.receiveTypeOption.2')}
                placeholder={t('common.pleaseSelect')}
                options={(RoleRes?.rows || []).map(i => ({
                  label: i.roleName,
                  value: i.roleId,
                }))}
              />
            )}
            {receiveType === '0' && (
              <FormSearchMultiSelect
                verticalLabel
                name="userIds"
                label={t('messageManagement.receiveTypeOption.0')}
                placeholder={t('common.pleaseSelect')}
                fetchOptions={fetchCrmUserOptions}
              />
            )}
            {receiveType === '3' && <SelectUpperDropdown />}

            {receiveType === '4' && (
              <FormSearchMultiSelect
                verticalLabel
                name="tags"
                label={t('messageManagement.receiveTypeOption.4')}
                placeholder={t('common.pleaseSelect')}
                fetchOptions={fetchCrmUserTagsOptions}
              />
            )}

            <FormSelect
              name="template"
              label={t('messageManagement.messageTemplate')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={msgTemplateOptions}
            />

            <FormField
              name="language"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <div className="flex w-full justify-between">
                        <div>{t('messageManagement.sendLanguage')}</div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            className={cn('data-[state=checked]:border-slate-700')}
                            checked={
                              language?.length ===
                              languageOptions.map(i => i.value).join(',')?.length
                            }
                            onCheckedChange={() => {
                              if (
                                language?.length ===
                                languageOptions.map(i => i.value).join(',')?.length
                              ) {
                                field.onChange('');
                                setPrimaryLanguageOptions([]);
                              } else {
                                field.onChange(languageOptions.map(i => i.value).join(','));
                                setPrimaryLanguageOptions(languageOptions);
                              }
                              form.setValue('primaryLanguage', '');
                            }}
                            aria-label="Select row"
                          />
                          <span>{t('common.selectAll')}</span>
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <RrhCheckBoxGroup
                        onValueChange={v => {
                          field.onChange(v);
                          // 把选中的语言设置进primaryLanguage的选项里
                          setPrimaryLanguageOptions(
                            languageOptions.filter(i => v.includes(i.value)),
                          );
                          form.setValue('primaryLanguage', '');
                        }}
                        value={field.value}
                        checkItems={languageOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormSelect
              name="primaryLanguage"
              label={t('messageManagement.mainLanguage')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={primaryLanguageOptions}
            />
          </div>
        </div>

        {step === 'two' && language?.length ? (
          <>
            <RrhSwitchGroup
              value={activeLang}
              onValueChange={value => {
                setActiveLang(value);
              }}
              labelClassName="font-medium"
              switchItems={language?.split(',').map(lang => {
                const label = languageOptions.find(o => o.value === lang)?.label || '';
                return {
                  value: lang,
                  label,
                };
              })}
            />
            <div>
              {(language.split(',') || []).map(lang => {
                const label = languageOptions.find(o => o.value === lang)?.label || '';
                return (
                  <div key={lang} className={cn(activeLang === lang ? 'block' : 'hidden')}>
                    <div className="py-6">
                      <FormInput
                        name={`title.${lang}`}
                        label={t('messageManagement.inputTitle', { field: label })}
                        placeholder={t('common.pleaseInput', { field: t('table.title') })}
                        maxLength={64}
                      />
                    </div>
                    <div className="py-6">
                      <FormField
                        name={`content.${lang}`}
                        render={({ field }) => {
                          return (
                            <RichTextEditor
                              field={field}
                              title={t('messageManagement.inputContent', { field: label })}
                              placeholder={t('common.pleaseInput', {
                                field: t('table.content'),
                              })}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </RrhForm>
    </RrhDialog>
  );
};
