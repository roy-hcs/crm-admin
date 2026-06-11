import { useEditCopyTradingApplicableUsers, useMamDashboardInfo } from '@/api/hooks/copyTrading';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CopyTradingEarnings } from './components/CopyTradingEarnings';
import { SidebarMultiSelectCard } from '@/pages/points-mall/points-settings/components/SidebarMultiSelectCard';
import { CopyTradingInfo } from './components/CopyTradingInfo';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';

type FormValues = {
  roleIds: string[];
};

const cloneFormValues = (values: FormValues): FormValues => {
  if (typeof structuredClone === 'function') {
    return structuredClone(values);
  }
  return {
    roleIds: [...values.roleIds],
  };
};

export function CopyTradingDashboardPage() {
  const { t } = useTranslation();
  const [isFormReady, setIsFormReady] = useState(false);
  const [editable, setEditable] = useState(false);
  const initialFormValuesRef = useRef<FormValues | null>(null);
  const lastHydratedAtRef = useRef<number>(0);
  const {
    data: mamDashboardInfo,
    isLoading: mamDashboardLoading,
    refetch,
    dataUpdatedAt,
  } = useMamDashboardInfo();
  const { mutateAsync: editCopyTradingApplicableUsers } = useEditCopyTradingApplicableUsers();
  const { withLoading } = useGlobalLoading();
  const subscription = mamDashboardInfo?.data?.subscribeInfo;
  const status = Number(mamDashboardInfo?.data?.status || 0);
  const form = useForm<FormValues>({
    defaultValues: {
      roleIds: [],
    },
  });
  const allRoles = useMemo(
    () => mamDashboardInfo?.data?.allRoles || [],
    [mamDashboardInfo?.data?.allRoles],
  );

  useEffect(() => {
    const payload = mamDashboardInfo?.data;
    if (!payload) return;
    const resetValues: FormValues = {
      roleIds: payload.roleIds || [],
    };

    // 编辑过程中不覆盖表单，避免未保存输入被接口刷新冲掉。
    if (editable) {
      if (!isFormReady) {
        initialFormValuesRef.current = cloneFormValues(resetValues);
        lastHydratedAtRef.current = dataUpdatedAt;
        setIsFormReady(true);
      }
      return;
    }

    const hasNewData = lastHydratedAtRef.current !== dataUpdatedAt;
    if (!hasNewData && isFormReady) {
      return;
    }

    form.reset(resetValues);
    initialFormValuesRef.current = cloneFormValues(resetValues);
    lastHydratedAtRef.current = dataUpdatedAt;
    setIsFormReady(true);
  }, [mamDashboardInfo, dataUpdatedAt, editable, form, isFormReady]);

  const sumData = useMemo(() => {
    if (mamDashboardLoading) {
      return [];
    }
    return [
      {
        title: 'dashboard.subscriptionStatus',
        value: [
          {
            label: 'dashboard.signalSourceCount',
            value: mamDashboardInfo?.data?.signalSourceCount || 0,
          },
          {
            label: 'dashboard.followerCount',
            value: mamDashboardInfo?.data?.followerCount || 0,
          },
        ],
      },
      {
        title: 'dashboard.subscriptionFee',
        value: [
          {
            label: 'dashboard.totalSubscriptionFee',
            value:
              (mamDashboardInfo?.data?.feeInfo?.settledSubscribeFee || 0) +
              (mamDashboardInfo?.data?.feeInfo?.pendingSubscribeFee || 0),
          },
          {
            label: 'common.settled',
            value: mamDashboardInfo?.data?.feeInfo?.settledSubscribeFee || 0,
          },
          {
            label: 'common.unsettled',
            value: mamDashboardInfo?.data?.feeInfo?.pendingSubscribeFee || 0,
          },
        ],
      },
      {
        title: 'dashboard.managementFee',
        value: [
          {
            label: 'common.settled',
            value: mamDashboardInfo?.data?.feeInfo?.settledManagementFee || 0,
          },
          {
            label: 'common.unsettled',
            value: mamDashboardInfo?.data?.feeInfo?.pendingManagementFee || 0,
          },
        ],
      },
    ];
  }, [mamDashboardLoading, mamDashboardInfo]);

  const roleOptions = useMemo(
    () =>
      allRoles.map(i => ({
        label: i.roleName,
        value: i.roleId,
      })),
    [allRoles],
  );

  const onStartEdit = () => {
    initialFormValuesRef.current = cloneFormValues(form.getValues());
    setEditable(true);
  };
  const onCancelEdit = () => {
    if (initialFormValuesRef.current) {
      form.reset(cloneFormValues(initialFormValuesRef.current));
    }
    setEditable(false);
  };
  const save = () => {
    form.handleSubmit(submit)();
  };

  const submit = async (values: FormValues) => {
    await withLoading(async () => {
      try {
        const res = await editCopyTradingApplicableUsers({
          roleIds: values.roleIds.join(','),
        });
        if (res.code === 0) {
          initialFormValuesRef.current = cloneFormValues(values);
          setEditable(false);
          toast.success(t('common.success'));
          refetch();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  if (mamDashboardLoading || !isFormReady) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageInfo wrapperCls="py-3" title={t('dashboard.title')} />
        <div className="flex justify-end gap-1">
          {!editable && (
            <RrhButton type="button" onClick={onStartEdit}>
              {t('common.Edit')}
            </RrhButton>
          )}
          {editable && (
            <>
              <RrhButton type="button" onClick={onCancelEdit}>
                {t('common.Cancel')}
              </RrhButton>
              <RrhButton type="button" onClick={save}>
                {t('common.save')}
              </RrhButton>
            </>
          )}
        </div>
      </div>

      <RrhForm form={form}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1">
            <div className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3 lg:gap-6">
                {sumData.map((it, index) => {
                  return (
                    <div
                      className="bg-card flex flex-col gap-2 rounded-lg p-4 shadow-xs"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-card-foreground text-sm leading-5 font-normal">
                          {t(it.title)}
                        </div>
                        <ChevronRight className="text-card-foreground h-4 w-4" />
                      </div>
                      <div className="flex gap-2">
                        {it.value.map((subIt, subIndex) => {
                          return (
                            <div className="flex-1" key={subIndex}>
                              <div
                                className="text-card-foreground truncate text-base leading-4 font-semibold"
                                title={subIt.value.toString()}
                              >
                                {t(subIt.label)}
                              </div>
                              <div className="text-muted-foreground text-xs leading-4 font-normal">
                                {subIt.value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <CopyTradingEarnings />
            </div>
          </div>

          <div className="relative md:w-93.5">
            <div className="sticky top-0 flex flex-col gap-3 md:gap-6">
              <CopyTradingInfo
                status={status}
                subscription={subscription || {}}
                success={refetch}
              />

              <SidebarMultiSelectCard
                title={t('pointsMallSettings.suitableUser')}
                description={t('dashboard.copyTradingEligibility')}
                name="roleIds"
                label={t('pointsMallSettings.userRole')}
                placeholder={t('common.pleaseSelect')}
                options={roleOptions}
                editable={editable}
              />
            </div>
          </div>
        </div>
      </RrhForm>
    </>
  );
}
