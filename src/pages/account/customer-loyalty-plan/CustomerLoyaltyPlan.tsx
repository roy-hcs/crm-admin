import {
  useCrmUserVipChangeStatus,
  useCustomerLoyaltyPlan,
  useDeleteCrmUserVip,
  usePreferenceEdit,
} from '@/api/hooks/account';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RankSortDialog } from './components/RankSortDialog';
import { PreferencesDialog } from './components/PreferencesDialog';
import { useTabActions } from '@/hooks/useTabActions';

export function CustomerLoyaltyPlan() {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState({ open: false, id: '', name: '' });
  const { openTab } = useTabActions();
  const { data, isLoading, refetch } = useCustomerLoyaltyPlan();
  const { mutateAsync: modifyStatus } = usePreferenceEdit();
  const { mutateAsync: changeStatus } = useCrmUserVipChangeStatus();
  const { mutateAsync: deleteCrmUserVip } = useDeleteCrmUserVip();
  const userVipStatus = Number(data?.data?.userVipStatus || 0);
  const configArr = data?.data?.userVipList || [];
  console.log(data, isLoading);
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <PageInfo title={t('customerLoyaltyPlan.title')} />
        <div className="flex justify-end gap-1">
          <RrhButton
            onClick={() => {
              openTab({
                path: `/account/customer-loyalty-plan/config`,
                title: t('customerLoyaltyPlan.vipLevelConfig'),
                key: `/account/customer-loyalty-plan/config`,
              });
            }}
            type="button"
            Icon={<Plus className="size-3.5" />}
          >
            {t('common.add')}
          </RrhButton>
          <PreferencesDialog />
          <RankSortDialog configArr={configArr} onSuccess={refetch} />
        </div>
      </div>

      <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
        <div className="grid flex-1 gap-6">
          <RrhCard>
            <div className="flex items-center gap-4">
              <div className="grid flex-1 gap-1">
                <div className="text-secondary-foreground text-sm leading-5 font-medium">
                  {t('pointsMallSettings.productExchangeEnable')}
                </div>
                <div className="text-muted-foreground text-sm leading-5">
                  {t('pointsMallSettings.productExchangeEnableDesc')}
                </div>
              </div>
              <div>
                <RrhStatusAlert<{
                  userVipStatus: number;
                }>
                  params={{
                    userVipStatus: userVipStatus === 1 ? 0 : 1,
                  }}
                  tipsText={userVipStatus === 1 ? t('ads.confirm.stop') : t('ads.confirm.open')}
                  checked={userVipStatus === 1}
                  confirmFunction={modifyStatus}
                  onSuccess={refetch}
                />
              </div>
            </div>
          </RrhCard>

          <RrhCard>
            <div className="grid gap-3">
              {configArr.map(i => (
                <div key={i.id} className="bg-primary-foreground grid grid-cols-1 rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                      <div className="text-secondary-foreground text-sm leading-5 font-medium">
                        {i.name}
                      </div>
                      <div className="text-muted-foreground text-sm leading-5">
                        {`${t('customerLoyaltyPlan.rankSort')}: ${i.sort}, ${t('customerLoyaltyPlan.quantity')}: ${i.userCount}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RrhButton
                        type="button"
                        onClick={() => {
                          const id = i.id;
                          openTab({
                            path: `/account/customer-loyalty-plan/config?id=${id}`,
                            title: t('customerLoyaltyPlan.vipLevelConfig'),
                            key: `/account/customer-loyalty-plan/config?id=${id}`,
                          });
                        }}
                      >
                        {t('common.Edit')}
                      </RrhButton>
                      <RrhButton
                        type="button"
                        onClick={() => {
                          setDeleteOpen({ open: true, id: i.id, name: i.name });
                        }}
                      >
                        {t('common.delete')}
                      </RrhButton>
                      <Switch
                        className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                        checked={i.status === 1}
                        onClick={() => {
                          const newValue = i.status === 1 ? 0 : 1;
                          changeStatus({ id: i.id, status: newValue }).then(() => {
                            refetch();
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <RrhDeleteAlert<{ id: string }>
              open={deleteOpen.open}
              setOpen={open => setDeleteOpen({ ...deleteOpen, open })}
              onSuccess={() => refetch()}
              confirmFunction={deleteCrmUserVip}
              params={{ id: deleteOpen.id }}
              tipsText={t('common.deleteFieldConfirm', {
                field: deleteOpen.name,
              })}
            />
          </RrhCard>
        </div>

        <div className="relative md:w-93.5">
          <div className="sticky top-0 flex flex-col gap-3 md:gap-6"></div>
        </div>
      </div>
    </div>
  );
}
