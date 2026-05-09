import { getKycStatusBgClass, KycStatus } from '@/components/common/RrhKycStatus';
import { cn } from '@/lib/utils';

export type StatusListType = {
  key: string;
  label: string;
  status: KycStatus;
}[];
export function StatusList({ status }: { status?: StatusListType }) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-9">
      {status?.map(i => (
        <div className="flex items-center gap-1" key={i.key}>
          <div className={cn('size-2 rounded-full', getKycStatusBgClass(i.status))}></div>
          <div className="text-muted-foreground text-sm leading-5 whitespace-nowrap">{i.label}</div>
        </div>
      ))}
    </div>
  );
}
