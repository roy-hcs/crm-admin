import type { CreateProductCombinationPaymentItem } from '@/api/hooks/pointsMall';
import type { UploadItem } from './components/UploadFile';

export type FormValues = {
  id: string;
  goodName: string;
  payType: string;
  exchangePoints: string;
  status: string;
  sort: string;
  firstClassificationId?: string;
  secondClassificationId?: string;
  goodsType: string;
  virtualGoodsType?: string;
  fileList: UploadItem[];
  countryId?: string;
  applicableRoles?: string;
  languageList: Array<{
    language: string;
    goodsName: string;
    goodsContent: string;
    languageName: string;
  }>;
  combinationPaymentList?: CreateProductCombinationPaymentItem[];
};

export type LanguageOption = {
  dictValue: string;
  dictLabel: string;
};
