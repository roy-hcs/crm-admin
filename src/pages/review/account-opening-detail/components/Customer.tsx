import { useGetEmailConfig, useMsgTemplateList } from '@/api/hooks/message';
import { OpenReviewDetailRes } from '@/api/hooks/review';
import { useDictType } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { ResetPassword } from '@/pages/account/crm-accounts/components/ResetPassword';
import { AddEditNewMessageDialog } from '@/pages/message/management/components/AddEditNewMessageDialog';
import { CircleCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type DialogType = 'password' | 'fundPassword' | 'sendMsg' | null;

export const Customer = ({ openInfo }: { openInfo: OpenReviewDetailRes['data'] }) => {
  const crmUser = openInfo?.crmUser;
  const lastLogininfor = openInfo?.lastLogininfor;
  const userLanguage = openInfo?.userLanguage;
  const riskScore = openInfo?.lastLogininfor?.riskScore || 0;
  const { t } = useTranslation();
  const [open, setOpen] = useState<DialogType>(null);
  const { data: languageList, isLoading: languageLoading } = useDictType('sys_language');
  const { data: emailList, isLoading: emailListLoading } = useGetEmailConfig();
  const { data: msgTemplateList, isLoading: msgTemplateListLoading } = useMsgTemplateList({});

  const userInfo = useMemo(() => {
    return [
      {
        label: t('table.mobile'),
        value: `+${crmUser?.mzone} ${crmUser?.mobile || '-'}`,
      },
      {
        label: t('table.email'),
        value: crmUser?.email || '-',
      },
      {
        label: t('table.role'),
        value: crmUser?.role || '-',
      },
      {
        label: t('table.countryOrRegion'),
        value: crmUser?.countryName || '-',
      },
      {
        label: t('CRMAccountPage.CRMAccountType'),
        value: crmUser?.accountTypeStr || '-',
      },
      {
        label: t('table.productSource'),
        value: crmUser?.registerSourceText || '-',
      },
      {
        label: t('rules.preferenceLanguage'),
        value: userLanguage || '-',
      },
      {
        label: t('CRMAccountPage.ColorPreferences'),
        value: [1, 2].includes(Number(crmUser?.colorPreference))
          ? Number(crmUser?.colorPreference) === 1
            ? t('common.colorPreference.redUp')
            : t('common.colorPreference.greenUp')
          : '-',
      },
      {
        label: t('CRMAccountPage.registerTime'),
        value: crmUser?.createTime || '-',
      },
      {
        label: t('accountOpening.lastLogin'),
        value: crmUser?.lastLoginTime || '-',
      },
    ];
  }, [crmUser, userLanguage, t]);

  const languageOptions = useMemo(
    () =>
      languageList?.map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })) || [],
    [languageList],
  );

  const emailOptions = useMemo(
    () =>
      emailList?.data?.map(i => ({
        label: i.email,
        value: i.id,
      })) || [],
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

  if (languageLoading || emailListLoading || msgTemplateListLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  return (
    <RrhCard>
      <div className="grid gap-6">
        <div className="flex gap-2">
          <div className="size-12 overflow-hidden rounded-full">
            <img src={crmUser?.headImg || ''} alt="" />
          </div>
          <div className="grid flex-1 gap-1.5">
            <div className="flex h-6 items-center gap-2">
              <div className="text-foreground h-6 text-base leading-6 font-semibold">
                {crmUser?.userName}
              </div>
              <div className="bg-primary-foreground text-foreground flex h-4 items-center justify-center rounded-md px-2 text-xs leading-4 font-medium">
                {crmUser?.role}
              </div>
            </div>
            <div className="text-muted-foreground h-3 text-xs leading-3">ID:{crmUser?.showId}</div>
          </div>
        </div>
        <div className="bg-primary-foreground cursor-pointer rounded-md p-3">
          <div className="text-foreground text-xs">{crmUser?.adminRemark}</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-foreground h-5 text-sm leading-5 font-medium">
              {t('accountOpening.lastLogin')}
            </div>
            <div className="bg-background flex items-center justify-center gap-1 rounded-2xl border px-2 py-0.5">
              <CircleCheck className="size-2.5 text-green-600" />
              <div className="text-xs leading-4 font-medium text-green-600">
                {riskScore >= 90 && 'High'}
                {riskScore >= 70 && riskScore < 90 && 'Medium'}
                {riskScore >= 40 && riskScore < 70 && 'Low'}
                {(riskScore === 0 || riskScore < 40) && 'Lowest'}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground mt-2 mb-1 text-sm leading-5">
            {crmUser.lastLoginTime}
          </div>
          <div className="text-muted-foreground text-sm leading-5">{`${lastLogininfor.operIp} ${lastLogininfor.operLocation}`}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <RrhButton
            onClick={() => setOpen('sendMsg')}
            variant="outline"
            type="button"
            className="w-full cursor-pointer capitalize"
          >
            {t('accountOpening.sendInformation')}
          </RrhButton>
          <RrhButton
            onClick={() => setOpen('password')}
            variant="outline"
            type="button"
            className="w-full cursor-pointer capitalize"
          >
            {t('common.resetPassword')}
          </RrhButton>
          <RrhButton
            onClick={() => setOpen('fundPassword')}
            variant="outline"
            type="button"
            className="w-full cursor-pointer capitalize"
          >
            {t('common.resetFundPassword')}
          </RrhButton>
        </div>
        <div className="bg-primary-foreground rounded-md px-4 py-2">
          {userInfo.map(i => (
            <div key={i.value} className="grid gap-1 py-1.5">
              <div className="text-muted-foreground text-sm leading-5">{i.label}</div>
              <div className="text-foreground text-sm leading-5 font-medium">{i.value}</div>
            </div>
          ))}
        </div>
      </div>
      <ResetPassword
        id={crmUser?.id || ''}
        type="password"
        title={t('common.resetPassword')}
        isResetDialogOpen={open === 'password'}
        setIsResetDialogOpen={(val: boolean) => {
          if (!val) setOpen(null);
        }}
      />
      <ResetPassword
        id={crmUser?.id || ''}
        type="fundPassword"
        title={t('common.resetFundPassword')}
        isResetDialogOpen={open === 'fundPassword'}
        setIsResetDialogOpen={(val: boolean) => {
          if (!val) setOpen(null);
        }}
      />

      <AddEditNewMessageDialog
        source="Customer"
        mode="add"
        crmUserId={crmUser?.id || ''}
        title={t('accountOpening.sendInformation')}
        onSuccess={() => {
          console.log('success');
        }}
        open={open === 'sendMsg'}
        onOpenChange={v => {
          if (!v) setOpen(v ? 'sendMsg' : null);
        }}
        languageOptions={languageOptions}
        emailOptions={emailOptions}
        msgTemplateOptions={msgTemplateOptions}
      />
    </RrhCard>
  );
};
