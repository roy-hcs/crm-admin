import {
  useEditSignalSourceStatus,
  useGetAccountHistory,
  useMamSignalSourceDetailView,
} from '@/api/hooks/copyTrading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RevenueTrend } from './revenue-trend/RevenueTrend';
import { AddEditSignalsDialog } from '../signals/components/AddEditSignalsDialog';
import { RrhAlert } from '@/components/common/RrhAlert';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormRadio } from '@/components/form/FormRadio';
import { OverviewFunds } from './overview-funds/OverviewFunds';
import { FollowSituation } from './follow-situation/FollowSituation';
import { SignalTradeOrders } from './trade-orders/SignalTradeOrders';
import { SubscriberTradeOrders } from './trade-orders/SubscriberTradeOrders';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ReactNode } from 'react';
import { SignalHeaderCard } from './components/SignalHeaderCard';
import { SignalSidebarCard } from './components/SignalSidebarCard';

const signalSwitchSchema = z.object({
  id: z.string().min(1),
  closeReason: z.string().max(50).optional(),
  closeType: z.string().min(1),
});

type FormValues = z.infer<typeof signalSwitchSchema>;

type SignalsTabKey = `signals.tabs.${1 | 2 | 3 | 4 | 5}`;
type SignalsHeaderOptionKey = `signals.headerOptions.${1 | 2 | 3 | 4 | 5 | 6}`;

type SignalsTabItem = {
  value: SignalsTabKey;
  component: ReactNode;
};

type SignalsHeaderSummaryItem = {
  label: SignalsHeaderOptionKey;
  value: string | number;
};

