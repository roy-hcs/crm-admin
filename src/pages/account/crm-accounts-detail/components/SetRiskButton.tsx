import { useSetRiskRatingInfo } from '@/api/hooks/agent/agent';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
type RiskFormValues = {
  ipTrust: string;
  deviceTrust: string;
};
export const SetRiskButton = ({
  userId,
  ip,
  ipTrust,
  device,
  deviceTrust,
  onSuccess,
}: {
  userId: string;
  ip: string;
  ipTrust: string;
  device: string;
  deviceTrust: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutate: setRisk } = useSetRiskRatingInfo();
  const [open, setOpen] = useState(false);
  const trustOptions = [
    { value: 'none', label: t('common.pleaseSelect') },
    { value: '0', label: t('table.trust') },
    { value: '1', label: t('table.untrust') },
    { value: '2', label: t('table.normal') },
  ];
  const form = useForm<RiskFormValues>({
    defaultValues: {
      ipTrust,
      deviceTrust,
    },
  });
  const onSubmit = (data: RiskFormValues) => {
    setRisk(
      {
        userId,
        ipAddr: ip,
        ipTrust: data.ipTrust === 'none' ? '' : data.ipTrust,
        device,
        deviceTrust: data.deviceTrust === 'none' ? '' : data.deviceTrust,
      },
      {
        onSuccess: () => {
          onSuccess();
          toast.success(t('common.success'));
        },
        onError: () => {
          toast.error(t('common.modifyFailed'));
        },
      },
    );
    setOpen(false);
  };
  return (
    <RrhDialog
      title={t('table.setRiskDialogTitle')}
      trigger={<RrhButton variant="ghost">{t('common.settings')}</RrhButton>}
      footerShow={false}
      open={open}
      onOpenChange={setOpen}
    >
      <RrhForm className="flex flex-col gap-4" form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormSelect
          verticalLabel
          showRowValue={false}
          label={ip}
          name="ipTrust"
          options={trustOptions}
        />
        <FormSelect
          verticalLabel
          showRowValue={false}
          label={device}
          name="deviceTrust"
          options={trustOptions}
        />
        <div className="flex justify-end gap-4">
          <RrhButton type="button" variant="outline" onClick={() => setOpen(false)}>
            {t('common.Cancel')}
          </RrhButton>
          <RrhButton type="submit">{t('common.Confirm')}</RrhButton>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
