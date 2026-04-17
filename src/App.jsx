import { useRef, useState, useCallback, useEffect } from 'react';
import { Eye, Download, RotateCcw, Mail, ChevronLeft, ChevronRight, Upload, Save, FolderOpen, Trash2, Settings, Menu, FileJson, FileText } from 'lucide-react';
import ElementsSidebar from './components/ElementsSidebar';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import EmailMetaModal from './components/EmailMetaModal';
import GlobalSettingsModal from './components/GlobalSettingsModal';
import PreviewModal from './components/PreviewModal';
import { downloadEml, downloadImageEml } from './utils/emlExporter';
import { importEml } from './utils/emlImporter';
import { THEMES } from './data/themes';
import { applyThemeToElement } from './utils/themeHelper';
import {
  clearSessionFromStorage,
  downloadSessionFile,
  deleteNamedSession,
  getStoredDraftSummary,
  listNamedSessions,
  loadSessionFromStorage,
  loadNamedSession,
  readSessionFile,
  saveNamedSession,
  saveSessionToStorage,
  getNextIdFromElements,
} from './utils/sessionPersistence';

let nextId = 1;

const defaultMeta = {
  subject: '',
  from: '',
  to: '',
  cc: '',
  bcc: '',
  canvasWidth: '600',
  backgroundColor: '#f4f4f5',
  fontFamily: 'sans-serif',
};

