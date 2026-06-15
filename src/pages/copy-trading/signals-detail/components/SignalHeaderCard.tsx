import { RrhCard } from '@/components/common/RrhCard';

export function SignalHeaderCard({
  icon,
  name,
  serverProperty,
  accountDisplay,
  dataUpdateTimeLabel,
  statisticsDate,
  liveLabel,
  demoLabel,
}: {
  icon: string;
  name: string;
  serverProperty: number | string;
  accountDisplay: string;
  dataUpdateTimeLabel: string;
  statisticsDate: string | number;
  liveLabel: string;
  demoLabel: string;
}) {
  return (
    <RrhCard className="flex justify-between">
      <div className="flex gap-2">
        <div className="size-12">
          <img src={icon} alt={name || 'signal-source'} />
        </div>
        <div>
          <div>{name}</div>
          <div>
            {Number(serverProperty) === 1 ? liveLabel : demoLabel}
            {accountDisplay}
          </div>
        </div>
      </div>
      <div>
        {dataUpdateTimeLabel}
        {String(statisticsDate || '')}
      </div>
    </RrhCard>
  );
}
