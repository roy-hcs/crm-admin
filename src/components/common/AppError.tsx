import { useTranslation } from 'react-i18next';

export const AppError = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-red-500">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-red-600">{t('common.AnErrorOccurred')}</h2>
        <p className="mb-4 text-gray-700">{t('common.SomethingWentWrongPleaseTryAgainLater')}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          {t('common.ReloadPage')}
        </button>
      </div>
    </div>
  );
};