function formatSavedAt(value) {
  if (!value) return 'just now';

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'just now';

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function App() {
  const emlInputRef = useRef(null);
  const sessionInputRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [emailMeta, setEmailMeta] = useState(defaultMeta);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [draftSummary, setDraftSummary] = useState(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const [saveSessionName, setSaveSessionName] = useState('');
  const [autosaveStatus, setAutosaveStatus] = useState('Not saved yet');
  const [activeTheme, setActiveTheme] = useState('light');
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  const refreshSavedSessions = useCallback(() => {
    listNamedSessions().then(setSavedSessions);
  }, []);

  const applyRestoredSession = useCallback((restoredSession) => {
    setElements(restoredSession.elements);
    setSelectedId(restoredSession.selectedId);
    setEmailMeta(restoredSession.emailMeta);
    if (restoredSession.activeTheme) {
      setActiveTheme(restoredSession.activeTheme);
    }
    setLeftPanelCollapsed(restoredSession.leftPanelCollapsed);
    setRightPanelCollapsed(restoredSession.rightPanelCollapsed);
    nextId = restoredSession.nextId;
  }, []);

  useEffect(() => {
    getStoredDraftSummary().then(storedDraftSummary => {
      setDraftSummary(storedDraftSummary);
      refreshSavedSessions();

      if (storedDraftSummary) {
        setShowRestorePrompt(true);
        return;
      }

      setSessionRestored(true);
    });
  }, [refreshSavedSessions]);

  useEffect(() => {
    if (!sessionRestored) return;

    saveSessionToStorage({
      elements,
      selectedId,
      emailMeta,
      leftPanelCollapsed,
      rightPanelCollapsed,
      activeTheme,
    }).then(savedSession => {
      if (!savedSession.ok) {
        setAutosaveStatus(savedSession.reason === 'quota-exceeded' ? 'Autosave failed: browser storage full' : 'Autosave failed');
        return;
      }

      setDraftSummary({
        subject: savedSession.session.emailMeta.subject || 'Untitled Email',
        elementCount: savedSession.session.elements.length,
        savedAt: savedSession.session.savedAt,
      });
      setAutosaveStatus(`Saved ${formatSavedAt(savedSession.session.savedAt)}`);
    });
  }, [elements, selectedId, emailMeta, leftPanelCollapsed, rightPanelCollapsed, activeTheme, sessionRestored]);

  const handleAdd = useCallback((template, insertIndex = null) => {
    let el = { ...template, id: `el-${nextId++}` };
    el = applyThemeToElement(el, activeTheme);
    setElements(prev => {
      // If insertIndex is provided, insert at that position
      if (insertIndex !== null && insertIndex >= 0 && insertIndex <= prev.length) {
        const next = [...prev];
        next.splice(insertIndex, 0, el);
        return next;
      }
      // Otherwise use the default behavior (after selected element or at end)
      if (selectedId) {
        const idx = prev.findIndex(e => e.id === selectedId);
        if (idx !== -1) {
          const next = [...prev];
          next.splice(idx + 1, 0, el);
          return next;
        }
      }
      return [...prev, el];
    });
    setSelectedId(el.id);
  }, [selectedId, activeTheme]);

  const handleThemeChange = useCallback((themeId) => {
    setActiveTheme(themeId);
    const theme = THEMES[themeId];
    if (theme) {
      setEmailMeta(prev => ({
        ...prev,
        backgroundColor: theme.canvasBackground,
        fontFamily: theme.fontFamily
      }));
      setElements(prev => prev.map(el => applyThemeToElement(el, themeId)));
    }
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    if (id) setRightPanelCollapsed(false);
  }, []);

  const handleUpdate = useCallback((updated) => {
    setElements(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const handleDelete = useCallback((id) => {
    setElements(prev => prev.filter(e => e.id !== id));
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  const handleDuplicate = useCallback((id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const clone = { ...el, id: `el-${nextId++}`, props: { ...el.props } };
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    setSelectedId(clone.id);
  }, [elements]);

  const handleReorder = useCallback((newElements) => {
    setElements(newElements);
  }, []);

  const handleClear = () => {
    if (elements.length === 0) return;
    if (window.confirm('Clear all elements from the canvas?')) {
      setElements([]);
      setSelectedId(null);
    }
  };

  const handlePickEml = () => {
    emlInputRef.current?.click();
  };

  const handlePickSession = () => {
    sessionInputRef.current?.click();
  };

  const handleRestoreDraft = async () => {
    const restoredSession = await loadSessionFromStorage();
    if (!restoredSession) {
      setShowRestorePrompt(false);
      setSessionRestored(true);
      return;
    }

    applyRestoredSession(restoredSession);
    setAutosaveStatus(`Saved ${formatSavedAt(draftSummary?.savedAt || new Date().toISOString())}`);
    setShowRestorePrompt(false);
    setSessionRestored(true);
  };

  const handleDismissDraft = async () => {
    await clearSessionFromStorage();
    setDraftSummary(null);
    setShowRestorePrompt(false);
    setAutosaveStatus('Autosave ready');
    setSessionRestored(true);
  };

  const handleLoadEml = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const imported = importEml(text);

      const nextElements = (imported.elements || []).map((el) => ({
        ...el,
        id: `el-${nextId++}`,
        props: { ...(el.props || {}) },
      }));

      setElements(nextElements);
      setSelectedId(nextElements[0]?.id || null);
      setEmailMeta(prev => ({ ...prev, ...(imported.emailMeta || {}) }));
      setRightPanelCollapsed(nextElements.length === 0 ? rightPanelCollapsed : false);
      nextId = getNextIdFromElements(nextElements);
    } catch {
      window.alert('Unable to load this .eml file.');
    }
  };

  const handleLoadSession = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const restoredSession = await readSessionFile(file);
      applyRestoredSession(restoredSession);
      setAutosaveStatus('Loaded from file');
    } catch {
      window.alert('Unable to load this session file.');
    }
  };

  const handleSaveSession = () => {
    downloadSessionFile({
      elements,
      selectedId,
      emailMeta,
      leftPanelCollapsed,
      rightPanelCollapsed,
      activeTheme,
    });
  };

  const handleSaveNamedSession = async () => {
    const fallbackName = emailMeta.subject?.trim() || `Session ${new Date().toLocaleString()}`;
    const targetName = saveSessionName.trim() || fallbackName;

    try {
      await saveNamedSession(targetName, {
        elements,
        selectedId,
        emailMeta,
        leftPanelCollapsed,
        rightPanelCollapsed,
        activeTheme,
      });
      setSaveSessionName(targetName);
      refreshSavedSessions();
      setAutosaveStatus(`Saved session "${targetName}"`);
    } catch {
      window.alert('Unable to save this named session.');
    }
  };

  const handleLoadNamedSession = async (id) => {
    try {
      const restoredSession = await loadNamedSession(id);
      applyRestoredSession(restoredSession);
      setAutosaveStatus('Loaded saved session');
    } catch {
      window.alert('Unable to load that saved session.');
    }
  };

  const handleDeleteNamedSession = async (id) => {
    await deleteNamedSession(id);
    refreshSavedSessions();
  };

  const handleExport = async (mode = 'standard') => {
    setShowExportModal(false);
    setExporting(true);
    try {
      if (mode === 'image') {
        await downloadImageEml(elements, emailMeta);
      } else {
        await downloadEml(elements, emailMeta);
      }
    } catch (e) {
      console.error(e);
      window.alert('An error occurred during export.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#181a27' }}>
      {/* Top Bar — dark theme */}
      <header
        className="flex items-center justify-between px-5 py-2.5 shrink-0 z-10"
        style={{ background: '#1e2030', borderBottom: '1px solid #2a2d3e' }}
      >
        <input
          ref={emlInputRef}
          type="file"
          accept=".eml,message/rfc822"
          className="hidden"
          onChange={handleLoadEml}
        />
        <input
          ref={sessionInputRef}
          type="file"
          accept=".json,.session.json,application/json"
          className="hidden"
          onChange={handleLoadSession}
        />
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Mail size={14} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">EML Editor</h1>
            <p className="text-[10px]" style={{ color: '#6b7280' }}>Email builder for Outlook</p>
          </div>
        </div>

        {/* Email name / breadcrumb */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{ background: '#252840' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="text-sm font-medium text-white hover:text-indigo-300 transition-colors flex items-center gap-1.5 outline-none"
              title="Edit email metadata"
            >
              {emailMeta.subject || 'Untitled Email'}
              <span className="opacity-50 text-[10px]">✏️</span>
            </button>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#2a2d40', color: '#9ca3af' }}>
              {elements.length} block{elements.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-[11px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
            {autosaveStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLeftPanelCollapsed(prev => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors"
            style={{ border: '1px solid #3d4060', color: '#cbd5e1', background: 'transparent' }}
            title={leftPanelCollapsed ? 'Expand left panel' : 'Collapse left panel'}
          >
            {leftPanelCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            Left
          </button>
          <button
            onClick={() => setRightPanelCollapsed(prev => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors"
            style={{ border: '1px solid #3d4060', color: '#cbd5e1', background: 'transparent' }}
            title={rightPanelCollapsed ? 'Expand right panel' : 'Collapse right panel'}
          >
            Right
            {rightPanelCollapsed ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          </button>

          {/* Consolidated Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors font-medium"
              style={{ border: '1px solid #3d4060', color: '#d1d5db', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
              title="Menu"
            >
              <Menu size={14} /> Menu
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-2xl z-50 py-2"
                  style={{ background: '#1e2030', borderColor: '#3d4060' }}
                >
                  <div className="px-3 py-2 border-b border-gray-700/50 mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Session</p>
                  </div>
                  <button
                    onClick={() => { handleSaveSession(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    <Save size={16} /> Save session
                  </button>
                  <button
                    onClick={() => { handlePickSession(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    <FolderOpen size={16} /> Load session
                  </button>
                  <div className="px-3 py-2 border-b border-gray-700/50 mt-2 mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Import / Export</p>
                  </div>
                  <button
                    onClick={() => { handlePickEml(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    <FileText size={16} /> Load .eml file
                  </button>
                  <div className="px-3 py-2 border-b border-gray-700/50 mt-2 mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Settings</p>
                  </div>
                  <button
                    onClick={() => { setShowGlobalSettings(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    <Settings size={16} /> Global settings
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <RotateCcw size={14} /> Clear
          </button>
          <button
            onClick={() => setShowPreview(true)}
            disabled={elements.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            style={{ border: '1px solid #3d4060', color: '#d1d5db', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            disabled={elements.length === 0 || exporting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
            style={{ background: '#4f46e5', color: '#fff' }}
            onMouseEnter={e => { if (!exporting) e.currentTarget.style.background = '#4338ca'; }}
            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
          >
            <Download size={14} /> {exporting ? 'Embedding images…' : 'Export .eml'}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {showRestorePrompt && draftSummary && (
          <div className="absolute inset-0 z-30 flex items-start justify-center pt-20 px-4" style={{ background: 'rgba(15, 23, 42, 0.42)' }}>
            <div className="w-full max-w-md rounded-2xl border p-5 shadow-2xl" style={{ background: '#111827', borderColor: '#374151' }}>
              <h2 className="text-lg font-semibold text-white">Restore your last draft?</h2>
              <p className="mt-2 text-sm" style={{ color: '#cbd5e1' }}>
                We found an autosaved draft for <span className="font-medium text-white">{draftSummary.subject}</span> with {draftSummary.elementCount} block{draftSummary.elementCount !== 1 ? 's' : ''}.
              </p>
              <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>
                Last saved {formatSavedAt(draftSummary.savedAt)}.
              </p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={handleDismissDraft}
                  className="px-3 py-2 text-sm rounded-lg border"
                  style={{ borderColor: '#4b5563', color: '#d1d5db' }}
                >
                  Start fresh
                </button>
                <button
                  onClick={handleRestoreDraft}
                  className="px-3 py-2 text-sm rounded-lg font-medium"
                  style={{ background: '#4f46e5', color: '#ffffff' }}
                >
                  Restore draft
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Left: Element Sidebar — spans full height, dark */}
        <div
          className="shrink-0 flex overflow-hidden transition-all duration-200"
          style={{ width: leftPanelCollapsed ? 0 : 420 }}
        >
          <div className="flex h-full w-full flex-col">
            <ElementsSidebar onAdd={handleAdd} activeTheme={activeTheme} onThemeChange={handleThemeChange} />
            {!leftPanelCollapsed && (
              <div className="border-t px-4 py-4" style={{ background: '#111827', borderColor: '#2a2d3e' }}>
                <div className="flex items-center gap-2">
                  <input
                    value={saveSessionName}
                    onChange={(e) => setSaveSessionName(e.target.value)}
                    placeholder="Name this session"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ background: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  />
                  <button
                    onClick={handleSaveNamedSession}
                    className="px-3 py-2 text-sm rounded-lg font-medium"
                    style={{ background: '#4f46e5', color: '#fff' }}
                  >
                    Save
                  </button>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                    Saved sessions
                  </div>
                  <div className="mt-2 flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
                    {savedSessions.length === 0 ? (
                      <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: '#374151', color: '#94a3b8' }}>
                        No named sessions yet.
                      </div>
                    ) : savedSessions.map((session) => (
                      <div
                        key={session.id}
                        className="rounded-lg border px-3 py-2"
                        style={{ background: '#1f2937', borderColor: '#374151' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-white">{session.name}</div>
                            <div className="truncate text-[11px]" style={{ color: '#9ca3af' }}>
                              {session.subject || 'Untitled Email'}
                            </div>
                            <div className="text-[11px]" style={{ color: '#6b7280' }}>
                              {session.elementCount} block{session.elementCount !== 1 ? 's' : ''} · {formatSavedAt(session.savedAt)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteNamedSession(session.id)}
                            className="rounded p-1"
                            title="Delete saved session"
                            style={{ color: '#fca5a5' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleLoadNamedSession(session.id)}
                          className="mt-2 w-full rounded-md px-3 py-1.5 text-xs font-medium"
                          style={{ background: '#312e81', color: '#eef2ff' }}
                        >
                          Load session
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Canvas — light background */}
        <div className="flex-1 relative overflow-hidden" style={{ background: '#f1f5f9' }}>
          {/* Floating Toggle Buttons (Fixed in viewport center) */}
          <button
            onClick={() => setLeftPanelCollapsed(prev => !prev)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm"
            style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569' }}
            title={leftPanelCollapsed ? 'Expand left panel' : 'Collapse left panel'}
          >
            {leftPanelCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button
            onClick={() => setRightPanelCollapsed(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm"
            style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569' }}
            title={rightPanelCollapsed ? 'Expand right panel' : 'Collapse right panel'}
          >
            {rightPanelCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          {/* Scrolling Canvas Container */}
          <div className="w-full h-full overflow-y-auto">
            <Canvas
              elements={elements}
              selectedId={selectedId}
              onSelect={handleSelect}
              onReorder={handleReorder}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onAdd={handleAdd}
              emailMeta={emailMeta}
            />
          </div>
        </div>

        {/* Right: Property Panel — white */}
        <div
          className="shrink-0 flex flex-col overflow-hidden transition-all duration-200"
          style={{
            width: rightPanelCollapsed ? 0 : (selectedElement ? 288 : 256),
            background: '#ffffff',
            borderLeft: rightPanelCollapsed ? 'none' : '1px solid #e5e7eb',
          }}
        >
          <PropertyPanel
            element={selectedElement}
            onUpdate={handleUpdate}
            onDelete={() => selectedElement && handleDelete(selectedElement.id)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <EmailMetaModal
          meta={emailMeta}
          onChange={setEmailMeta}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}

      {/* Global Settings Modal */}
      {showGlobalSettings && (
        <GlobalSettingsModal
          meta={emailMeta}
          onChange={setEmailMeta}
          activeTheme={activeTheme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowGlobalSettings(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          elements={elements}
          emailMeta={emailMeta}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export default App;
