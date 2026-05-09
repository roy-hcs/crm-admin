import { FormInput } from '@/components/form/FormInput';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { useTranslation } from 'react-i18next';

interface LanguageItem {
  dictLabel: string;
  dictValue: string;
  isDefault: string;
}

interface RebateRuleFormStep3Props {
  languageList: LanguageItem[] | undefined;
  selectedLanguageOptions: string;
  setSelectedLanguageOptions: (value: string) => void;
  selectedLangList: LanguageItem[];
}

export const RebateRuleFormStep3 = ({
  languageList,
  selectedLanguageOptions,
  setSelectedLanguageOptions,
  selectedLangList,
}: RebateRuleFormStep3Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <div>{t('TradingRebateSettings.multipleLanguageSetting')}</div>
      <div className="flex flex-col gap-4">
        <div>
          <RrhCheckBoxGroup
            onValueChange={v => {
              setSelectedLanguageOptions(v);
            }}
            value={selectedLanguageOptions}
            checkItems={(languageList || [])
              .filter(item => item.isDefault === 'N')
              .map(item => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
          />
          <div className="mt-4 flex flex-col gap-4">
            {selectedLangList.map((lang, index) => {
              const isDefault = lang.isDefault === 'Y';
              return (
                <div key={lang.dictValue}>
                  <FormInput
                    name={`traderLanguages.${index}.ruleName`}
                    disabled={isDefault}
                    label={t('table.ruleName') + ` (${lang.dictLabel})`}
                    verticalLabel
                    placeholder=""
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
