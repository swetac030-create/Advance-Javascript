export const STORAGE_KEY = 'hotel_submissions_v1';

export function getItem(key = STORAGE_KEY) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getItem error', e);
    return [];
  }
}

export function setItem(value, key = STORAGE_KEY) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('setItem error', e);
    return false;
  }
}
