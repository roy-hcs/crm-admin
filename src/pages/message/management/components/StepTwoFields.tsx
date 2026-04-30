import { FormField } from '@/components/ui/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { cn } from '@/lib/utils';
import { RichTextEditor } from './RichTextEditor';
import { useTranslation } from 'react-i18next';

export function StepTwoFields({
  language,
  activeLang,
  setActiveLang,
  languageOptions,
}: {
  language: string;
  activeLang: string;
  setActiveLang: (lang: string) => void;
  languageOptions: Array<{ label: string; value: string }>;
}) {
  const { t } = useTranslation();

  return (
    <>
      <RrhSwitchGroup
        value={activeLang}
        onValueChange={setActiveLang}
        labelClassName="font-medium"
        switchItems={language.split(',').map(lang => ({
          value: lang,
          label: languageOptions.find(o => o.value === lang)?.label || '',
        }))}
      />
      <div>
        {language.split(',').map(lang => {
          const label = languageOptions.find(o => o.value === lang)?.label || '';
          return (
            <div key={lang} className={cn(activeLang === lang ? 'block' : 'hidden')}>
              <div className="py-6">
                <FormInput
                  verticalLabel
                  name={`title.${lang}`}
                  label={t('messageManagement.inputTitle', { field: label })}
                  placeholder={t('common.pleaseInput', { field: t('table.title') })}
                  maxLength={64}
                />
              </div>
              <div className="py-6">
                <FormField
                  name={`content.${lang}`}
                  render={({ field }) => (
                    <RichTextEditor
                      field={field}
                      title={t('messageManagement.inputContent', { field: label })}
                      placeholder={t('common.pleaseInput', { field: t('table.content') })}
                    />
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
