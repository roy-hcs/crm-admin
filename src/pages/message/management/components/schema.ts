import { TFunction } from 'i18next';
import * as z from 'zod';

export type FormValues = {
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

export const buildSchema = (t: TFunction<'translation', undefined>) => {
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
