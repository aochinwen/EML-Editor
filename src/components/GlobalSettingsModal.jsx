import { X, Settings } from 'lucide-react';
import { THEME_LIST } from '../data/themes';

const FONT_OPTIONS = [
  { value: 'sans-serif', label: 'Sans-serif (Default)' },
  { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica Neue' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
];

export default function GlobalSettingsModal({ meta, onChange, activeTheme, onThemeChange, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Settings size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Global Settings</h2>
              <p className="text-xs text-gray-400">Configure canvas &amp; default styles</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" title="Close" className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Theme Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              {THEME_LIST.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 transition-all group-hover:scale-110"
                    style={{
                      backgroundColor: theme.colorPreview,
                      borderColor: activeTheme === theme.id ? '#4f46e5' : '#e5e7eb',
                      boxShadow: activeTheme === theme.id ? '0 0 0 3px rgba(79, 70, 229, 0.25)' : 'none',
                    }}
                  />
                  <span className={`text-[10px] font-medium ${activeTheme === theme.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={meta.backgroundColor || '#f4f4f5'}
                onChange={e => onChange({ ...meta, backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={meta.backgroundColor || '#f4f4f5'}
                onChange={e => onChange({ ...meta, backgroundColor: e.target.value })}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                placeholder="#f4f4f5"
              />
            </div>
          </div>

          {/* Default Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Font Family</label>
            <select
              value={meta.fontFamily || 'sans-serif'}
              onChange={e => onChange({ ...meta, fontFamily: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">Applied to the email canvas wrapper. Individual elements can override this.</p>
          </div>

          {/* Canvas Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Width (px)</label>
            <input
              type="text"
              value={meta.canvasWidth || '600'}
              onChange={e => onChange({ ...meta, canvasWidth: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
