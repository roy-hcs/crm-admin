import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormHiddenInput } from './form/FormHiddenInput';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryCode } from './common/CountryCode';
import { Eye, EyeClosed } from 'lucide-react';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import md5 from 'blueimp-md5';
import Hex from 'crypto-js/enc-hex';
import { useLogin, useLoginConfig } from '@/api/hooks/users/users';
import { TFunction } from 'i18next';
import { RrhButton } from './common/RrhButton';

const emailSchema = (t: TFunction<'translation', undefined>) => {
  return z.object({
    username: z
      .string()
      .min(1, t('rules.required', { field: t('loginPage.email') }))
      .email(t('rules.pattern', { field: t('loginPage.email') })),
    password: z.string().min(1, t('rules.required', { field: t('loginPage.password') })),
    rememberMe: z.boolean(),
    type: z.number().min(1, 'type is required'),
  });
};

const phoneSchema = (t: TFunction<'translation', undefined>) => {
  return z.object({
    username: z.string().min(1, t('rules.required', { field: t('loginPage.mobile') })),
    password: z.string().min(1, t('rules.required', { field: t('loginPage.password') })),
    rememberMe: z.boolean(),
    type: z.number().min(1, t('rules.required', { field: 'type' })),
  });
};

type LoginFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
  type: number;
};

export const LoginForm = ({
  loginType,
  setLoginType,
}: {
  loginType: 1 | 2;
  setLoginType: (type: 1 | 2) => void;
}) => {
  const [countryCode, setCountryCode] = useState('+86');
  const [showPWD, setShowPWD] = useState(false);
  const [secretKey, setSecretKey] = useState<string>('');
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { data: loginConfig } = useLoginConfig();
  const { t } = useTranslation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginType === 2 ? emailSchema(t) : phoneSchema(t)),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
      type: loginType,
    },
  });

  useEffect(() => {
    if (loginConfig?.code === 0) {
      setSecretKey(loginConfig.data || '');
    }
  }, [loginConfig]);

  const encryptPassword = useCallback((password: string, secretKey: string): string => {
    const passwordMd5 = md5(password.trim());
    const key = Utf8.parse(secretKey);
    const source = Utf8.parse(passwordMd5);
    const encrypted = AES.encrypt(source, key, {
      mode: ECB,
      padding: Pkcs7,
    });
    return Hex.stringify(encrypted.ciphertext);
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const submittedValues = { ...values };
      if (loginType === 1) {
        submittedValues.username = `${countryCode}${values.username}`;
      }
      submittedValues.password = encryptPassword(values.password, secretKey);
      // submittedValues.googleCode = '';
      const res = await loginMutation.mutateAsync(submittedValues);
      if (res.code === 0 && res.data) {
        localStorage.setItem('publicKey', res.data?.pubKey);
        navigate('/');
      } else {
        toast.error(res.msg || t('loginPage.LoginFailedPleaseTryAgainLater'));
      }
    } catch (error) {
      toast.error(t('loginPage.LoginFailedPleaseTryAgainLater'));
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  {loginType === 1 ? t('loginPage.mobile') : t('loginPage.email')}
                </FormLabel>
                <FormControl>
                  {loginType === 1 ? (
                    <div className="relative">
                      <Input
                        placeholder={t('loginPage.EnterYourCellphone')}
                        {...field}
                        className="flex-1"
                      />
                      <CountryCode
                        value={countryCode}
                        onValueChange={setCountryCode}
                        disabled={loginMutation.isPending}
                        className="absolute top-1/2 right-0 w-[85px] -translate-y-1/2 border-none shadow-none"
                      />
                    </div>
                  ) : (
                    <Input placeholder={t('loginPage.EnterYourUserName')} {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel className="capitalize">{t('loginPage.password')}</FormLabel>
                  <button type="button" className="cursor-pointer text-sm">
                    {t('loginPage.forgetPWD')}
                  </button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPWD ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPWD(!showPWD)}
                    >
                      {showPWD ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={checked => field.onChange(checked === true)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('loginPage.RememberMe')}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormHiddenInput name="type" value={loginType} control={form.control} />

          <RrhButton
            type="submit"
            className="w-full cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t('loginPage.logging') : t('loginPage.login')}
          </RrhButton>
          <RrhButton
            type="button"
            className="w-full cursor-pointer capitalize"
            disabled={loginMutation.isPending}
            onClick={() => setLoginType(loginType === 1 ? 2 : 1)}
          >
            {t('loginPage.LoginWith', {
              method: loginType === 1 ? t('loginPage.email') : t('loginPage.mobile'),
            })}
          </RrhButton>

          {loginMutation.isError && (
            <div className="mt-2 text-red-500">
              {t('loginPage.loginFailed')} {String(loginMutation.error)}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
