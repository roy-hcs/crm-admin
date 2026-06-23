import { useCrmRole } from '@/api/hooks/system/system';
import { RoleItem } from '@/api/hooks/system/types';
import { useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '../common/RrhMultiSelect';
import { FormSearchMultiSelect } from './FormSearchMultiSelect';

interface FormCrmRoleMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showRowValue?: boolean;
  initialOptions?: BaseOption[];
}

export function FormCrmRoleMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder,
  pageSize = 15,
  showRowValue = false,
  initialOptions = [],
}: FormCrmRoleMultiSelectProps<T>) {
  const { mutateAsync: getRoleList } = useCrmRole();

  const fetchOptions = useCallback(
    async ({
      pageNum,
      pageSize,
      keyword,
    }: {
      pageNum: number;
      pageSize: number;
      keyword: string;
    }) => {
      const res = await getRoleList({
        origin: '0',
        roleName: keyword,
        pageNum,
        pageSize,
      });
      const rows = res.rows || [];

      return {
        list: rows.map((item: RoleItem) => ({
          value: item.roleId,
          label: item.roleName,
        })),
        total: Number(res.total || 0),
        hasMore: pageNum * pageSize < Number(res.total || 0),
      };
    },
    [getRoleList],
  );

  return (
    <FormSearchMultiSelect<T>
      name={name}
      label={label}
      placeholder={placeholder ?? ''}
      verticalLabel={verticalLabel}
      className={className}
      searchPlaceholder={searchPlaceholder}
      pageSize={pageSize}
      showRowValue={showRowValue}
      initialOptions={initialOptions}
      fetchOptions={fetchOptions}
    />
  );
}
