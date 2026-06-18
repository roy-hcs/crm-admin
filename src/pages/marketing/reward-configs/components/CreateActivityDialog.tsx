import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useTabActions } from '@/hooks/useTabActions';
import { ChevronRight, Plus, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateActivityDialog() {
  const { t } = useTranslation();
  const { openTab } = useTabActions();
  const [open, setOpen] = useState(false);

  const activityList = useMemo(
    () => [
      {
        firstLabel: t('rewardConfigPage.activityList.activity1'),
        secondLabel: t('rewardConfigPage.activityList.activity1Desc'),
        url: '/marketing/reward-config/referral-bonus',
        icon: <User />,
      },
      {
        firstLabel: t('rewardConfigPage.activityList.activity2'),
        secondLabel: t('rewardConfigPage.activityList.activity2Desc'),
        url: '/marketing/reward-config/account-opening-bonus',
        icon: <User />,
      },
      {
        firstLabel: t('rewardConfigPage.activityList.activity3'),
        secondLabel: t('rewardConfigPage.activityList.activity3Desc'),
        url: '/marketing/reward-config/deposit-bonus',
        icon: <User />,
      },
      {
        firstLabel: t('rewardConfigPage.activityList.activity4'),
        secondLabel: t('rewardConfigPage.activityList.activity4Desc'),
        url: '/marketing/reward-config/transaction-bonus',
        icon: <User />,
      },
    ],
    [t],
  );

  const onclose = (value: boolean) => {
    setOpen(value);
  };

  const handleClick = (url: string, title: string) => {
    onclose(false);
    openTab({
      key: url,
      title: title,
      path: url,
    });
  };

  return (
    <RrhDialog
      title={t('rewardConfigPage.createActivity')}
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('common.add')}
        </RrhButton>
      }
      open={open}
      onOpenChange={onclose}
      footerShow={false}
      variant="small"
    >
      <div className="grid gap-6">
        <div className="grid gap-1">
          <div className="text-secondary-foreground text-sm leading-5 font-medium">
            {t('rewardConfigPage.createActivity')}
          </div>
          <div className="text-muted-foreground text-sm leading-5">
            {t('rewardConfigPage.createActivityDesc')}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-1 lg:gap-6">
          {activityList.map((it, index) => {
            return (
              <div
                className="bg-card flex flex-col gap-2 rounded-lg p-4 shadow-xs"
                key={index}
                onClick={() => handleClick(it.url, it.firstLabel)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-secondary-foreground text-sm leading-5 font-medium">
                    {it.firstLabel}
                  </div>
                  <ChevronRight className="text-card-foreground h-4 w-4" />
                </div>
                <div className="text-muted-foreground text-sm leading-5">{it.secondLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </RrhDialog>
  );
}
