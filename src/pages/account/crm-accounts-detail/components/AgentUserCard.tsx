import { useState } from 'react';
import { useEditCrmUserInfo } from '@/api/hooks/system/system';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Input } from '@/components/ui/input';
import { useTabActions } from '@/hooks/useTabActions';
import { ChevronRight, PencilLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { crmAccountTypeOptions } from '@/lib/const';
import mobileZone from '@/data/mzone.json';
import { ResetPassword } from '../../crm-accounts/components/ResetPassword';
import { AddEditNewMessageDialog } from '@/pages/message/management/components/AddEditNewMessageDialog';
import { EditRemarkDialog } from './EditRemarkDialog';
import { Country, CrmUser, InfoTypeItem, Role } from '@/api/hooks/system';
import { RiskBadge } from '@/components/common/RiskBadge';
import { OperationsLogsItem } from '@/api/hooks/monitor/type';

type DialogType = 'password' | 'fundPassword' | 'sendMsg' | null;

type FormValues = {
  name: string;
  lastName: string;
  roleId: string;
  email: string;
  mzone: string;
  mobile: string;
  country: string;
  accountType: string;
  preferenceLanguage: string;
  colorPreference: string;
};

export const AgentUserCard = ({
  crmUser,
  roles,
  languages,
  countries,
  refetch,
  userInviter,
  lastLoginInfo,
}: {
  crmUser: CrmUser;
  roles: Role[];
  languages: InfoTypeItem[];
  countries: Country[];
  refetch: () => void;
  userInviter: string;
  lastLoginInfo: OperationsLogsItem | null;
}) => {
  const { t } = useTranslation();
  // const { data: profileRes, refetch } = useGetUserProfile(userId);
  const { openTab } = useTabActions();
  const { mutate: editCrmUserInfo } = useEditCrmUserInfo();

  // const userProfileData = profileRes?.data;
  const [open, setOpen] = useState<DialogType>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    lastName: '',
    roleId: '',
    email: '',
    mzone: '',
    mobile: '',
    country: '',
    accountType: '',
    preferenceLanguage: '',
    colorPreference: '',
  });

  const handleToggleEdit = () => {
    if (!isEditable && crmUser) {
      setFormValues({
        name: crmUser.name || '',
        lastName: crmUser.lastName || '',
        roleId: crmUser.roleId || '',
        email: crmUser.email || '',
        mzone: crmUser.mzone ? `+${crmUser.mzone}` : '',
        mobile: crmUser.mobile || '',
        country: crmUser.country || '',
        accountType: crmUser.accountType?.toString() || '',
        preferenceLanguage: crmUser.preferenceLanguage || '',
        colorPreference: crmUser.colorPreference?.toString() || '',
      });
    }
    setIsEditable(prev => !prev);
  };

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleConfirm = () => {
    if (!crmUser?.id) return;
    editCrmUserInfo(
      {
        id: crmUser.id,
        status: crmUser.status ?? 0,
        lastName: formValues.lastName,
        name: formValues.name,
        roleId: formValues.roleId,
        country: formValues.country,
        email: formValues.email,
        mzone: formValues.mzone,
        mobile: formValues.mobile,
        preferenceLanguage: formValues.preferenceLanguage,
        colorPreference: Number(formValues.colorPreference),
        inviter: crmUser.inviter || '',
        accountType: formValues.accountType,
      },
      {
        onSuccess: () => {
          refetch();
          setIsEditable(false);
        },
      },
    );
  };

  const set = (key: keyof FormValues) => (val: string) => {
    let newVal = val;
    if (key === 'mzone') {
      newVal = val.split('-')[0];
    }
    setFormValues(prev => ({ ...prev, [key]: newVal }));
  };

  const roleOptions = roles.map(r => ({
    label: r.roleName || '',
    value: r.roleId || '',
  }));

  const countryOptions = countries.map(c => ({
    label: c.countryName,
    value: c.id.toString(),
  }));

  const languageOptions = languages.map(l => ({
    label: l.dictLabel || '',
    value: l.dictValue || '',
  }));

  const colorOptions = [
    { label: t('common.colorPreference.redUp'), value: '1' },
    { label: t('common.colorPreference.greenUp'), value: '2' },
  ];

  const accountTypeOptions: { label: string; value: string }[] = crmAccountTypeOptions.map(i => ({
    label: t(i.label),
    value: i.value,
  }));
  const mzoneOptions: { label: string; value: string }[] = mobileZone.mzone.map((item, index) => {
    return {
      label: `${item.area} ${item.code}`,
      value: `${item.code}-${index}`,
    };
  });
  return (
    <>
      <RrhCard className="flex flex-col gap-6">
        <div className="flex gap-2">
          <img
            src={crmUser.headImg || ''}
            alt={crmUser.userName || ''}
            className="size-12 rounded-full"
            loading="lazy"
          />
          <div>
            {!isEditable && (
              <div className="mb-1.5 flex gap-2">
                <span>{crmUser.userName || ''}</span>
                <span className="bg-accent rounded-2xl px-2 pt-0.5">{crmUser.role}</span>
                <RrhButton variant="ghost" className="size-6 p-0" onClick={handleToggleEdit}>
                  <PencilLine className="size-4" />
                </RrhButton>
              </div>
            )}
            <div className="flex items-center gap-2">ID: {crmUser.showId}</div>
          </div>
        </div>
        {crmUser.adminRemark && (
          <div className="bg-accent flex items-center justify-between rounded-md px-3 py-1">
            <span>{crmUser.adminRemark}</span>
            <RrhButton variant="ghost" className="size-6 p-0" onClick={() => setEditOpen(true)}>
              <PencilLine className="size-4" />
            </RrhButton>
          </div>
        )}
        <div>
          <RiskBadge riskScore={lastLoginInfo?.riskScore || 0} />
          <div className="mt-2">{crmUser.lastLoginTime}</div>
          <div className="mt-2">
            <span>{lastLoginInfo?.operIp}</span>
            {lastLoginInfo?.operLocation && <span> ({lastLoginInfo.operLocation})</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <RrhButton variant="outline" className="font-medium" onClick={() => setOpen('sendMsg')}>
            {t('accountOpening.sendInformation')}
          </RrhButton>
          <RrhButton variant="outline" className="font-medium" onClick={() => setOpen('password')}>
            {t('common.resetPassword')}
          </RrhButton>
          <RrhButton
            variant="outline"
            className="font-medium"
            onClick={() => setOpen('fundPassword')}
          >
            {t('common.resetFundPassword')}
          </RrhButton>
        </div>
        <div className="bg-accent rounded-md px-4 py-2">
          {isEditable && (
            <>
              <LabelItem
                label={t('CRMAccountPage.firstName')}
                ContentDom={
                  <Input
                    value={formValues.name}
                    onChange={e => set('name')(e.target.value)}
                    className="bg-background h-9"
                  />
                }
              />
              <LabelItem
                label={t('CRMAccountPage.lastName')}
                ContentDom={
                  <Input
                    value={formValues.lastName}
                    onChange={e => set('lastName')(e.target.value)}
                    className="bg-background h-9"
                  />
                }
              />
            </>
          )}
          <LabelItem
            label={t('table.mobile')}
            ContentDom={
              isEditable ? (
                <div className="flex gap-2">
                  <RrhSelect
                    options={mzoneOptions}
                    value={formValues.mzone}
                    onValueChange={set('mzone')}
                    className="w-28"
                    placeholder="+code"
                  />
                  <Input
                    value={formValues.mobile}
                    onChange={e => set('mobile')(e.target.value)}
                    className="bg-background h-9 flex-1"
                  />
                </div>
              ) : (
                <InfoItem info={`+${crmUser.mzone} ${crmUser.mobile}`} />
              )
            }
          />
          <LabelItem
            label={t('table.email')}
            ContentDom={
              isEditable ? (
                <Input
                  value={formValues.email}
                  onChange={e => set('email')(e.target.value)}
                  className="bg-background h-9"
                />
              ) : (
                <InfoItem info={crmUser.email || ''} />
              )
            }
          />
          <LabelItem
            label={t('table.role')}
            ContentDom={
              isEditable ? (
                <RrhSelect
                  options={roleOptions}
                  value={formValues.roleId}
                  onValueChange={set('roleId')}
                  showRowValue={false}
                  className="w-full"
                  placeholder={t('common.pleaseSelect')}
                />
              ) : (
                <InfoItem info={crmUser.role || ''} />
              )
            }
          />
          <LabelItem
            label={t('table.countryOrRegion')}
            ContentDom={
              isEditable ? (
                <RrhSelect
                  options={countryOptions}
                  value={formValues.country}
                  onValueChange={set('country')}
                  showRowValue={false}
                  className="w-full"
                  placeholder={t('common.pleaseSelect')}
                />
              ) : (
                <InfoItem info={crmUser.countryName || ''} />
              )
            }
          />
          <LabelItem
            label={t('CRMAccountPage.CRMAccountType')}
            ContentDom={
              isEditable ? (
                <RrhSelect
                  options={accountTypeOptions}
                  value={formValues.accountType}
                  showRowValue={false}
                  onValueChange={set('accountType')}
                  className="w-full"
                  placeholder={t('common.pleaseSelect')}
                />
              ) : (
                <InfoItem info={crmUser.accountTypeStr || ''} />
              )
            }
          />
          <LabelItem
            label={t('rules.preferenceLanguage')}
            ContentDom={
              isEditable ? (
                <RrhSelect
                  options={languageOptions}
                  value={formValues.preferenceLanguage}
                  onValueChange={set('preferenceLanguage')}
                  className="w-full"
                  placeholder={t('common.pleaseSelect')}
                />
              ) : (
                <InfoItem info={crmUser.preferenceLanguage || ''} />
              )
            }
          />
          <LabelItem
            label={t('CRMAccountPage.ColorPreferences')}
            ContentDom={
              isEditable ? (
                <RrhSelect
                  options={colorOptions}
                  value={formValues.colorPreference}
                  onValueChange={set('colorPreference')}
                  showRowValue={false}
                  className="w-full"
                  placeholder={t('common.pleaseSelect')}
                />
              ) : (
                <InfoItem
                  info={
                    Number(crmUser?.colorPreference) === 1
                      ? t('common.colorPreference.redUp')
                      : t('common.colorPreference.greenUp')
                  }
                />
              )
            }
          />
          {!isEditable && (
            <>
              <LabelItem
                label={t('table.productSource')}
                ContentDom={<InfoItem info={crmUser.registerSource || ''} />}
              />
              <LabelItem
                label={t('CRMAccountPage.registerTime')}
                ContentDom={<InfoItem info={crmUser.createTime || ''} />}
              />
            </>
          )}
        </div>
        {isEditable && (
          <div className="flex justify-end gap-2">
            <RrhButton variant="outline" onClick={handleCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton onClick={handleConfirm}>{t('common.Confirm')}</RrhButton>
          </div>
        )}
      </RrhCard>
      {crmUser.inviter && (
        <RrhCard>
          <h3 className="mb-3 text-lg font-semibold">{t('CRMAccountPage.Upper')}</h3>
          <div className="flex items-center justify-between">
            <div>
              <div>{userInviter}</div>
              <div>{crmUser.inviterEmail}</div>
            </div>
            <RrhButton
              className="p-0"
              variant="ghost"
              onClick={() => {
                openTab({
                  path: `/account/crm-accounts/detail?id=${crmUser.inviter}`,
                  title: userInviter,
                  key: `/account/crm-accounts/detail?id=${crmUser.inviter}`,
                });
              }}
            >
              <ChevronRight />
            </RrhButton>
          </div>
        </RrhCard>
      )}
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
        open={open === 'sendMsg'}
        onOpenChange={v => {
          if (!v) setOpen(v ? 'sendMsg' : null);
        }}
        languageOptions={languageOptions}
      />
      <EditRemarkDialog
        open={editOpen}
        setOpen={setEditOpen}
        remark={crmUser?.adminRemark || ''}
        userId={crmUser?.id || ''}
        onSuccess={refetch}
      />
    </>
  );
};
