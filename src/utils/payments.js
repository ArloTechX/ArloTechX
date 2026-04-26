import { companyInfo } from '../data/site';
import { readStoreValue, writeStoreValue } from './firebaseStore';

export const PAYMENT_SETTINGS_STORAGE_KEY = 'paymentSettings';
export const PAYMENTS_STORAGE_KEY = 'payments';
export const PAYMENTS_UPDATED_EVENT = 'arlotechx:payments-updated';

export const defaultPaymentSettings = {
  companyName: companyInfo.name,
  upiId: '',
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  qrCodeUrl: '',
  paymentInstructions: 'After payment, share the screenshot with us for faster verification.',
  supportPhone: companyInfo.phone,
  supportEmail: companyInfo.email,
};

const paymentSettingsFields = Object.keys(defaultPaymentSettings);

export const normalizePaymentSettings = (value) => {
  if (!value || typeof value !== 'object') return { ...defaultPaymentSettings };
  return Object.fromEntries(
    paymentSettingsFields.map((key) => {
      const nextValue = value[key];
      if (nextValue === undefined || nextValue === null) return [key, defaultPaymentSettings[key]];
      return [key, String(nextValue).trim()];
    }),
  );
};

export const readPaymentSettings = async () => {
  const value = await readStoreValue(PAYMENT_SETTINGS_STORAGE_KEY, null);
  if (!value) return { ...defaultPaymentSettings };
  return normalizePaymentSettings(value);
};

export const writePaymentSettings = async (value) => {
  const next = normalizePaymentSettings(value);
  await writeStoreValue(PAYMENT_SETTINGS_STORAGE_KEY, next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PAYMENTS_UPDATED_EVENT));
  }
  return next;
};

const paymentFields = [
  'id',
  'clientName',
  'company',
  'amount',
  'paymentDate',
  'paymentMethod',
  'transactionId',
  'status',
  'screenshotUrl',
  'notes',
  'createdAt',
];

const defaultPayment = {
  id: '',
  clientName: '',
  company: '',
  amount: '',
  paymentDate: '',
  paymentMethod: '',
  transactionId: '',
  status: 'Pending',
  screenshotUrl: '',
  notes: '',
  createdAt: '',
};

const normalizePayment = (value, index = 0) => {
  const source = value && typeof value === 'object' ? value : {};
  const now = new Date().toISOString();
  const normalized = Object.fromEntries(
    paymentFields.map((key) => {
      const nextValue = source[key];
      if (nextValue === undefined || nextValue === null) return [key, defaultPayment[key]];
      return [key, String(nextValue).trim()];
    }),
  );

  return {
    ...defaultPayment,
    ...normalized,
    id: normalized.id || `pay-${Date.now()}-${index}`,
    status: ['Pending', 'Paid', 'Verified', 'Failed'].includes(normalized.status) ? normalized.status : 'Pending',
    createdAt: normalized.createdAt || now,
  };
};

export const normalizePayments = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => normalizePayment(item, index));
};

export const readPayments = async () => {
  const value = await readStoreValue(PAYMENTS_STORAGE_KEY, []);
  return normalizePayments(value);
};

export const writePayments = async (value) => {
  const next = normalizePayments(value);
  await writeStoreValue(PAYMENTS_STORAGE_KEY, next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PAYMENTS_UPDATED_EVENT));
  }
  return next;
};
