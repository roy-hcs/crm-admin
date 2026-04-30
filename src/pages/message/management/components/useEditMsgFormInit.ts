import { useMsgDetail } from '@/api/hooks/message';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './schema';

export function useEditMsgFormInit({
  mode,
  id,
  open,
  languageOptions,
  form,
  setPrimaryLanguageOptions,
  setInitialPrimaryLanguage,
  setIsSubmitting,
}: {
  mode: 'add' | 'edit';
  id?: string;
  open: boolean;
  languageOptions: Array<{ label: string; value: string }>;
  form: UseFormReturn<FormValues>;
  setPrimaryLanguageOptions: (opts: Array<{ label: string; value: string }>) => void;
  setInitialPrimaryLanguage: (lang: string) => void;
  setIsSubmitting: (v: boolean) => void;
}) {
  const { mutateAsync: getMsg } = useMsgDetail();

  useEffect(() => {
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
  }, [mode, form, id, getMsg, languageOptions, open]); // eslint-disable-line react-hooks/exhaustive-deps
}
