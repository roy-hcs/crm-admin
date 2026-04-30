import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { useGetEmailConfig, useMsgAdd, useMsgEdit, useMsgTemplateList } from '@/api/hooks/message';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { RrhForm } from '@/components/form/RrhForm';
import { FormValues, buildSchema } from './schema';
import { useEditMsgFormInit } from './useEditMsgFormInit';
import { StepOneFields } from './StepOneFields';
import { StepTwoFields } from './StepTwoFields';

// ─── AddEditNewMessageDialog ──────────────────────────────────────────────────
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
}: {
  mode: 'add' | 'edit';
  title: string;
  trigger?: React.ReactNode;
  source?: 'MessageManagementPage' | 'Customer';
  crmUserId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  languageOptions: Array<{ label: string; value: string }>;
}) => {
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

  // Fetch emailOptions and msgTemplateOptions inside the dialog to avoid
  // unnecessary requests when the dialog is never opened.
  const { data: emailList } = useGetEmailConfig();
  const { data: msgTemplateList } = useMsgTemplateList({});

  const emailOptions = useMemo(
    () => emailList?.data?.map(i => ({ label: i.email, value: i.id })) || [],
    [emailList],
  );

  const msgTemplateOptions = useMemo(
    () =>
      msgTemplateList?.rows?.map(i => ({
        label: i.title || '',
        value: i.id || '',
        content: i.content || '',
      })) || [],
    [msgTemplateList?.rows],
  );

  const schema = useMemo(
    () =>
      z.object(buildSchema(t)).superRefine((data, ctx) => {
        const langs = data?.language?.split(',') || [];
        if (step === 'two') {
          langs.forEach(lang => {
            const content = data.content?.[lang];
            const title = data.title?.[lang];
            // 因为富文本编辑器的内容即使没有输入也会有<p></p>这样的标签，所以需要特殊判断一下
            if ((content || '').trim() === '' || content === '<p></p>') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('rules.required', { field: t('table.content') }),
                path: ['content', lang],
              });
            }
            if ((title || '').trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('rules.required', { field: t('table.title') }),
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

  const type = form.watch('type');
  const isNow = form.watch('isNow');
  const language = form.watch('language');
  const receiveType = form.watch('receiveType');

  useEditMsgFormInit({
    mode,
    id,
    open,
    languageOptions,
    form,
    setPrimaryLanguageOptions,
    setInitialPrimaryLanguage,
    setIsSubmitting,
  });

  // 只所以单独写入primaryLanguage 是因为它的选项依赖于language字段，必须等options准备好之后才能设置值，否则会出现选了语言但主语言选项里没有的情况
  useEffect(() => {
    if (!initialPrimaryLanguage) return;
    if (!primaryLanguageOptions.length) return;
    form.setValue('primaryLanguage', initialPrimaryLanguage);
  }, [form, initialPrimaryLanguage, primaryLanguageOptions]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const msgLangs = (data.language?.split(',') || []).map(lang => ({
        content: data.content?.[lang] || '',
        title: data.title?.[lang] || '',
        language: lang,
      }));
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
          <StepOneFields
            source={source}
            languageOptions={languageOptions}
            emailOptions={emailOptions}
            msgTemplateOptions={msgTemplateOptions}
            primaryLanguageOptions={primaryLanguageOptions}
            setPrimaryLanguageOptions={setPrimaryLanguageOptions}
            form={form}
          />
        </div>

        {step === 'two' && language?.length ? (
          <StepTwoFields
            language={language}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            languageOptions={languageOptions}
          />
        ) : null}
      </RrhForm>
    </RrhDialog>
  );
};
