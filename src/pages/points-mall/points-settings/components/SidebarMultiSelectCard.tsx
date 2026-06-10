import { SelectOption } from '@/api/types';
import { RrhCard } from '@/components/common/RrhCard';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { ReactNode } from 'react';
import { FieldPath } from 'react-hook-form';
import { PointsMallSettingsFormValues } from '../types';

type SidebarMultiSelectCardProps = {
  title: string;
  description?: string;
  name: FieldPath<PointsMallSettingsFormValues>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  editable: boolean;
  labelTipsDom?: ReactNode;
};

export function SidebarMultiSelectCard({
  title,
  description,
  name,
  label,
  placeholder,
  options,
  editable,
  labelTipsDom,
}: SidebarMultiSelectCardProps) {
  return (
    <RrhCard>
      <div className="grid gap-3 md:gap-6">
        <div>
          <div className="text-secondary-foreground text-lg leading-7 font-semibold">{title}</div>
          {description ? (
            <div className="text-muted-foreground text-sm leading-5">{description}</div>
          ) : null}
        </div>

        <FormMultiSelect<PointsMallSettingsFormValues>
          name={name}
          label={label}
          placeholder={placeholder}
          showRowValue={false}
          options={options}
          className="gap-3"
          labeTipsDom={labelTipsDom}
          disabled={!editable}
        />
      </div>
    </RrhCard>
  );
}
