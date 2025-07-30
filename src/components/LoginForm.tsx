import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
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

// TODO: warn text should support i18n
const emailSchema = z.object({
  username: z.string().min(1, 'email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
  type: z.number().min(1, 'type is required'),
});

const phoneSchema = z.object({
  username: z.string().min(1, 'phone is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
  type: z.number().min(1, 'type is required'),
});

type LoginFormValues = z.infer<typeof emailSchema | typeof phoneSchema>;

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
    resolver: zodResolver(loginType === 2 ? emailSchema : phoneSchema),
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
      console.log(res, 'login data');
      if (res.code === 0 && res.data) {
        localStorage.setItem('publicKey', res.data?.pubKey);
        navigate('/');
      } else {
        toast.error(res.msg || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed, please try again later.');
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
                  {loginType === 1 ? t('mobile') : t('email')}
                </FormLabel>
                <FormControl>
                  {loginType === 1 ? (
                    <div className="relative">
                      <Input placeholder="Enter your cellphone" {...field} className="flex-1" />
                      <CountryCode
                        value={countryCode}
                        onValueChange={setCountryCode}
                        disabled={loginMutation.isPending}
                        className="absolute top-1/2 right-0 w-[85px] -translate-y-1/2 border-none shadow-none"
                      />
                    </div>
                  ) : (
                    <Input placeholder="Enter your username" {...field} />
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
                  <FormLabel className="capitalize">{t('password')}</FormLabel>
                  <button type="button" className="cursor-pointer text-sm">
                    {t('forget')}
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
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormHiddenInput name="type" value={loginType} control={form.control} />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t('logging in...') : t('login')}
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer capitalize"
            disabled={loginMutation.isPending}
            onClick={() => setLoginType(loginType === 1 ? 2 : 1)}
          >
            {t('Login with', { method: loginType === 1 ? 'email' : 'mobile' })}
          </Button>

          {loginMutation.isError && (
            <div className="mt-2 text-red-500">Login failed: {String(loginMutation.error)}</div>
          )}
        </form>
      </Form>
    </div>
  );
};
