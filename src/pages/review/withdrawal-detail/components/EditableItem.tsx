import { Input } from '@/components/ui/input';
import { InfoItem } from './InfoItem';
import { RrhButton } from '@/components/common/RrhButton';
import { Check, SquarePen, X } from 'lucide-react';

export const EditableItem = ({
  isAudit,
  info,
  infoEditable,
  shadowInfo,
  setShadowInfo,
  onCancel,
  onConfirm,
  onEdit,
  value,
  onValueChange,
}: {
  isAudit: boolean;
  info: string;
  infoEditable: boolean;
  shadowInfo: string;
  setShadowInfo: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  value: string;
  onValueChange: (val: string) => void;
}) => {
  if (!info) return null;
  return !isAudit ? (
    <InfoItem info={info} />
  ) : (
    <div className="flex items-center gap-1">
      {infoEditable ? (
        <>
          <Input
            value={value ?? shadowInfo}
            className="h-10"
            onChange={e => {
              onValueChange(e.target.value);
              setShadowInfo(e.target.value);
            }}
          />
          <RrhButton variant="ghost" className="size-6" onClick={onCancel}>
            <X className="size-4" />
          </RrhButton>
          <RrhButton variant="ghost" className="size-6" onClick={onConfirm}>
            <Check className="size-4" />
          </RrhButton>
        </>
      ) : (
        <>
          <InfoItem info={info || '-'} />
          <RrhButton variant="ghost" className="size-6" onClick={onEdit}>
            <SquarePen className="size-4" />
          </RrhButton>
        </>
      )}
    </div>
  );
};
