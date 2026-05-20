import type { ProductDetailRes } from '@/api/hooks/pointsMall';
import type { FormValues, LanguageOption } from './form-types';

export const createDefaultFormValues = (): FormValues => ({
  id: '',
  goodName: '',
  payType: '1',
  exchangePoints: '',
  status: '1',
  sort: '',
  firstClassificationId: '',
  secondClassificationId: '',
  goodsType: '1',
  virtualGoodsType: '1',
  fileList: [],
  countryId: '',
  applicableRoles: '',
  languageList: [],
  combinationPaymentList: [
    {
      exchangePoint: '',
      exchangeAmount: '',
    },
  ],
});

const parseLanguageList = (value: unknown): FormValues['languageList'] => {
  if (Array.isArray(value)) {
    return value
      .map(item => ({
        language: String((item as { language?: unknown })?.language || ''),
        goodsName: String((item as { goodsName?: unknown })?.goodsName || ''),
        goodsContent: String((item as { goodsContent?: unknown })?.goodsContent || ''),
        languageName: String((item as { languageName?: unknown })?.languageName || ''),
      }))
      .filter(item => item.language);
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      return parseLanguageList(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
};

export const buildDefaultLanguageList = (
  languageOptions: LanguageOption[] | undefined,
  goodName: string,
): FormValues['languageList'] => {
  if (!languageOptions?.length) return [];
  return languageOptions.map(item => ({
    language: item.dictValue,
    goodsName: item.dictValue === 'zh-CN' ? goodName : '',
    goodsContent: '',
    languageName: item.dictLabel,
  }));
};

export const buildFormValuesFromDetail = (
  detailRes: ProductDetailRes | undefined,
  languageOptions: LanguageOption[] | undefined,
): FormValues => {
  const defaults = createDefaultFormValues();
  const goodsObject = detailRes?.data?.goodsObject;
  if (!goodsObject) return defaults;

  const existingFileList = (goodsObject.goodsPicture || '')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean)
    .map((fileUrl, index) => ({
      id: `${index + 1}`,
      fileUrl,
      fileName: fileUrl.split('/').pop() || `image-${index + 1}`,
    }));

  const detailLanguageList = parseLanguageList(goodsObject.languageList);
  const fallbackLanguageList = buildDefaultLanguageList(
    languageOptions,
    goodsObject.goodsName || '',
  );
  const languageList = detailLanguageList.length
    ? detailLanguageList
    : fallbackLanguageList.length
      ? fallbackLanguageList
      : [
          {
            language: 'zh-CN',
            goodsName: goodsObject.goodsName || '',
            goodsContent: goodsObject.goodsContent || '',
            languageName: '简体中文',
          },
        ];

  const combinationPaymentList = (goodsObject.combinationPaymentList || []).map(item => ({
    exchangePoint: String(item.exchangePoint ?? ''),
    exchangeAmount: String(item.exchangeAmount ?? ''),
  }));

  return {
    ...defaults,
    id: goodsObject.id || '',
    goodName: goodsObject.goodsName || '',
    payType: goodsObject.paymentPlan || '1',
    exchangePoints: String(goodsObject.exchangePoints ?? ''),
    status: String(goodsObject.status ?? 1),
    sort: String(goodsObject.sort ?? ''),
    firstClassificationId: goodsObject.firstClassificationId || '',
    secondClassificationId: goodsObject.secondClassificationId || '',
    goodsType: String(goodsObject.goodsType ?? 1),
    virtualGoodsType: goodsObject.virtualGoodsType ? String(goodsObject.virtualGoodsType) : '1',
    fileList: existingFileList,
    countryId: goodsObject.countryId || '',
    applicableRoles: goodsObject.applicableRoles || '',
    languageList,
    combinationPaymentList:
      combinationPaymentList.length === 0
        ? [
            {
              exchangePoint: '',
              exchangeAmount: '',
            },
          ]
        : combinationPaymentList,
  };
};
