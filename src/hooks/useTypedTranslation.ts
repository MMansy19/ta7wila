import { useTranslation } from 'react-i18next';

export const useTypedTranslation = () => {
  return useTranslation<'translation'>();
};