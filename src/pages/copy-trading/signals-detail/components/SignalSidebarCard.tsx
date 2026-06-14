import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';

export function SignalSidebarCard({
  createBy,
  email,
  currentSubscriptionLabel,
  currentFollowNum,
  historicalSubscriptionLabel,
  historyFollowNum,
  editLabel,
  isSignalEnabled,
  switchLabel,
  onEdit,
  onSwitch,
}: {
  createBy: string;
  email: string;
  currentSubscriptionLabel: string;
  currentFollowNum: number;
  historicalSubscriptionLabel: string;
  historyFollowNum: number;
  editLabel: string;
  isSignalEnabled: boolean;
  switchLabel: string;
  onEdit: () => void;
  onSwitch: () => void;
}) {
  return (
    <RrhCard className="flex flex-col gap-4 p-4">
      <div>
        <span>{createBy}</span>
        <span>{email}</span>
      </div>
      <div>
        <span>{currentSubscriptionLabel}</span>
        <span>{currentFollowNum}</span>
      </div>
      <div>
        <span>{historicalSubscriptionLabel}</span>
        <span>{historyFollowNum}</span>
      </div>
      <div>
        <RrhButton type="button" onClick={onEdit}>
          {editLabel}
        </RrhButton>
      </div>
      {isSignalEnabled && (
        <div>
          <RrhButton type="button" onClick={onSwitch}>
            {switchLabel}
          </RrhButton>
        </div>
      )}
    </RrhCard>
  );
}
