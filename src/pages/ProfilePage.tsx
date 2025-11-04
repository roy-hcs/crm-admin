import { useGetUserInfo } from '@/api/hooks/system/system';
import { useTranslation } from 'react-i18next';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { data: userData } = useGetUserInfo();
  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <div>
        <img src={userData?.user.avatar} alt="" />
        <p>{t('profile.uploadAvatar')}</p>
      </div>
      <div>{(userData?.user.userLastName || '') + (userData?.user.userName || '')}</div>
      {userData?.user.phonenumber && (
        <div>
          {t('CRMAccountPage.Mobile')}:{' '}
          {`+${(userData?.user.mzone || '') + userData?.user.phonenumber}`}{' '}
        </div>
      )}
      {userData?.user.email && (
        <div>
          {t('loginPage.email')}: {userData?.user.email}
        </div>
      )}
      <div>{t('loginPage.password')}: ******</div>
      <div>{t('profile.gooleKey')}： 已绑定 解绑</div>
    </div>
  );
};
