import { useEditKycColumnInfo, useGetKycColumnInfo } from '@/api/hooks/agent/agent';
import { Country } from '@/api/hooks/system/types';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhDynamicForm, SubmitValue } from '@/components/common/RrhDynamicForm';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const EditKycInfoDialog = ({
  open,
  setOpen,
  userId,
  type,
  countryList,
  editType,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  editType: 'read' | 'edit';
  type: '2' | '3' | '4';
  countryList?: Country[];
}) => {
  const { t } = useTranslation();
  const { data: personalInfoRes, refetch } = useGetKycColumnInfo(userId, type);
  const { mutate: editKycInfo, isPending, error } = useEditKycColumnInfo(type, userId);
  const personalInfo = personalInfoRes?.data;
  const columns = personalInfo?.columns || [];
  const title = useMemo(() => {
    const editText = editType === 'edit' ? t('common.Edit') : t('common.View');
    let typeText = '';
    switch (type) {
      case '2':
        typeText = t('accountOpening.personalInformation');
        break;
      case '3':
        typeText = t('accountOpening.financialInformation');
        break;
      case '4':
        typeText = t('accountOpening.identityInformation');
        break;
    }
    return `${editText} ${typeText}`;
  }, [editType, type, t]);
  const onSubmit = (data: SubmitValue[]) => {
    editKycInfo(data, {
      onSuccess: () => {
        setOpen(false);
        refetch();
        toast.success(t('common.modifySuccess'));
      },
      onError: () => {
        toast.error(error?.message || t('common.modifyFailed'));
      },
    });
  };
  return (
    <RrhDialog
      title={title}
      open={open}
      onOpenChange={setOpen}
      variant="middle"
      footerShow={false}
      className="pb-22"
    >
      <RrhDynamicForm
        columns={columns}
        type={editType}
        onSubmit={onSubmit}
        countryList={countryList}
        isPending={isPending}
        onCancel={() => setOpen(false)}
      />
    </RrhDialog>
  );
};
