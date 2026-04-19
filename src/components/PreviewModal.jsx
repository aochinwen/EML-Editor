import { X, Monitor, Smartphone, Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { buildEmailHtml } from '../utils/htmlRenderer';

const CLIENTS = {
  modern: { name: 'Modern Browser', icon: '🌐' },
  gmail: { name: 'Gmail', icon: '📧' },
  outlook: { name: 'Outlook', icon: '📨' },
  apple: { name: 'Apple Mail', icon: '🍎' }
};

function simulateEmailClient(html, client, imagesBlocked) {
  let modified = html;

  // Common: Add images-off simulation
  if (imagesBlocked) {
    modified = modified.replace(/<img[^>]*>/gi, (match) => {
      const altMatch = match.match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : 'Image';
      const widthMatch = match.match(/width="([^"]*)"/);
      const styleMatch = match.match(/style="([^"]*)"/);
      const width = widthMatch ? widthMatch[1] : '100%';
      const style = styleMatch ? styleMatch[1] : '';
      return `<div style="${style}background:#e5e7eb;border:1px dashed #9ca3af;display:flex;align-items:center;justify-content:center;min-height:100px;color:#6b7280;font-family:sans-serif;font-size:12px;${width !== '100%' ? `width:${width};` : ''}">${alt}</div>`;
    });
  }

  // Gmail simulation: strips certain CSS, adds its own styling
  if (client === 'gmail') {
    // Gmail strips @media queries and certain styles
    modified = modified.replace(/<style>[^]*?<\/style>/gi, '<style>/* Gmail strips custom styles */</style>');
    // Gmail adds its own wrapper padding
    modified = modified.replace(/<body/, '<body style="background:#ffffff !important;"');
    // Gmail converts some table widths
    modified = modified.replace(/width:\s*600px/gi, 'width:100%');
  }

  // Outlook simulation: very limited CSS, Word rendering engine quirks
  if (client === 'outlook') {
    // Outlook doesn't support many CSS properties
    modified = modified
      .replace(/border-radius:[^;]+;/gi, '') // No border-radius
      .replace(/box-shadow:[^;]+;/gi, '') // No box-shadow
      .replace(/display:\s*inline-block/gi, 'display:block') // Limited inline-block
      .replace(/background:\s*rgba\([^)]+\)/gi, 'background:#cccccc') // No rgba
      .replace(/background:\s*linear-gradient[^;]+;/gi, 'background:#4F46E5;'); // No gradients

    // Outlook specific conditional comments handling
    modified = modified.replace(/<!--\[if gte mso 9\]>/gi, '<!--[if mso]>')
      .replace(/<v:background[^>]*>[\s\S]*?<\/v:background>/gi, '');
  }

  // Apple Mail simulation: generally good but has specific quirks
  if (client === 'apple') {
    // Apple Mail auto-detects phone numbers, addresses
    modified = modified.replace(/(\d{3}-\d{4})/g, '<a href="tel:$1" style="color:#007aff;text-decoration:none">$1</a>');
    // Apple Mail respects dark mode more than others
    modified = modified.replace(/color-scheme:\s*light/gi, 'color-scheme: light dark');
  }

  return modified;
}

function getClientWarnings(elements, client) {
  const warnings = [];

  elements.forEach((el, idx) => {
    const type = el.type;
    const props = el.props || {};

    if (client === 'outlook') {
      if (type === 'hero-overlay' || type === 'cta-image-bg') {
        warnings.push(`Element ${idx + 1} (${type}): Background images may not render in Outlook`);
      }
      if (props.borderRadius && props.borderRadius !== '0') {
        warnings.push(`Element ${idx + 1}: Border radius may be ignored in Outlook`);
      }
      if (props.backgroundColor?.startsWith('rgba') || props.backgroundColor?.startsWith('#') && props.backgroundColor.length === 9) {
        warnings.push(`Element ${idx + 1}: Transparent colors may not work in Outlook`);
      }
    }

    if (client === 'gmail') {
      if (type.includes('carousel') || type === 'carousel-basic') {
        warnings.push(`Element ${idx + 1} (${type}): Interactive carousels don't work in Gmail`);
      }
    }
  });

  return [...new Set(warnings)]; // dedupe
}

export default function PreviewModal({ elements, emailMeta, onClose }) {
  const [view, setView] = useState('desktop');
  const [client, setClient] = useState('modern');
  const [imagesBlocked, setImagesBlocked] = useState(false);

  const baseHtml = useMemo(() => buildEmailHtml(elements, emailMeta), [elements, emailMeta]);
  const simulatedHtml = useMemo(() => simulateEmailClient(baseHtml, client, imagesBlocked), [baseHtml, client, imagesBlocked]);
  const warnings = useMemo(() => getClientWarnings(elements, client), [elements, client]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="font-semibold text-gray-900">Email Preview</h2>

          {/* Device Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setView('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Monitor size={15} /> Desktop
            </button>
            <button
              onClick={() => setView('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone size={15} /> Mobile
            </button>
          </div>

          {/* Email Client Selector */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {Object.entries(CLIENTS).map(([key, { name, icon }]) => (
              <button
                key={key}
                onClick={() => setClient(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  client === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{icon}</span> {name}
              </button>
            ))}
          </div>

          {/* Image Toggle */}
          <button
            onClick={() => setImagesBlocked(!imagesBlocked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              imagesBlocked
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {imagesBlocked ? <EyeOff size={15} /> : <Eye size={15} />}
            {imagesBlocked ? 'Images Off' : 'Images On'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
        >
          <X size={15} /> Close Preview
        </button>
      </div>

      {/* Warnings Bar */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Compatibility warnings for {CLIENTS[client].name}:</p>
              <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-gray-200 flex justify-center py-8">
        <div
          className={`bg-white shadow-2xl rounded transition-all ${
            view === 'mobile' ? 'w-[375px]' : 'w-[680px]'
          }`}
          style={{ minHeight: 400 }}
        >
          <iframe
            srcDoc={simulatedHtml}
            title="Email Preview"
            style={{ width: '100%', minHeight: 600, border: 'none', display: 'block' }}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
