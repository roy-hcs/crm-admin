import { CrmUserItem, useChangeUserStatus } from '@/api/hooks/account';
import { RrhAlert } from '@/components/common/RrhAlert';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StatusCell = ({ row }: { row: Row<CrmUserItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeStatusMutation = useChangeUserStatus();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: row.original.id,
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['crmUser'] });
    }
  }, [changeStatusMutation, queryClient, row.original.id, row.original.status]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <RrhAlert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.status === 1
            ? t('CRMAccountPage.ConfirmDisableAccount')
            : t('CRMAccountPage.ConfirmEnableAccount')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};
