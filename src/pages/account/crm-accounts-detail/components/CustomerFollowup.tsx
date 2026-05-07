import {
  useDeleteAgentCustomerFollowup,
  useGetAgentCustomerFollowup,
} from '@/api/hooks/agent/agent';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhRangeInput } from '@/components/common/RrhRangeInput';
import { formatDate } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddAgentFollowupItemDialog } from './AddAgentFollowupItemDialog';
import { Trash } from 'lucide-react';
import { EditAgentFollowupItemDialog } from './EditAgentFollowupItemDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const CustomerFollowup = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<{ from?: Date; to?: Date } | null>();
  const { data, refetch } = useGetAgentCustomerFollowup(
    userId,
    formatDate(timeRange?.from),
    formatDate(timeRange?.to),
  );
  const { mutateAsync: deleteFollowup } = useDeleteAgentCustomerFollowup();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const tabs = [t('common.all'), t('CRMAccountPage.followup'), t('CRMAccountPage.remind')];
  const [activeTab, setActiveTab] = useState(t('common.all'));
  const followupList = useMemo(() => {
    const rawData = data?.rows || [];
    switch (activeTab) {
      case t('CRMAccountPage.followup'):
        return rawData.filter(item => item.remind === 0);
      case t('CRMAccountPage.remind'):
        return rawData.filter(item => item.remind === 1);
      default:
        return rawData;
    }
  }, [activeTab, data?.rows, t]);
  return (
    <RrhCard>
      <div className="flex items-center gap-6">
        <div className="border-border flex items-center gap-6 border-r pr-6">
          {tabs.map(tab => (
            <RrhButton
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              className="w-auto"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </RrhButton>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <RrhRangeInput
            name="followupTime"
            from={timeRange?.from}
            to={timeRange?.to}
            className="w-auto min-w-55"
            onChange={({ from, to }) => setTimeRange({ from, to })}
          />
          <AddAgentFollowupItemDialog userId={userId} refetch={refetch} />
        </div>
      </div>
      <div className="mt-10 flex flex-col items-start">
        {followupList.map((followupItem, idx) => {
          return (
            <div key={idx} className="flex w-full">
              <div className="relative flex w-6 flex-col items-center overflow-hidden">
                {idx !== followupList.length - 1 && (
                  <div className="absolute top-6 bottom-0 left-1/2 z-0 h-full w-[1px] -translate-x-1/2 bg-green-600" />
                )}
                <div className="relative size-6 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-green-600 opacity-35" />
                  <div className="absolute top-1/2 left-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600" />
                </div>
              </div>
              <div className="flex-1 pb-6 pl-6">
                <div className="w-130">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-semibold">{followupItem.followTime}</span>
                    {followupItem.createType === 1 ? (
                      <span className="border-border rounded-sm border px-2 py-1">
                        {followupItem.creator}
                        {t('CRMAccountPage.followup')}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <EditAgentFollowupItemDialog
                          userId={userId}
                          refetch={refetch}
                          followupItem={followupItem}
                        />
                        <RrhButton
                          variant="ghost"
                          className="!p-2"
                          onClick={() => {
                            setDeleteId(followupItem.id);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash className="size-5" />
                        </RrhButton>
                      </div>
                    )}
                  </div>
                  <div className="bg-accent mt-4 flex flex-col gap-3 rounded-lg p-4">
                    <div className="text-lg">{followupItem.title}</div>
                    <div>
                      {t('CRMAccountPage.followup')}: {followupItem.creator}
                    </div>
                    <div>
                      {t('table.content')}: {followupItem.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <RrhDeleteAlert<{ id: string }>
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onSuccess={() => refetch()}
        confirmFunction={deleteFollowup}
        params={{ id: deleteId }}
        tipsText={t('common.deleteFieldConfirm', { field: t('CRMAccountPage.customerFollowUp') })}
      />
    </RrhCard>
  );
};
