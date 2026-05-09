import { useEditAccountOperate } from '@/api/hooks/agent/agent';
import { useGetUserAccountOperation } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PenLine } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const CrmAccountOperationsPage = ({ userId }: { userId: string }) => {
  const { data: accountOperationsRes, refetch } = useGetUserAccountOperation(userId);
  const accountOperations = accountOperationsRes?.data;
  const { mutate: editAccountOperate, isPending } = useEditAccountOperate();
  const [outMoney, setOutMoney] = useState(!!accountOperations?.outMoney);
  const [insideTransfer, setInsideTransfer] = useState(!!accountOperations?.insideTransfer);
  const [enableInternalTransferOut, setEnableInternalTransferOut] = useState(false);
  const [editable, setEditable] = useState(false);
  const { t } = useTranslation();
  const editOperate = () => {
    editAccountOperate(
      {
        id: userId,
        permissionJson: JSON.stringify({
          outMoney: Number(outMoney),
          insideTransfer: Number(insideTransfer),
          enableInternalTransferOut: '0',
        }),
        crmAuthority: '0',
      },
      {
        onSuccess: () => {
          refetch();
          setEditable(false);
          toast.success(t('common.modifySuccess'));
        },
      },
    );
  };

  return (
    <RrhCard>
      <div className="mb-4 flex justify-end gap-4">
        {!editable ? (
          <RrhButton Icon={<PenLine />} onClick={() => setEditable(true)}>
            {t('common.Edit')}
          </RrhButton>
        ) : (
          <div className="flex gap-2">
            <RrhButton variant="outline" onClick={() => setEditable(false)}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton onClick={editOperate} loading={isPending}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Checkbox
            id="outMoney"
            checked={outMoney}
            onCheckedChange={value => setOutMoney(!!value)}
            disabled={!editable || isPending}
          />
          <Label
            htmlFor="outMoney"
            className="group-data-[disabled=true]:opacity-100 peer-disabled:opacity-100"
          >
            {t('table.Withdrawal')}
          </Label>
        </div>
        <div className="flex gap-4">
          <Checkbox
            id="insideTransfer"
            checked={insideTransfer}
            onCheckedChange={value => setInsideTransfer(!!value)}
            disabled={!editable || isPending}
          />
          <Label
            htmlFor="insideTransfer"
            className="group-data-[disabled=true]:opacity-100 peer-disabled:opacity-100"
          >
            {t('home.nav.InternalTransfer')}
          </Label>
        </div>
        {/* 对于这个页面来说，以下选项永远隐藏，这里留下代码只是为了和源代码保持一致 */}
        <div className="hidden">
          <Checkbox
            id="enableInternalTransferOut"
            checked={enableInternalTransferOut}
            onCheckedChange={value => setEnableInternalTransferOut(!!value)}
          />
          <Label htmlFor="enableInternalTransferOut">{t('home.enableInternalTransferOut')}</Label>
        </div>
      </div>
    </RrhCard>
  );
};
