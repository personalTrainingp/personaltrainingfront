import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';

export const Languages = {
	EN: 'en',
	ES: 'es',
};

export const isValidLanguage = (lang) => Object.values(Languages).includes(lang);

i18n.use(initReactI18next).init({
	lng: Languages.EN,
	resources: {
		[Languages.ES]: { translation: es },
	},
});

export default i18n;
