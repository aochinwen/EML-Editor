const SESSION_STORAGE_KEY = 'eml-editor-session';
const NAMED_SESSIONS_STORAGE_KEY = 'eml-editor-named-sessions';
const SESSION_VERSION = 1;

const DB_NAME = 'eml-editor-db';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('keyval')) {
          db.createObjectStore('keyval');
        }
      };
    });
  }
  return dbPromise;
}

async function idbGet(key) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readonly');
    const store = tx.objectStore('keyval');
    const request = store.get(key);
    request.onsuccess = () => {
      let result = request.result;
      if (result === undefined) {
        try {
          const lsItem = window.localStorage.getItem(key);
          if (lsItem) {
            result = lsItem;
            idbSet(key, lsItem).catch(() => {});
          }
        } catch { /* empty */ }
      }
      resolve(result);
    };
    request.onerror = () => reject(request.error);
  });
}

async function idbSet(key, val) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readwrite');
    const store = tx.objectStore('keyval');
    store.put(val, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDel(key) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readwrite');
    const store = tx.objectStore('keyval');
    store.delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const defaultMeta = {
  subject: '',
  from: '',
  to: '',
  cc: '',
  bcc: '',
};

function cloneElement(element) {
  return {
    ...element,
    props: { ...(element?.props || {}) },
  };
}

function normalizeElements(elements) {
  if (!Array.isArray(elements)) return [];

  return elements
    .filter((element) => element && typeof element === 'object' && typeof element.type === 'string')
    .map((element, index) => ({
      ...cloneElement(element),
      id: typeof element.id === 'string' && element.id.trim() ? element.id : `el-${index + 1}`,
    }));
}

export function getNextIdFromElements(elements) {
  const maxId = normalizeElements(elements).reduce((max, element) => {
    const match = /^el-(\d+)$/.exec(element.id || '');
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);

  return maxId + 1;
}

export function buildEditorSession(state) {
  const elements = normalizeElements(state?.elements);
  const elementIds = new Set(elements.map((element) => element.id));
  const selectedId = elementIds.has(state?.selectedId) ? state.selectedId : null;

  return {
    version: SESSION_VERSION,
    savedAt: new Date().toISOString(),
    emailMeta: { ...defaultMeta, ...(state?.emailMeta || {}) },
    elements,
    selectedId,
    ui: {
      leftPanelCollapsed: Boolean(state?.leftPanelCollapsed),
      rightPanelCollapsed: Boolean(state?.rightPanelCollapsed),
    },
  };
}

export function restoreEditorSession(session) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session data.');
  }

  const elements = normalizeElements(session.elements);
  const selectedId = elements.some((element) => element.id === session.selectedId) ? session.selectedId : null;

  return {
    emailMeta: { ...defaultMeta, ...(session.emailMeta || {}) },
    elements,
    selectedId,
    leftPanelCollapsed: Boolean(session.ui?.leftPanelCollapsed),
    rightPanelCollapsed: Boolean(session.ui?.rightPanelCollapsed),
    nextId: getNextIdFromElements(elements),
  };
}

export async function loadSessionFromStorage() {
  try {
    const raw = await idbGet(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return restoreEditorSession(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function saveSessionToStorage(state) {
  const session = buildEditorSession(state);

  try {
    await idbSet(SESSION_STORAGE_KEY, JSON.stringify(session));
    return { ok: true, session };
  } catch (error) {
    return {
      ok: false,
      session,
      error,
      reason: error?.name === 'QuotaExceededError' ? 'quota-exceeded' : 'storage-write-failed',
    };
  }
}

export async function clearSessionFromStorage() {
  try {
    await idbDel(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function getStoredDraftSummary() {
  try {
    const raw = await idbGet(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const subject = session?.emailMeta?.subject || 'Untitled Email';
    const elementCount = Array.isArray(session?.elements) ? session.elements.length : 0;

    return {
      subject,
      elementCount,
      savedAt: session?.savedAt || null,
    };
  } catch {
    return null;
  }
}

async function getRawNamedSessions() {
  try {
    const raw = await idbGet(NAMED_SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

async function setRawNamedSessions(sessions) {
  await idbSet(NAMED_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

export async function listNamedSessions() {
  const sessions = await getRawNamedSessions();
  return sessions
    .filter((entry) => entry && typeof entry === 'object' && entry.id && entry.name && entry.session)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      savedAt: entry.savedAt || entry.session?.savedAt || null,
      subject: entry.session?.emailMeta?.subject || 'Untitled Email',
      elementCount: Array.isArray(entry.session?.elements) ? entry.session.elements.length : 0,
    }))
    .sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime());
}

export async function saveNamedSession(name, state) {
  const trimmedName = `${name || ''}`.trim();
  if (!trimmedName) {
    throw new Error('Session name is required.');
  }

  const session = buildEditorSession(state);
  const sessions = await getRawNamedSessions();
  const existing = sessions.find((entry) => entry.name.toLowerCase() === trimmedName.toLowerCase());
  const nextEntry = {
    id: existing?.id || `session-${Date.now()}`,
    name: trimmedName,
    savedAt: session.savedAt,
    session,
  };

  const nextSessions = existing
    ? sessions.map((entry) => (entry.id === existing.id ? nextEntry : entry))
    : [nextEntry, ...sessions];

  await setRawNamedSessions(nextSessions);
  return nextEntry;
}

export async function loadNamedSession(id) {
  const sessions = await getRawNamedSessions();
  const session = sessions.find((entry) => entry.id === id);
  if (!session) {
    throw new Error('Saved session not found.');
  }
  return restoreEditorSession(session.session);
}

export async function deleteNamedSession(id) {
  const sessions = await getRawNamedSessions();
  await setRawNamedSessions(sessions.filter((entry) => entry.id !== id));
}

export function downloadSessionFile(state) {
  const session = buildEditorSession(state);
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const subject = session.emailMeta.subject || 'email_session';

  anchor.href = url;
  anchor.download = `${subject.replace(/[^a-z0-9]/gi, '_') || 'email_session'}.session.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function readSessionFile(file) {
  const text = await file.text();
  return restoreEditorSession(JSON.parse(text));
}
