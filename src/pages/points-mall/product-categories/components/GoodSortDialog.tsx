import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import {
  GoodsClassificationItem,
  useAddGoodsClassification,
  useCheckClassificationName,
  useEditGoodsClassification,
  useGoodsClassificationDetail,
} from '@/api/hooks/pointsMall';
import { toast } from 'sonner';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  name: string;
  classificationName?: Record<string, string>;
  parentId?: string;
  sort: string;
  language?: string;
};

const addGoodsSchema = (t: TFunction<'translation', undefined>) => {
  return {
    name: z.string().min(
      1,
      t('rules.required', {
        field: t('productCategories.classificationNameSimplified', {
          language: t('productCategories.zhName'),
        }),
      }),
    ),
    classificationName: z.record(z.string()).optional(),
    sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
    language: z.string().optional(),
    parentId: z.string().optional(),
  } as const;
};

export const GoodSortDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  detail,
  onSuccess,
  languageOptions,
  parentOptions,
}: {
  mode: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  detail?: GoodsClassificationItem;
  onSuccess?: () => void;
  languageOptions: { label: string; value: string }[];
  parentOptions: { label: string; value: string }[];
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [step, setStep] = useState('one' as 'one' | 'two');
  const [languageIdList, setLanguageIdList] = useState<{ label: string; value: string }[]>([]); // 已经校验过的名称列表，避免重复校验
  const { mutateAsync: addGoodSort } = useAddGoodsClassification();
  const { mutateAsync: editGoodSort } = useEditGoodsClassification();
  const { mutateAsync: goodDetail } = useGoodsClassificationDetail();
  const { mutateAsync: checkName } = useCheckClassificationName();

  // 校验名称是否重复，返回 true 表示通过，false 表示不通过并设置表单错误
  const validateName = async (
    field: keyof FormValues | string,
    value: string,
    language: string,
  ) => {
    try {
      if (!value || !String(value).trim()) {
        return true;
      }
      const params: { classificationName: string; language: string; id?: string } = {
        classificationName: value,
        language,
      };
      if (mode === 'edit') {
        // 编辑模式需要把当前语言的id传给接口，避免校验时把自己也校验一遍导致重复校验不通过
        const languageId = languageIdList.find(i => i.label === language)?.value;
        if (languageId) {
          params.id = languageId;
        }
      }
      const res = await checkName(params);
      if (res?.code === 0) {
        form.clearErrors(field as keyof FormValues);
        return true;
      }
      // 设置表单错误
      form.setError(field as keyof FormValues, {
        type: 'manual',
        message: res?.msg,
      });
      return false;
    } catch (error) {
      console.error('Error validating name:', error);
      return false;
    }
  };

  const languageList = useMemo(() => {
    // 过滤简体中文 因为简体中文是默认的必选项 不需要在多语言选项里展示
    return languageOptions.filter((i: { value: string }) => i.value !== 'zh-CN');
  }, [languageOptions]);

  const schema = useMemo(
    () =>
      z.object(addGoodsSchema(t)).superRefine((data, ctx) => {
        const langs = data?.language?.split(',') || [];
        if (step === 'two') {
          langs.forEach(lang => {
            const val = data.classificationName?.[lang];
            if (String(val).trim() === '') {
              const label = languageList.find(o => o.value === lang)?.label || lang;
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('rules.required', {
                  field: `${t('productCategories.classificationNameSimplified', { language: label })}`,
                }),
                path: ['classificationName', lang],
              });
            }
          });
        }
      }),
    [t, languageList, step],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      classificationName: {},
      parentId: '',
      sort: '',
      language: '',
    },
  });

  const language = form.watch('language');

  const onSubmit = async (data: FormValues) => {
    try {
      // 先做一次所有语言的重复校验，失败则中断提交
      const okMain = await validateName('name', data.name, 'zh-CN');
      if (!okMain) return;
      for (const kye in data.classificationName) {
        if (Object.prototype.hasOwnProperty.call(data.classificationName, kye)) {
          const ok = await validateName(
            `classificationName.${kye}`,
            data.classificationName[kye],
            kye,
          );
          if (!ok) return;
        }
      }
      setIsSubmitting(true);
      const languageList = [];
      for (const kye in data.classificationName) {
        if (Object.prototype.hasOwnProperty.call(data.classificationName, kye)) {
          languageList.push({
            language: kye,
            classificationName: data?.classificationName[kye] || '',
          });
        }
      }
      // 单独加简体中文 zh-CN
      languageList.unshift({
        language: 'zh-CN',
        classificationName: data.name,
      });
      const param = {
        classificationName: data.name,
        parentId: data?.parentId || '',
        sort: data?.sort || '',
        languageList: languageList,
      };
      if (mode === 'edit' && detail?.id) {
        Object.assign(param, { id: String(detail.id) });
      }
      const res = mode === 'add' ? await addGoodSort(param) : await editGoodSort(param);
      if (res?.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    setStep('one');
    form.reset();
  };

  const onCancel = () => {
    setOpen(false);
    form.reset();
    setStep('one');
  };

  const onConfirm = async () => {
    if (!language?.length) {
      // 没有下一步的情况 直接提交
      form.handleSubmit(onSubmit)();
      return;
    }
    switch (step) {
      case 'one': {
        const ok = await form.trigger(['name', 'sort']);
        if (ok) {
          // 进入下一步前校验主名称是否重复
          const mainOk = await validateName('name', form.getValues('name'), 'zh-CN');
          if (!mainOk) return;
          const selectLang = (form.getValues('language')?.split(',') || []).filter(Boolean);
          const langs = form.getValues('classificationName') || {};
          const classificationName = {} as Record<string, string>;
          // 因为有编辑和新增所以 对比用户选择的语言和输入的多语言名称，保证每个选择的语言都有对应的名称 即使用户没有输入也要传一个空字符串，避免zod校验出现默认的required错误提示
          selectLang.forEach(key => {
            classificationName[key] = key in langs ? langs[key] : '';
          });
          form.setValue('classificationName', classificationName);
          setStep('two');
        }
        break;
      }
      case 'two':
        form.handleSubmit(onSubmit)();
        break;
    }
  };

  useEffect(() => {
    if (mode === 'edit' && detail?.id) {
      // 编辑模式 初始数据
      async function getDetail() {
        const res = await goodDetail(String(detail?.id) || '');
        if (res?.code === 0) {
          const detailData = res.data.goodsClassification;
          const classificationName = {} as Record<string, string>;
          detailData.languageList
            .filter(i => i.language !== 'zh-CN') // 过滤掉简体中文 因为简体中文是默认的必选项 不需要在多语言选项里展示
            .forEach(i => {
              const key = i?.language ?? '1';
              classificationName[key] = i?.classificationName ?? '';
            });
          form.setValue('name', detailData.classificationName || '');
          form.setValue('parentId', detailData.parentId ? String(detailData.parentId) : '');
          form.setValue('sort', detailData.sort ? String(detailData.sort) : '');
          form.setValue(
            'language',
            detailData.languageList
              ?.map(i => i.language)
              .filter(i => i !== 'zh-CN') // 过滤掉简体中文 因为简体中文是默认的必选项 不需要在多语言选项里展示
              .join(',') || '',
          );
          form.setValue('classificationName', classificationName);
          // 编辑模式时校验接口需要用到对应语言的id，所以把语言和id的映射关系存一下 而且不过滤掉简体中文 因为校验接口需要
          setLanguageIdList(
            detailData.languageList?.map(i => ({
              label: i.language || '',
              value: i.id || '',
            })) || [],
          );
        }
      }
      getDetail();
    }
  }, [mode, form, detail, goodDetail]);

  function confirmTextFun() {
    if (language && language?.length > 0) {
      return step === 'one' ? t('common.next') : t('common.Confirm');
    } else {
      return t('common.Confirm');
    }
  }

  return (
    <RrhDialog
      trigger={
        <RrhButton variant="outline" Icon={<Plus className="size-3.5" />}>
          {mode === 'add' ? t('productCategories.addSort') : t('productCategories.editSort')}
        </RrhButton>
      }
      title={mode === 'add' ? t('productCategories.addSort') : t('productCategories.editSort')}
      isConfirmDisabled={isSubmitting}
      open={open}
      confirmText={confirmTextFun()}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1">
        <div className={cn(step === 'one' ? 'block' : 'hidden')}>
          <div className="py-3">
            <FormInput
              verticalLabel
              name="name"
              label={t('productCategories.classificationNameSimplified', {
                language: t('productCategories.zhName'),
              })}
              placeholder={t('productCategories.enterClassificationName')}
              maxLength={30}
              onBlur={e => validateName('name', String(e.target.value), 'zh-CN')}
            />
          </div>
          <div className="py-3">
            <FormSelect
              name="parentId"
              label={t('productCategories.parentId')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={parentOptions}
            />
          </div>
          <div className="py-3">
            <FormInput
              verticalLabel
              name="sort"
              label={t('table.sort')}
              placeholder={t('common.sortPlaceholder')}
            />
          </div>
          <div className="py-3">
            <FormField
              name="language"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <div className="flex w-full justify-between">
                        <div>{t('productCategories.displayLanguage')}</div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            className={cn('data-[state=checked]:border-slate-700')}
                            checked={
                              language?.length === languageList.map(i => i.value).join(',')?.length
                            }
                            onCheckedChange={() => {
                              if (
                                language?.length ===
                                languageList.map(i => i.value).join(',')?.length
                              ) {
                                field.onChange('');
                              } else {
                                field.onChange(languageList.map(i => i.value).join(','));
                              }
                            }}
                            aria-label="Select row"
                          />
                          <span>{t('common.selectAll')}</span>
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <RrhCheckBoxGroup
                        onValueChange={v => {
                          field.onChange(v);
                        }}
                        value={field.value}
                        checkItems={languageList}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
        {step === 'two' && language?.length
          ? (language?.split(',') || []).map(lang => {
              const label = languageList.find(o => o.value === lang)?.label;
              return (
                <div className="py-3" key={lang}>
                  <FormInput
                    verticalLabel
                    name={`classificationName.${lang}`}
                    label={t('productCategories.classificationNameSimplified', {
                      language: label,
                    })}
                    placeholder={t('productCategories.enterClassificationName')}
                    maxLength={30}
                    onBlur={e =>
                      validateName(`classificationName.${lang}`, String(e.target.value), lang)
                    }
                  />
                </div>
              );
            })
          : null}
      </RrhForm>
    </RrhDialog>
  );
};
