import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';


import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import {
  RebateLevelItem,
  useAddRebateLevel,
  useEditRebateLevel,
  useGetUniqueName,
} from '@/api/hooks/rebate';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';

export const RebateLevelForm = ({
  onSuccess,
  onCancel,
  rebateLevelItem,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  rebateLevelItem?: RebateLevelItem | null;
}) => {
  const { t } = useTranslation();
  const levelFormSchema = z.object({
    level: z.string().min(1, t('rules.required', { field: t('table.level') })),
    levelName: z
      .string()
      .min(1, t('rules.required', { field: t('table.levelName') }))
      .max(16, t('rules.limitLength', { field: 16 })),
    id: z.optional(z.string()),
  });

  const form = useForm({
    resolver: zodResolver(levelFormSchema),
    defaultValues: {
      levelName: rebateLevelItem?.levelName || '',
      id: rebateLevelItem?.id || '',
      level: rebateLevelItem?.level?.toString() || '',
    },
  });
  const { mutateAsync: getUniqueName } = useGetUniqueName();
  const { mutateAsync: addRebateLevel, isPending: isAddPending } = useAddRebateLevel();
  const { mutateAsync: editRebateLevel, isPending: isEditPending } = useEditRebateLevel();
  const isPending = useMemo(() => isAddPending || isEditPending, [isAddPending, isEditPending]);
  const onSubmit = async (data: { [key: string]: string }) => {
    try {
      const res = await getUniqueName({ name: data.levelName });
      if (res !== 0) {
        toast.error(t('rules.levelNameAlreadyUsed'));
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
    if (rebateLevelItem) {
      try {
        const res = await editRebateLevel({
          id: data.id,
          level: data.level,
          levelName: data.levelName,
        });
        if (res.code === 0) {
          onSuccess();
        }
      } catch (error) {
        console.error(error);
      } finally {
        onCancel();
      }
    } else {
      try {
        const res = await addRebateLevel({
          level: data.level,
          levelName: data.levelName,
        });
        if (res.code === 0) {
          onSuccess();
        }
      } catch (error) {
        console.error(error);
      } finally {
        onCancel();
      }
    }
  };
  return (
    <RrhForm form={form} className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            name="level"
            label={t('table.level')}
            verticalLabel
            placeholder={t('RebateLevelSettings.levelPlaceholder')}
          />
          <FormInput
            name="levelName"
            label={t('table.levelName')}
            verticalLabel
            placeholder={t('rules.limitLength', { field: 16 })}
          />
          <div className="border-border -mx-6 flex justify-end gap-4 border-t px-6 pt-3 pb-3 md:pt-6 md:pb-0">
            <RrhButton type="button" variant="outline" disabled={isPending} onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton loading={isPending} type="submit">
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </RrhForm>
  );
};
