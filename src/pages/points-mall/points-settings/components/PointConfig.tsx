import { SelectOption } from '@/api/types';
import { PointConfigCard1 } from './PointConfigCard1';
import { PointConfigCard2 } from './PointConfigCard2';
import { PointConfigCard3 } from './PointConfigCard3';
import { PointConfigCard4 } from './PointConfigCard4';
import { PointConfigCard5 } from './PointConfigCard5';

export function PointConfig({
  editable,
  allRoles,
  allTags,
  serverOptions,
}: {
  editable: boolean;
  allRoles: SelectOption[];
  allTags: SelectOption[];
  serverOptions: Array<{
    label: string;
    value: string;
    serviceProperty: number;
    serviceType: number;
  }>;
}) {
  return (
    <div className="grid gap-6">
      <PointConfigCard1 editable={editable} />
      <PointConfigCard2 editable={editable} serverOptions={serverOptions} />
      <PointConfigCard3 editable={editable} />
      <PointConfigCard4 editable={editable} serverOptions={serverOptions} />
      <PointConfigCard5 editable={editable} allRoles={allRoles} allTags={allTags} />
    </div>
  );
}
