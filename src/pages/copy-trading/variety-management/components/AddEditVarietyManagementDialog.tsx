import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { SelectOption } from '@/api/types';
import {
  useAddMamSymbol,
  useCheckDefaultNameUnique,
  useCheckNameUnique,
  useEditMamSymbol,
  useMamSymbolDetail,
} from '@/api/hooks/copyTrading';
import { AddMamSymbolParams } from '@/api/hooks/copyTrading/type';

type FormValues = AddMamSymbolParams;

export const AddEditVarietyManagementDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  title,
  symbolCategoryOptions,
}: {
  mode: 'add' | 'edit' | 'view';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  title: string;
  symbolCategoryOptions: SelectOption[];
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const isAddMode = mode === 'add';
  const isViewMode = mode === 'view';
  const isReadOnly = isViewMode;
  const disabledAfterAdd = !isAddMode;

  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        symbolCategory: z.string().min(
          1,
          t('rules.required', {
            field: t('varietyManagement.symbolCategory'),
          }),
        ),
        symbol: z.string().min(1, t('rules.required', { field: t('varietyManagement.symbol') })),
        cname: z.string(),
        enname: z.string(),
        sort: z.string().min(
          1,
          t('rules.required', {
            field: t('table.sort'),
          }),
        ),
        defaultNames: z.array(
          z.string().min(1, t('rules.required', { field: t('varietyManagement.name') })),
        ),
      }),
    ),
    defaultValues: {
      symbolCategory: '',
      symbol: '',
      cname: '',
      enname: '',
      sort: '',
      defaultNames: [''],
    },
  });
  const defaultNames = form.watch('defaultNames') || [''];
  const { mutateAsync: add } = useAddMamSymbol();
  const { mutateAsync: edit } = useEditMamSymbol();
  const { mutateAsync: getDetail } = useMamSymbolDetail();
  const { mutateAsync: checkName } = useCheckNameUnique();
  const { mutateAsync: checkDefaultName } = useCheckDefaultNameUnique();

  const onSubmit = async (data: FormValues) => {
    if (isViewMode) {
      onClose(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const symbolValue = data.symbol.trim();
      if (mode === 'add') {
        // 提交时兜底校验，防止仅靠失焦校验被绕过
        if (symbolValue) {
          const symbolDuplicated = await checkName({ symbol: symbolValue });
          if (symbolDuplicated) {
            form.setError('symbol', { message: t('rules.nameAlreadyUsed') });
            return;
          }
          form.clearErrors('symbol');
        }
      }

      const normalizedDefaultNames =
        data.defaultNames?.map(item => item.trim()).filter(Boolean) || [];

      // 默认名称并发校验，避免串行请求带来的等待
      const duplicateChecks = await Promise.all(
        normalizedDefaultNames.map(name => checkDefaultName({ name, id: id || '' })),
      );
      const duplicatedIndex = duplicateChecks.findIndex(item => item);
      if (duplicatedIndex !== -1) {
        form.setError(`defaultNames.${duplicatedIndex}` as FieldPath<FormValues>, {
          message: t('rules.nameAlreadyUsed'),
        });
        return;
      }
      normalizedDefaultNames.forEach((_, index) => {
        form.clearErrors(`defaultNames.${index}` as FieldPath<FormValues>);
      });

      const params = {
        symbolCategory: data.symbolCategory,
        symbol: symbolValue,
        cname: data.cname,
        enname: data.enname,
        sort: data.sort,
        defaultNames: normalizedDefaultNames,
      };
      const res = mode === 'add' ? await add(params) : await edit({ ...params, id: id || '' });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    onClose(false);
  };

  const onConfirm = () => {
    if (isViewMode) return;
    void form.handleSubmit(onSubmit)();
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset({
      symbolCategory: '',
      symbol: '',
      cname: '',
      enname: '',
      sort: '',
      defaultNames: [''],
    });
  };

  useEffect(() => {
    // 编辑和查看模式打开弹窗时需要初始化详情数据
    if (isAddMode || !id || !open) return;
    async function fetchDetail() {
      try {
        setIsDetailLoading(true);
        const res = await getDetail(id || '');
        if (res.code === 0) {
          const detail = res.data;
          const defaultNames = (detail.defaultNames || []).filter(Boolean);
          form.reset({
            symbolCategory: detail.symbolCategory || '',
            symbol: detail.symbol || '',
            cname: detail.cname || '',
            enname: detail.enname || '',
            sort: detail.sort ? String(detail.sort) : '',
            defaultNames: defaultNames.length > 0 ? defaultNames : [''],
          });
          setIsDetailLoading(false);
        }
      } catch {
        toast.error(t('common.fail'));
      }
    }

    fetchDetail();
  }, [isAddMode, form, id, getDetail, open, t]);

  return (
    <RrhDialog
      trigger={
        isAddMode ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={title}
      isConfirmDisabled={isSubmitting || isDetailLoading}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type={isViewMode ? 'view' : 'submit'}
      confirmText={isViewMode ? t('common.close') : t('common.Confirm')}
      cancelShow={!isViewMode}
      formLoading={isSubmitting || isDetailLoading}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormSelect
            name="symbolCategory"
            label={t('varietyManagement.symbolCategory')}
            verticalLabel
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={symbolCategoryOptions}
            disabled={disabledAfterAdd}
            labeTipsDom={
              disabledAfterAdd ? (
                <div className="text-muted-foreground text-xs leading-4">
                  {t('common.cannotModifyAfterSubmit')}
                </div>
              ) : null
            }
          />

          <FormInput
            verticalLabel
            name="symbol"
            label={t('varietyManagement.symbol')}
            placeholder={t('common.pleaseInput', { field: t('varietyManagement.symbol') })}
            disabled={disabledAfterAdd}
            labeTipsDom={
              disabledAfterAdd ? (
                <div className="text-muted-foreground text-xs leading-4">
                  {t('common.cannotModifyAfterSubmit')}
                </div>
              ) : null
            }
            onBlur={async e => {
              const value = e.target.value.trim();
              if (!value) return;
              try {
                const ok = await checkName({ symbol: value });
                if (ok) {
                  form.setError('symbol', { message: t('rules.nameAlreadyUsed') });
                } else {
                  form.clearErrors('symbol');
                }
              } catch {
                form.setError('symbol', { message: t('common.fail') });
              }
            }}
          />

          <FormInput
            verticalLabel
            name="cname"
            label={t('varietyManagement.cname')}
            placeholder={t('common.pleaseInput', { field: t('varietyManagement.cname') })}
            disabled={isReadOnly}
          />

          <FormInput
            verticalLabel
            name="enname"
            label={t('varietyManagement.enname')}
            placeholder={t('common.pleaseInput', { field: t('varietyManagement.enname') })}
            disabled={isReadOnly}
          />

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-foreground text-sm font-medium">
                {t('varietyManagement.name')}
              </div>
              <div className="flex items-center gap-2">
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isReadOnly}
                  onClick={() => {
                    form.setValue('defaultNames', [...defaultNames, '']);
                  }}
                >
                  +
                </RrhButton>
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isReadOnly || defaultNames.length <= 1}
                  onClick={() => {
                    if (defaultNames.length > 1) {
                      form.setValue('defaultNames', defaultNames.slice(0, -1));
                    }
                  }}
                >
                  -
                </RrhButton>
              </div>
            </div>
            {defaultNames.map((_: string, index: number) => (
              <FormInput
                key={`default-name-${index}`}
                verticalLabel
                name={`defaultNames.${index}` as FieldPath<FormValues>}
                label=""
                placeholder={t('common.pleaseInput', { field: t('varietyManagement.name') })}
                disabled={isReadOnly}
                onBlur={async e => {
                  const value = e.target.value.trim();
                  if (!value) return;
                  try {
                    const ok = await checkDefaultName({ name: value, id: id || '' });
                    if (ok) {
                      form.setError(`defaultNames.${index}` as FieldPath<FormValues>, {
                        message: t('rules.nameAlreadyUsed'),
                      });
                    } else {
                      form.clearErrors(`defaultNames.${index}` as FieldPath<FormValues>);
                    }
                  } catch {
                    form.setError(`defaultNames.${index}` as FieldPath<FormValues>, {
                      message: t('common.fail'),
                    });
                  }
                }}
              />
            ))}
          </div>

          <FormInput
            verticalLabel
            name="sort"
            label={t('table.sort')}
            placeholder="1-9999"
            disabled={isReadOnly}
          />
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
