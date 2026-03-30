import { ReactNode } from 'react';
import { RrhButton } from './RrhButton';
import { Check, PencilLine, X } from 'lucide-react';
import { InfoItem } from './InfoItem';

export function EditableField({
  isEditing,
  displayValue,
  editor,
  onEdit,
  onCancel,
  onConfirm,
}: {
  isEditing: boolean;
  displayValue: string;
  editor: ReactNode;
  onEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-1">
      {isEditing ? (
        <>
          <div className="w-full">{editor}</div>
          <div className="flex items-center gap-1">
            <RrhButton variant="ghost" className="size-6" onClick={onCancel}>
              <X className="text-muted-foreground size-4" />
            </RrhButton>
            <RrhButton variant="ghost" className="size-6" onClick={onConfirm}>
              <Check className="text-muted-foreground size-4" />
            </RrhButton>
          </div>
        </>
      ) : (
        <>
          <InfoItem info={displayValue || '-'} />
          <RrhButton variant="ghost" className="size-6" onClick={onEdit}>
            <PencilLine className="text-muted-foreground size-4" />
          </RrhButton>
        </>
      )}
    </div>
  );
}
