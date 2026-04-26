import { companyInfo } from '../data/site';
import { readStoreValue, writeStoreValue } from './firebaseStore';

export const SETTINGS_STORAGE_KEY = 'settings';

export const defaultSettings = {
  companyName: companyInfo.name,
  tagline: companyInfo.tagline,
  email: companyInfo.email,
  phone: companyInfo.phone,
  address: '',
  companyAddress: '',
  website: '',
  description: '',
  logoUrl: '',
  linkedin: '',
  github: '',
  instagram: '',
  whatsapp: '',
  supportEmail: '',
  businessHours: '',
  upiId: '',
  bankName: '',
  accountNumber: '',
  supportDays: '',
  defaultTerms: '',
  quotationTerms: '',
  defaultRevisionCount: '',
  footerText: '',
};

export const normalizeSettings = (value) => {
  if (!value || typeof value !== 'object') return { ...defaultSettings };

  return Object.fromEntries(
    Object.entries(defaultSettings).map(([key, fallback]) => {
      const nextValue = value[key];
      if (nextValue === undefined || nextValue === null) return [key, fallback];
      return [key, String(nextValue).trim()];
    })
  );
};

export const readSettings = async () => {
  const value = await readStoreValue(SETTINGS_STORAGE_KEY, null);
  if (!value) return { ...defaultSettings };
  return normalizeSettings(value);
};

export const writeSettings = async (value) => {
  const next = normalizeSettings(value);
  await writeStoreValue(SETTINGS_STORAGE_KEY, next);
  return next;
};
