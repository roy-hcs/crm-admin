import { LanguageSwitcher } from '@/components/layouts/components/LanguageSwitcher';
import { LoginForm } from '@/components/LoginForm';
import { useTabStore } from '@/store/tabStore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<1 | 2>(2); // 1 for phone, 2 for email
  const { closeAllTabs } = useTabStore();
  useEffect(() => {
    closeAllTabs();
  }, [closeAllTabs]);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <LanguageSwitcher showLabel={false} className="absolute top-2 right-1" />
        <div>
          <h2 className="text-center text-2xl leading-normal font-bold text-gray-900">
            {t('loginPage.WelcomeBack')}
          </h2>
          <p className="text-sm leading-5">
            {loginType === 2
              ? t('loginPage.EnterYourEmailBelowToSignInYourAccount')
              : t('loginPage.EnterYourMobileBelowToSignInYourAccount')}
          </p>
        </div>
        <LoginForm loginType={loginType} setLoginType={setLoginType} />
      </div>
    </div>
  );
}
