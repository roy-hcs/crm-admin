import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { FormInput } from '@/components/form/FormInput';
import { FormField } from '@/components/ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { RichTextEditor } from '@/pages/message/management/components/RichTextEditor';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormValues } from '../form-types';
import { useFieldArray } from 'react-hook-form';

export function StepTwo() {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();
  const { fields: languageListFields } = useFieldArray({
    control: form.control,
    name: 'languageList',
  });
  const [activeLang, setActiveLang] = useState('zh-CN');
  return (
    <div>
      <RrhSwitchGroup
        value={activeLang}
        onValueChange={value => {
          setActiveLang(value);
        }}
        labelClassName="font-medium"
        switchItems={(languageListFields || [])?.map(i => ({
          value: i?.language || '',
          label: i?.languageName || '',
          disabled: true,
        }))}
      />
      <div>
        {languageListFields.map((i, index) => {
          return (
            <div key={i.language} className={cn(activeLang === i.language ? 'block' : 'hidden')}>
              <div className="py-3">
                <FormInput
                  verticalLabel
                  name={`languageList.${index}.goodsName`}
                  label={t('products.name')}
                  placeholder={t('rules.limitLength', {
                    field: 50,
                  })}
                  maxLength={50}
                  disabled={i.language === 'zh-CN'}
                />
              </div>
              <div className="py-3">
                <FormField
                  name={`languageList.${index}.goodsContent`}
                  render={({ field }) => {
                    return (
                      <RichTextEditor
                        field={field}
                        title={t('products.goodIntroduction')}
                        placeholder={t('common.pleaseInput', {
                          field: t('table.content'),
                        })}
                      />
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
