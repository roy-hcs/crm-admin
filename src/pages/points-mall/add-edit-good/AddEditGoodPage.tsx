import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';

import { RrhForm } from '@/components/form/RrhForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '@/contexts/loading';
import { uploadFilesInArr } from '@/lib/upload';
import { useDictType, useUploadFile, useUserRoleList } from '@/api/hooks/system/system';
import { useCreateProduct, useEditProduct, useProductDetail } from '@/api/hooks/pointsMall';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { StepOne } from './components/StepOne';
import { cn } from '@/lib/utils';
import { StepTwo } from './components/StepTwo';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import z from 'zod';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import type { FormValues } from './form-types';
import {
  buildDefaultLanguageList,
  buildFormValuesFromDetail,
  createDefaultFormValues,
} from './form-utils';

export function AddEditGoodPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const mode = searchParams.get('type');
  const back = useTabBackNavigation('/points-mall/products');
  const { data: productDetailRes, isLoading: productDetailLoading } = useProductDetail(
    id || '',
    mode || '',
  );
  const [step, setStep] = useState<'one' | 'two'>('one');
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(createDefaultFormValues());
  const didInitFormRef = useRef(false);
  const initKeyRef = useRef('');
  const { withLoading } = useGlobalLoading();
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: createGood } = useCreateProduct();
  const { mutateAsync: editGood } = useEditProduct();

  const { data: roleRes, isLoading: roleLoading } = useUserRoleList({});
  const { data: languageRes, isLoading: languageLoading } = useDictType('sys_language');

  const required = (field: string) => t('rules.required', { field });
  const schema = z.object({
    id: z.string(),
    goodName: z
      .string()
      .trim()
      .min(1, required(t('products.name'))),
    payType: z.string(),
    exchangePoints: z.string(),
    status: z.string(),
    sort: z
      .string()
      .trim()
      .min(1, required(t('table.sort'))),
    firstClassificationId: z.string().optional(),
    secondClassificationId: z.string().optional(),
    goodsType: z.string(),
    virtualGoodsType: z.string().optional(),
    fileList: z.array(z.any()).min(1, required(t('products.goodPreviewImage'))),
    countryId: z.string().optional(),
    applicableRoles: z.string().optional(),
    languageList: z.array(
      z.object({
        language: z.string(),
        goodsName: z.string(),
        goodsContent: z.string(),
        languageName: z.string(),
      }),
    ),
    combinationPaymentList: z
      .array(
        z.object({
          exchangePoint: z.union([z.string(), z.number()]),
          exchangeAmount: z.union([z.string(), z.number()]),
        }),
      )
      .optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: createDefaultFormValues(),
  });
  const payTypeValue = form.watch('payType');
  const firstClassificationIdValue = form.watch('firstClassificationId');
  const goodsTypeValue = form.watch('goodsType');

  const handleNext = async () => {
    const isValid = await form.trigger(['goodName', 'sort', 'fileList']);
    if (!isValid) {
      return;
    }

    const values = form.getValues();
    const currentLanguageList = form.getValues('languageList');
    // 点击下一步 单独处理 languageList 的默认值，接口需要传所有语言的名称和介绍，前端先根据语言字典把所有语言的选项生成好，再根据用户输入的中文名称来设置对应语言的名称，其他语言名称先设置为空，后续用户可以编辑
    if (!currentLanguageList?.length) {
      form.setValue('languageList', buildDefaultLanguageList(languageRes, values?.goodName || ''));
    }
    setStep('two');
  };

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const fileData = await uploadFilesInArr(
          data.fileList,
          file => upload(file),
          t('ads.uploader'),
        );
        const fileUrls = fileData
          .map(i => i.fileUrls)
          .filter(url => url)
          .join(',');
        const coverPicture = fileUrls.split(',')[0] || '';
        const goodsPicture = fileUrls;
        const param = {
          exchangePoints: data.exchangePoints,
          status: Number(data.status),
          goodsType: Number(data.goodsType),
          virtualGoodsType: Number(data.virtualGoodsType),
          amount: '',
          currency: '',
          coverPicture: coverPicture,
          goodsPicture: goodsPicture,
          languageList: data.languageList,
          countryId: data.countryId || '',
          sort: Number(data.sort),
          firstClassificationId: data.firstClassificationId || '',
          secondClassificationId: data.secondClassificationId || '',
          applicableRoles: data.applicableRoles || '',
          paymentPlan: data.payType,
          combinationPaymentList: payTypeValue.includes('2')
            ? (data.combinationPaymentList ?? []).filter(
                item =>
                  String(item.exchangePoint ?? '').trim() ||
                  String(item.exchangeAmount ?? '').trim(),
              )
            : [],
        };
        const res =
          mode === 'edit'
            ? await editGood({
                id: data.id,
                ...param,
              })
            : await createGood(param);
        if (res.code === 0) {
          toast.success(t('common.success'));
          back();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };
  const handleReset = () => {
    // 新增模式重置到默认值，编辑模式重置到详情初始化值
    const values = mode === 'edit' ? initialFormValues : createDefaultFormValues();
    form.reset(values);
    setStep('one');
  };
  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const initKey = `${mode || 'add'}_${id || ''}`;
    if (initKeyRef.current !== initKey) {
      initKeyRef.current = initKey;
      didInitFormRef.current = false;
    }
  }, [id, mode]);

  useEffect(() => {
    if (didInitFormRef.current) return;

    if (mode === 'edit') {
      if (!id || !productDetailRes?.data?.goodsObject) return;
      const editValues = buildFormValuesFromDetail(productDetailRes, languageRes);
      form.reset(editValues);
      setInitialFormValues(editValues);
      setStep('one');
      didInitFormRef.current = true;
      return;
    }

    const addValues = createDefaultFormValues();
    form.reset(addValues);
    setInitialFormValues(addValues);
    setStep('one');
    didInitFormRef.current = true;
  }, [form, id, languageRes, mode, productDetailRes]);

  if (languageLoading || roleLoading || productDetailLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <RrhCard>
      <RrhForm form={form} className="grid gap-6">
        <div className={cn(step === 'one' ? 'block' : 'hidden')}>
          <StepOne
            payTypeValue={payTypeValue}
            firstClassificationIdValue={firstClassificationIdValue || ''}
            goodsTypeValue={goodsTypeValue}
            roleOptions={(roleRes?.rows || []).map(i => ({
              label: i.roleName,
              value: i.roleId,
            }))}
          />
        </div>

        <div className={cn(step === 'two' ? 'block' : 'hidden')}>
          <StepTwo />
        </div>

        {step === 'one' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton onClick={handleReset} variant="outline" type="button">
              {t('common.Reset')}
            </RrhButton>
            <RrhButton type="button" onClick={handleNext}>
              {t('common.next')}
            </RrhButton>
          </div>
        )}
        {step === 'two' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton
              onClick={() => {
                setStep('one');
              }}
              variant="outline"
              type="button"
            >
              {t('common.previousStep')}
            </RrhButton>
            <RrhButton type="button" onClick={handleConfirm}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        )}
      </RrhForm>
    </RrhCard>
  );
}
