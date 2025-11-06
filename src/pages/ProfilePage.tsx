import { useUserStore } from '@/store/userStore';
import { useTranslation } from 'react-i18next';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <div>
        <img src={user?.avatar} alt="" />
        <p>{t('profile.uploadAvatar')}</p>
      </div>
      <div>{(user?.userLastName || '') + (user?.userName || '')}</div>
      {user?.phonenumber && (
        <div>
          {t('CRMAccountPage.Mobile')}: {`+${(user?.mzone || '') + user?.phonenumber}`}{' '}
        </div>
      )}
      {user?.email && (
        <div>
          {t('loginPage.email')}: {user?.email}
        </div>
      )}
      <div>{t('loginPage.password')}: ******</div>
      <div>{t('profile.gooleKey')}： 已绑定 解绑</div>
    </div>
  );
};
