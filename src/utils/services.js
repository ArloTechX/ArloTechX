import { serviceCatalog as defaultServiceCatalog } from '../data/services';
import { readStoreValue, writeStoreValue } from './firebaseStore';

export const SERVICES_STORAGE_KEY = 'arlotechx_services';
export const SERVICES_UPDATED_EVENT = 'arlotechx:services-updated';

const arrayFields = ['features', 'benefits', 'process', 'technologies'];
const textFields = [
  'id',
  'title',
  'slug',
  'shortDescription',
  'fullDescription',
  'category',
  'badge',
  'pricingNote',
  'icon',
  'status',
  'imageUrl',
  'ctaText',
  'seoTitle',
  'seoDescription',
  'createdAt',
  'updatedAt',
];

const defaultService = {
  id: '',
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  badge: '',
  features: [],
  benefits: [],
  process: [],
  technologies: [],
  pricingNote: '',
  icon: 'Globe',
  status: 'Draft',
  createdAt: '',
  updatedAt: '',
  imageUrl: '',
  ctaText: 'Request This Service',
  seoTitle: '',
  seoDescription: '',
};

const splitLines = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const slugifyService = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeService = (input, index = 0) => {
  const source = input && typeof input === 'object' ? input : {};
  const now = new Date().toISOString();

  const normalized = Object.fromEntries(
    textFields.map((field) => {
      const raw = source[field];
      return [field, raw === undefined || raw === null ? '' : String(raw).trim()];
    }),
  );

  const title = normalized.title || `Service ${index + 1}`;
  const slug = slugifyService(normalized.slug || title || `service-${index + 1}`) || `service-${index + 1}`;

  const next = {
    ...defaultService,
    ...normalized,
    id: normalized.id || `svc-${slug}`,
    title,
    slug,
    status: normalized.status === 'Active' ? 'Active' : 'Draft',
    createdAt: normalized.createdAt || now,
    updatedAt: normalized.updatedAt || now,
  };

  arrayFields.forEach((field) => {
    const raw = source[field];
    if (Array.isArray(raw)) {
      next[field] = raw.map((item) => String(item || '').trim()).filter(Boolean);
      return;
    }
    next[field] = splitLines(raw);
  });

  if (!next.ctaText) {
    next.ctaText = defaultService.ctaText;
  }

  return next;
};

const normalizeServices = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => normalizeService(item, index));
};

export const readServices = async () => {
  const value = await readStoreValue(SERVICES_STORAGE_KEY, null);
  if (!value) {
    return normalizeServices(defaultServiceCatalog.map((item) => ({ ...item, status: 'Active', badge: item.category })));
  }
  const normalized = normalizeServices(value);
  return normalized;
};

export const writeServices = async (value) => {
  const normalized = normalizeServices(value);
  await writeStoreValue(SERVICES_STORAGE_KEY, normalized);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SERVICES_UPDATED_EVENT));
  }
  return normalized;
};

export const ensureUniqueSlug = (slug, services, excludeId = '') => {
  const base = slugifyService(slug) || 'service';
  let candidate = base;
  let count = 2;
  const taken = new Set(services.filter((item) => item.id !== excludeId).map((item) => item.slug));
  while (taken.has(candidate)) {
    candidate = `${base}-${count}`;
    count += 1;
  }
  return candidate;
};
