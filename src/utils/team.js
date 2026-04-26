import { readStoreValue, writeStoreValue } from './firebaseStore';

export const TEAM_SETTINGS_STORAGE_KEY = 'teamSettings';
export const TEAM_SETTINGS_UPDATED_EVENT = 'arlotechx:team-settings-updated';

const memberFields = ['name', 'role', 'email', 'phone', 'bio', 'imageUrl', 'linkedin', 'github'];

export const defaultTeamSettings = {
  leadership: [],
  developers: [],
};

const hasMemberContent = (member) =>
  Boolean(
    member?.name ||
      member?.role ||
      member?.email ||
      member?.phone ||
      member?.bio ||
      member?.imageUrl ||
      member?.linkedin ||
      member?.github,
  );

const normalizeMember = (value, includeId = false, fallbackId = '') => {
  const source = value && typeof value === 'object' ? value : {};
  const normalized = Object.fromEntries(
    memberFields.map((key) => {
      const nextValue = source[key];
      if (nextValue === undefined || nextValue === null) {
        return [key, ''];
      }
      return [key, String(nextValue).trim()];
    }),
  );

  if (includeId) {
    const nextId = source.id ?? fallbackId;
    return {
      id: String(nextId || '').trim(),
      ...normalized,
    };
  }

  return normalized;
};

const normalizeMemberList = (list, idPrefix) =>
  (Array.isArray(list) ? list : [])
    .map((item, index) => normalizeMember(item, true, `${idPrefix}-${index + 1}`))
    .filter((item) => item.id && hasMemberContent(item));

const normalizeLegacyLeadership = (legacyCeo) => {
  if (!legacyCeo || typeof legacyCeo !== 'object') return [];

  const normalizedCeo = normalizeMember(legacyCeo, false);
  if (!hasMemberContent(normalizedCeo)) return [];

  const names = String(normalizedCeo.name || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const derivedNames = names.length ? names : [normalizedCeo.name || ''];

  return derivedNames
    .map((name, index) => ({
      id: `lead-${index + 1}`,
      ...normalizedCeo,
      name,
    }))
    .filter(hasMemberContent);
};

export const normalizeTeamSettings = (value) => {
  if (!value || typeof value !== 'object') {
    return {
      leadership: [],
      developers: [],
    };
  }

  const leadership = Array.isArray(value.leadership)
    ? normalizeMemberList(value.leadership, 'lead')
    : normalizeLegacyLeadership(value.ceo);

  const developers = normalizeMemberList(value.developers, 'dev');

  return { leadership, developers };
};

export const readTeamSettings = async () => {
  const value = await readStoreValue(TEAM_SETTINGS_STORAGE_KEY, null);
  if (!value) return normalizeTeamSettings(defaultTeamSettings);
  return normalizeTeamSettings(value);
};

export const writeTeamSettings = async (value) => {
  const next = normalizeTeamSettings(value);
  await writeStoreValue(TEAM_SETTINGS_STORAGE_KEY, next);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TEAM_SETTINGS_UPDATED_EVENT));
  }

  return next;
};
