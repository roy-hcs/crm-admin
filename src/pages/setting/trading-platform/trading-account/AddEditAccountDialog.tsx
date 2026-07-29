import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { TradingAccountItem } from '@/api/hooks/setting/types';
import { useAddTradingAccount, useMtServerTypeDetail } from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { SelectOption } from '@/api/types';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/form/FormInput';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';
import { serverMap } from '@/lib/constant';

type FormValues = {
  nameLanguageMap: Record<string, string>;
  serverType: string;
};

export const AddEditAccountDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  languageOptions,
  onSuccess,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: TradingAccountItem;
  languageOptions: SelectOption[];
  onSuccess?: () => void;
}) => {
  const defaultLanguage = String(languageOptions?.[0]?.value || 'zh-CN');

  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [activeLang, setActiveLang] = useState(defaultLanguage);
  const [languageIdMap, setLanguageIdMap] = useState<Record<string, string>>({});

  const { data: detail, isLoading: detailLoading } = useMtServerTypeDetail(
    { id: item?.id || '' },
    { enabled: mode === 'edit' && open && Boolean(item?.id) },
  );

  const { mutateAsync: save, isPending: isSavePending } = useAddTradingAccount();

  const schema = useMemo(
    () =>
      z
        .object({
          nameLanguageMap: z.record(z.string(), z.string()),
          serverType: z
            .string()
            .min(1, t('rules.required', { field: t('table.transactionPlatform') })),
        })
        .superRefine((values, ctx) => {
          // 切换到哪个 哪个就要必填 但是中文必须必填
          const activeName = values.nameLanguageMap?.[activeLang]?.trim();
          if (!activeName) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['nameLanguageMap', activeLang],
              message: t('rules.required', { field: t('products.goodsName') }),
            });
          }
        }),
    [activeLang, t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameLanguageMap: {},
      serverType: '',
    },
  });

  const serviceType = useMemo(() => {
    const arr = Object.entries(serverMap).map(([value, label]) => ({
      value,
      label,
    }));
    return arr;
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveLang(defaultLanguage);
    const languageMap = languageOptions.reduce<Record<string, string>>((acc, option) => {
      acc[String(option.value)] = '';
      return acc;
    }, {});
    const nameIdMap: Record<string, string> = {};

    if (mode === 'edit' && item?.id) {
      const detailData = detail?.data;
      if (!detailData) return;

      (detailData.nameLanguageList || []).forEach(entry => {
        const language = entry.language || '';
        if (!language) return;
        languageMap[language] = entry.accountTypeName || '';
        if (entry.id) {
          nameIdMap[language] = entry.id;
        }
      });

      setLanguageIdMap(nameIdMap);
      form.reset({
        nameLanguageMap: languageMap,
        serverType: String(detailData.serverType ?? ''),
      });
      return;
    }

    setLanguageIdMap({});

    form.reset({
      nameLanguageMap: languageMap,
      serverType: '',
    });
  }, [open, mode, item?.id, detail?.data, form, languageOptions, defaultLanguage]);

  const onCancel = () => {
    onClose(false);
    setActiveLang(defaultLanguage);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setLanguageIdMap({});
    }
  };

  const onSubmit = async (data: FormValues) => {
    // 默认语言没有填写 需要跳转到默认语言的输入框
    if (!data.nameLanguageMap?.[defaultLanguage]?.trim()) {
      setActiveLang(defaultLanguage);
      form.setError(`nameLanguageMap.${defaultLanguage}`, {
        type: 'manual',
        message: t('rules.required', { field: t('products.goodsName') }),
      });
      return;
    }
    try {
      const nameLanguageList = languageOptions.map(option => {
        const language = String(option.value);
        return {
          id: languageIdMap[language] || '',
          language,
          accountTypeName: (data.nameLanguageMap?.[language] || '').trim(),
        };
      });

      const res = await save({
        ...(mode === 'edit' && item?.id ? { id: item.id } : {}),
        nameLanguageList,
        serverType: data.serverType,
      });

      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', {
              field: t('tradingAccountPage.title'),
            })
          : t('common.modify', {
              field: t('tradingAccountPage.title'),
            })
      }
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isSavePending || detailLoading}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isSavePending || detailLoading}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <RrhSwitchGroup
          value={activeLang}
          onValueChange={value => {
            setActiveLang(value);
          }}
          switchItems={languageOptions}
        />
        <div>
          {languageOptions.map(lang => {
            return (
              <div key={lang.value} className={cn(activeLang === lang.value ? 'block' : 'hidden')}>
                <FormInput
                  name={`nameLanguageMap.${String(lang.value)}`}
                  label={`${t('products.goodsName')} (${lang.label})`}
                  placeholder={t('rules.limitLength', {
                    field: 24,
                  })}
                  maxLength={24}
                />
              </div>
            );
          })}
        </div>

        <FormSelect
          name="serverType"
          label={t('table.transactionPlatform')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={serviceType}
        />
      </RrhForm>
    </RrhDialog>
  );
};
