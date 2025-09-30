import { RrhPureLogo } from '@/components/icons/RrhPureLogo';
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
      <RrhPureLogo logoColor="black" className="mb-16 hidden md:block" />
      <div className="bg-background relative h-screen w-full max-w-md space-y-8 rounded-lg px-10 pt-40 shadow-md md:h-auto md:py-10">
        <RrhPureLogo logoColor="black" className="absolute top-4 left-3 md:hidden" />
        <LanguageSwitcher showLabel={false} className="absolute top-2 right-1" />

        <div>
          <h2 className="text-center text-2xl leading-normal font-bold text-gray-900">
            {t('loginPage.WelcomeBack')}
          </h2>
          <p className="mt-3 text-center text-sm leading-5">
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