export function SignalsDetailPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { t } = useTranslation();
  const {
    data: signalData,
    isLoading: signalLoading,
    refetch: refetchSignalData,
  } = useMamSignalSourceDetailView(id || '');
  const serverId = signalData?.data?.detail?.serverId || '';
  const account = signalData?.data?.detail?.account || '';
  // 这里需要获取倒数第二个数组中的数据，因为最后一个数据是正在跟随的，倒数第二个数据才是最近一次的历史数据
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistoryData,
  } = useGetAccountHistory({
    serverId: serverId,
    account: account,
    stime: '7',
  });
  const icon = signalData?.data?.detail?.icon || '';
  const name = signalData?.data?.detail?.name || '';
  const server = signalData?.data?.detail?.server || '';
  const serverProperty = signalData?.data?.detail?.serverProperty || 1;
  const createBy = signalData?.data?.detail?.createBy || '';
  const email = signalData?.data?.detail?.email || '';
  const currentFollowNum = signalData?.data?.currentFollowNum || 0;
  const historyFollowNum = signalData?.data?.historyFollowNum || 0;
  const accountId = signalData?.data?.accountId || '';
  const accountDisplay = [server, account].filter(Boolean).join(' ');

  const [open, setOpen] = useState(false);
  const [signalSwitchConfirmOpen, setSignalSwitchConfirmOpen] = useState(false);
  const [signalSwitchDialogOpen, setSignalSwitchDialogOpen] = useState(false);

  const signalStatus = Number(signalData?.data?.detail?.status ?? 1);
  const isSignalEnabled = signalStatus !== 0;
  const nextSignalActionKey = isSignalEnabled
    ? 'signals.signalSourceOptions.1'
    : 'signals.signalSourceOptions.2';

  const { mutateAsync: closeSignalSource, isPending } = useEditSignalSourceStatus();

  const historyDetail = useMemo(() => {
    // historyData 数组倒数第二个数据
    const arr = historyData?.data || [];
    if (arr.length > 1) {
      return arr[arr.length - 2];
    } else if (arr.length === 1) {
      return arr[0];
    }
    return null;
  }, [historyData]);

  const tabList = useMemo<SignalsTabItem[]>(
    () => [
      {
        value: 'signals.tabs.1',
        component: <RevenueTrend serverId={serverId} login={account} />,
      },
      {
        value: 'signals.tabs.2',
        component: (
          <OverviewFunds serverId={serverId} login={account} id={id || ''} accountId={accountId} />
        ),
      },
      {
        value: 'signals.tabs.3',
        component: <FollowSituation traderServerId={serverId} trader={account} />,
      },
      {
        value: 'signals.tabs.4',
        component: <SignalTradeOrders accountId={accountId} trader={account} />,
      },
      {
        value: 'signals.tabs.5',
        component: <SubscriberTradeOrders clientAccount={account} clientServerId={serverId} />,
      },
    ],
    [account, accountId, id, serverId],
  );

  const sumData = useMemo<SignalsHeaderSummaryItem[]>(() => {
    return [
      {
        label: 'signals.headerOptions.1',
        value: (historyDetail?.rateProfit180d || 0) + '%',
      },
      {
        label: 'signals.headerOptions.2',
        value: (historyDetail?.rateProfit30d || 0) + '%',
      },
      {
        label: 'signals.headerOptions.3',
        value: historyDetail?.totalProfit || 0,
      },
      {
        label: 'signals.headerOptions.4',
        value: historyDetail?.profit30d || 0,
      },
      {
        label: 'signals.headerOptions.5',
        value: (historyDetail?.maxRetreat || 0) + '%',
      },
      {
        label: 'signals.headerOptions.6',
        value: (historyDetail?.rateSuccess || 0) + '%',
      },
    ];
  }, [historyDetail]);

  const form = useForm<FormValues>({
    resolver: zodResolver(signalSwitchSchema),
    defaultValues: {
      id: id || '',
      closeReason: '',
      closeType: '1',
    },
  });

  const resetSwitchForm = () => {
    form.reset({
      id: id || '',
      closeReason: '',
      closeType: '1',
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await closeSignalSource({
        id: values.id,
        closeReason: (values.closeReason || '').trim(),
        closeType: values.closeType,
      });
      if (res?.code === 0) {
        toast.success(t('common.success'));
        refetchSignalData();
        refetchHistoryData();
        onClose(false);
        return;
      }
      toast.error(res.msg);
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const onConfirm = () => {
    void form.handleSubmit(onSubmit)();
  };

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setSignalSwitchDialogOpen(open);
    if (!open) {
      resetSwitchForm();
    }
  };

  if (signalLoading || historyLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3 lg:flex-row lg:gap-8">
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 overflow-hidden">
        <SignalHeaderCard
          icon={icon}
          name={name}
          serverProperty={serverProperty}
          accountDisplay={accountDisplay}
          dataUpdateTimeLabel={t('home.DataUpdateTime')}
          statisticsDate={historyDetail?.statisticsDate || ''}
          liveLabel={t('common.live')}
          demoLabel={t('common.demo')}
        />

        <div>
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-6 lg:gap-6">
            {sumData.map(it => {
              return (
                <div
                  className="bg-card flex flex-col gap-2 rounded-lg p-4 shadow-xs"
                  key={it.label}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-card-foreground text-sm leading-5 font-normal">
                      {t(it.label)}
                    </div>
                    <ChevronRight className="text-card-foreground h-4 w-4" />
                  </div>
                  <div className="text-card-foreground truncate text-base leading-4 font-semibold">
                    {it.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Tabs
          defaultValue={tabList[0]?.value}
          className="grid min-w-0 flex-1 gap-3 overflow-hidden"
        >
          <TabsList className="justify-start">
            {tabList.map(i => (
              <TabsTrigger key={i.value} value={i.value}>
                {t(i.value)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabList.map(i => (
            <TabsContent key={i.value} value={i.value} className="min-w-0 overflow-hidden">
              {i.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="relative lg:w-93.5">
        <div className="sticky top-0 flex flex-col gap-3 md:gap-6">
          <SignalSidebarCard
            createBy={createBy}
            email={email}
            currentSubscriptionLabel={t('signals.currentSubscription')}
            currentFollowNum={currentFollowNum}
            historicalSubscriptionLabel={t('signals.historicalSubscription')}
            historyFollowNum={historyFollowNum}
            editLabel={t('common.Edit')}
            isSignalEnabled={isSignalEnabled}
            switchLabel={t(nextSignalActionKey)}
            onEdit={() => {
              setOpen(true);
            }}
            onSwitch={() => {
              setSignalSwitchConfirmOpen(true);
            }}
          />
        </div>
      </div>

      <AddEditSignalsDialog
        open={open}
        id={id || ''}
        onOpenChange={setOpen}
        mode="edit"
        onSuccess={() => {
          refetchSignalData();
          refetchHistoryData();
        }}
      />
      {isSignalEnabled && (
        <div>
          <RrhAlert
            trigger={null}
            open={signalSwitchConfirmOpen}
            onOpenChange={setSignalSwitchConfirmOpen}
            cancelText={t('common.Cancel')}
            confirmText={t('common.Confirm')}
            title={t('common.SystemPrompt')}
            content={
              isSignalEnabled
                ? t('signals.signalSourceSwitch.confirmDisableTips')
                : t('signals.signalSourceSwitch.confirmEnableTips')
            }
            onConfirm={() => {
              setSignalSwitchConfirmOpen(false);
              setSignalSwitchDialogOpen(true);
            }}
          />
          <RrhDialog
            title={
              isSignalEnabled
                ? t('signals.signalSourceSwitch.disableDialogTitle')
                : t('signals.signalSourceSwitch.enableDialogTitle')
            }
            open={signalSwitchDialogOpen}
            onOpenChange={onClose}
            onCancel={onCancel}
            onConfirm={onConfirm}
            formLoading={isPending}
            isConfirmDisabled={isPending}
          >
            <RrhForm form={form}>
              <FormRadio
                className="py-3"
                name="closeType"
                orientation="horizontal"
                label={t('signals.closeType')}
                options={[
                  { label: t('signals.closeTypeOptions.1'), value: '1' },
                  { label: t('signals.closeTypeOptions.2'), value: '2' },
                ]}
                labeTipsDom={
                  <div className="text-muted-foreground text-xs leading-4">
                    {t('signals.closeTypeDesc')}
                  </div>
                }
              />
              <FormTextarea
                className="py-3"
                name="closeReason"
                label={t('signals.closeReason')}
                placeholder={t('rules.limitLength', { field: 50 })}
                maxLength={50}
                labeTipsDom={
                  <div className="text-muted-foreground text-xs leading-4">
                    {t('signals.closeReasonDesc')}
                  </div>
                }
              />
            </RrhForm>
          </RrhDialog>
        </div>
      )}
    </div>
  );
}
