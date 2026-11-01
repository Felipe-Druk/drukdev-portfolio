/**************************************************************
 * SAFE STORAGE UTILITIES (js/utils/safeStorage.js)
 **************************************************************/

export function loadItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultValue;
    } catch {
        return defaultValue;
    }
}

export function saveItem(key, value) {
    try {
        localStorage.setItem(key, String(value));
        return true;
    } catch {
        return false;
    }
}

export function loadJson(key, defaultValue = null) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return defaultValue;
        return JSON.parse(raw);
    } catch {
        return defaultValue;
    }
}

export function saveJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}
