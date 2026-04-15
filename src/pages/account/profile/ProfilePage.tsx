import {
  useGetGoogleBindInfo,
  useGetMyInfo,
  useUpdateUserAvatar,
  useUpdateUserProfile,
  useUploadFile,
} from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { Check, PencilLine, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadAvatarDialog } from './components/UploadAvatarDialog';
import { useForm } from 'react-hook-form';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { Form } from '@/components/ui/form';
import { BindNewEmailDialog } from './components/BindNewEmailDialog';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';
import { BindNewPhoneDialog } from './components/BindNewPhoneDialog';
import { GoogleKeyDialog } from './components/GoogleKeyDialog';
import { toast } from 'sonner';

const FileType = ['image/jpeg', 'image/png', 'image/gif'];

type FormValue = {
  userLastName: string;
  userName: string;
};

export const ProfilePage = () => {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const { data: myInfo, isLoading, refetch } = useGetMyInfo();
  const { data: googleBindInfo } = useGetGoogleBindInfo();
  const qrCodeValue = googleBindInfo?.data?.code || '';
  const key = googleBindInfo?.data?.key || '';
  const { mutateAsync: updateUserAvatar } = useUpdateUserAvatar();
  const { mutateAsync: uploadFunc } = useUploadFile();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();
  const userInfo = myInfo?.data?.user;

  const form = useForm<FormValue>({
    defaultValues: {
      userLastName: '',
      userName: '',
    },
  });

  const handleUpdateUserAvatar = async (file: File) => {
    // 上传成功后，更新头像预览 发送请求更新头像
    if (!file) return;
    try {
      const urlRes = await uploadFunc(file);
      if (urlRes?.code != 0) {
        toast.error(t('common.AnErrorOccurred'));
        return;
      }
      const res = await updateUserAvatar({
        filePath: urlRes?.url || '',
      });
      if (res?.code === 0) {
        toast.success(res?.msg || t('common.success'));
        refetch();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleCancelEdit = () => {
    setEdit(false);
  };

  const handleInitEdit = () => {
    form.reset({
      userLastName: userInfo?.userLastName || '',
      userName: userInfo?.userName || '',
    });
    setEdit(true);
  };

  const handleChangeName = async () => {
    const values = form.getValues();
    if (
      values.userLastName === (userInfo?.userLastName || '') &&
      values.userName === (userInfo?.userName || '')
    ) {
      return;
    }
    try {
      const res = await updateUserProfile(values);
      if (res?.code === 0) {
        toast.success(res?.msg || t('common.success'));
        handleCancelEdit();
        refetch();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleOnSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  return (
    <div className="grid gap-3 md:mx-0 md:w-full md:gap-6 xl:mx-auto xl:w-192">
      <div className="text-foreground text-2xl leading-8 font-semibold">{t('profile.title')}</div>
      <RrhCard>
        <div className="flex gap-6">
          <img
            src={userInfo?.avatar || ''}
            alt={t('profile.avatarTips')}
            className="size-20 rounded-full"
          />
          <div className="grid gap-2">
            <div>{t('profile.avatarTips')}</div>
            <div>{t('profile.avatarUploadTips')}</div>
            <div>
              <UploadAvatarDialog onSuccess={handleUpdateUserAvatar} FileType={FileType} />
            </div>
          </div>
        </div>
      </RrhCard>
      <RrhCard>
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="text-foreground text-lg leading-4.5 font-semibold">
              {t('profile.basicInfo')}
            </div>
            <div>
              {edit ? (
                <div className="grid grid-cols-2 gap-2">
                  <RrhButton
                    variant="ghost"
                    className="size-8 border"
                    Icon={<X className="size-4" />}
                    onClick={handleCancelEdit}
                  />
                  <RrhButton
                    type="button"
                    className="size-8"
                    Icon={<Check className="size-4" />}
                    onClick={handleChangeName}
                  />
                </div>
              ) : (
                <PencilLine
                  className="text-muted-foreground size-4 cursor-pointer"
                  onClick={handleInitEdit}
                />
              )}
            </div>
          </div>
          <FormProvider form={form}>
            <Form {...form}>
              <form>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    {edit ? (
                      <FormInput
                        name="userLastName"
                        label={t('CRMAccountPage.lastName')}
                        verticalLabel
                        placeholder={t('rules.limitLength', { field: 32 })}
                        maxLength={32}
                      />
                    ) : (
                      <LabelItem
                        label={t('CRMAccountPage.lastName')}
                        ContentDom={<InfoItem info={userInfo?.userLastName || ''} />}
                      />
                    )}
                  </div>
                  <div>
                    {edit ? (
                      <FormInput
                        name="userName"
                        label={t('CRMAccountPage.firstName')}
                        verticalLabel
                        placeholder={t('rules.limitLength', { field: 32 })}
                        maxLength={32}
                      />
                    ) : (
                      <LabelItem
                        label={t('CRMAccountPage.firstName')}
                        ContentDom={<InfoItem info={userInfo?.userName || ''} />}
                      />
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </FormProvider>
        </div>
      </RrhCard>
      <RrhCard>
        <div className="grid gap-6">
          <div className="text-foreground text-lg leading-4.5 font-semibold">
            {t('profile.securitySettings')}
          </div>
          <div>
            {userInfo?.phonenumber && (
              <div className="mb-3 flex justify-between border-b-1 pb-3">
                <div>
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('table.mobile')}
                  </div>
                  <div>{`+${userInfo?.mzone} ${userInfo.phonenumber}`}</div>
                </div>
                <div>
                  <BindNewPhoneDialog onSuccess={handleOnSuccess} />
                </div>
              </div>
            )}
            {userInfo?.email && (
              <div className="mb-3 flex justify-between border-b-1 pb-3">
                <div>
                  <div className="text-foreground text-sm leading-5 font-medium">
                    {t('table.email')}
                  </div>
                  <div>{userInfo?.email}</div>
                </div>
                <div>
                  <BindNewEmailDialog onSuccess={handleOnSuccess} />
                </div>
              </div>
            )}
            <div className="mb-3 flex justify-between border-b-1 pb-3">
              <div>
                <div>{t('rules.pwd')}</div>
                <div>******</div>
              </div>
              <div>
                <ChangePasswordDialog onSuccess={handleOnSuccess} />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <div>{t('profile.gooleKey')}</div>
                <div>{key ? t('common.notBind') : t('common.bind')}</div>
              </div>
              <div>
                <GoogleKeyDialog qrCodeValue={qrCodeValue} key={key} onSuccess={handleOnSuccess} />
              </div>
            </div>
          </div>
        </div>
      </RrhCard>
    </div>
  );
};
