import { Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

function Field({ label, children, right }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1 gap-2">
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        {right}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder = '' }) {
  const [localVal, setLocalVal] = useState(value ?? '');
  useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalVal(value ?? '');
  }, [value]);
  return (
    <input
      type={type}
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={() => onChange(localVal)}
      onKeyDown={e => { if (e.key === 'Enter') onChange(localVal); }}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value ?? '#000000'}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
      />
      <Input value={value} onChange={onChange} placeholder="#000000" />
    </div>
  );
}

function Textarea({ value, onChange, rows = 3 }) {
  const [localVal, setLocalVal] = useState(value ?? '');
  useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalVal(value ?? '');
  }, [value]);
  return (
    <textarea
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={() => onChange(localVal)}
      rows={rows}
      className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Checkbox({ value, onChange, label = 'Enabled' }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
      <input
        type="checkbox"
        checked={!!value}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span>{label}</span>
    </label>
  );
}

const FONTS = [
  { value: 'sans-serif',            label: 'Default (Sans)' },
  { value: 'Arial, sans-serif',     label: 'Arial' },
  { value: "'Helvetica Neue', Helvetica, sans-serif", label: 'Helvetica' },
  { value: 'Georgia, serif',        label: 'Georgia' },
  { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { value: "'Courier New', Courier, monospace", label: 'Courier New' },
  { value: 'Verdana, sans-serif',   label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: "'Futura', Trebuchet MS, sans-serif", label: 'Futura' },
  { value: "'Gill Sans', Optima, sans-serif", label: 'Gill Sans' },
  { value: "'Palatino Linotype', Palatino, serif", label: 'Palatino' },
  { value: 'Tahoma, sans-serif',    label: 'Tahoma' },
  { value: 'Impact, Charcoal, sans-serif', label: 'Impact' },
];

function ToggleBtn({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold border transition-colors select-none
        ${active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

function RichTextInput({ fieldKey, props, onChangeMulti, rows = 3 }) {
  const val = props[fieldKey] ?? '';
  const [localVal, setLocalVal] = useState(val);
  useEffect(() => {
        setLocalVal(props[fieldKey] ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props[fieldKey]]);
  const font  = props[`${fieldKey}Font`]   ?? 'sans-serif';
  const rawFontSize = props[`${fieldKey}FontSize`];
  let fontSize = rawFontSize ?? '';
  if (typeof rawFontSize === 'number' || (typeof rawFontSize === 'string' && /^\d+$/.test(rawFontSize))) {
    fontSize = `${rawFontSize}px`;
  }
  const bold  = props[`${fieldKey}Bold`]   ?? false;
  const italic = props[`${fieldKey}Italic`] ?? false;
  const underline = props[`${fieldKey}Underline`] ?? false;
  const strike = props[`${fieldKey}Strike`] ?? false;
  const align = props[`${fieldKey}Align`]  ?? 'left';
  const renderColor = props[`${fieldKey}Color`] ?? props.textColor ?? '#111827';

  const toggle = (key, current) => onChangeMulti({ [`${fieldKey}${key}`]: !current });
  const set    = (key, v)       => onChangeMulti({ [`${fieldKey}${key}`]: v });

  return (
    <div className="flex flex-col gap-1.5">
      {/* Font family and size */}
      <div className="flex gap-2">
        <select
          value={font}
          onChange={e => set('Font', e.target.value)}
          className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select
          value={fontSize}
          onChange={e => set('FontSize', e.target.value)}
          className="w-20 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
          <option value="60px">60px</option>
          <option value="72px">72px</option>
        </select>
      </div>

      <ColorInput value={renderColor} onChange={v => set('Color', v)} />

      {/* Style + align toolbar */}
      <div className="flex items-center gap-1 flex-wrap">
        <ToggleBtn active={bold}      onClick={() => toggle('Bold',      bold)}      title="Bold"><b>B</b></ToggleBtn>
        <ToggleBtn active={italic}    onClick={() => toggle('Italic',    italic)}    title="Italic"><i>I</i></ToggleBtn>
        <ToggleBtn active={underline} onClick={() => toggle('Underline', underline)} title="Underline"><span style={{textDecoration:'underline'}}>U</span></ToggleBtn>
        <ToggleBtn active={strike}    onClick={() => toggle('Strike',    strike)}    title="Strikethrough"><span style={{textDecoration:'line-through'}}>S</span></ToggleBtn>
        <div className="w-px h-5 bg-gray-200 mx-0.5" />
        {['left','center','right','justify'].map(a => (
          <ToggleBtn key={a} active={align === a} onClick={() => set('Align', a)} title={a.charAt(0).toUpperCase() + a.slice(1)}>
            {a === 'left'    && <svg width="12" height="12" viewBox="0 0 12 12"><rect x="0" y="1" width="12" height="1.5" fill="currentColor"/><rect x="0" y="4.5" width="8" height="1.5" fill="currentColor"/><rect x="0" y="8" width="10" height="1.5" fill="currentColor"/></svg>}
            {a === 'center'  && <svg width="12" height="12" viewBox="0 0 12 12"><rect x="0" y="1" width="12" height="1.5" fill="currentColor"/><rect x="2" y="4.5" width="8" height="1.5" fill="currentColor"/><rect x="1" y="8" width="10" height="1.5" fill="currentColor"/></svg>}
            {a === 'right'   && <svg width="12" height="12" viewBox="0 0 12 12"><rect x="0" y="1" width="12" height="1.5" fill="currentColor"/><rect x="4" y="4.5" width="8" height="1.5" fill="currentColor"/><rect x="2" y="8" width="10" height="1.5" fill="currentColor"/></svg>}
            {a === 'justify' && <svg width="12" height="12" viewBox="0 0 12 12"><rect x="0" y="1" width="12" height="1.5" fill="currentColor"/><rect x="0" y="4.5" width="12" height="1.5" fill="currentColor"/><rect x="0" y="8" width="12" height="1.5" fill="currentColor"/></svg>}
          </ToggleBtn>
        ))}
      </div>

      {/* Text preview + editor */}
      <textarea
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={() => onChangeMulti({ [fieldKey]: localVal })}
        rows={rows}
        style={{
          fontFamily: font,
          fontSize: fontSize || 'inherit',
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle:  italic ? 'italic' : 'normal',
          textDecoration: [underline && 'underline', strike && 'line-through'].filter(Boolean).join(' ') || 'none',
          textAlign: align,
          color: '#000000',
        }}
        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />
    </div>
  );
}

function ImageUpload({ value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <Input value={value} onChange={onChange} placeholder="https://... or choose file below" />
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <span className="text-xs px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors select-none">
          📁 Choose file…
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {value && value.startsWith('data:') && (
        <img src={value} alt="preview" className="w-full max-h-20 object-cover rounded border border-gray-200" />
      )}
    </div>
  );
}

function StringListEditor({ value, onChange, placeholder = 'Item' }) {
  const items = value || [];
  const update = (i, v) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const add = () => onChange([...items, '']);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1">
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={`${placeholder} ${i + 1}`}
            className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-1">
            <X size={14} />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-indigo-600 hover:underline text-left mt-1">+ Add item</button>
    </div>
  );
}

function SlideEditor({ slides, onChange, fields }) {
  return (
    <div className="flex flex-col gap-2">
      {(slides || []).map((slide, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Slide {i + 1}</span>
            <button
              onClick={() => onChange((slides || []).filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-600"
            >
              <X size={13} />
            </button>
          </div>
          {fields.map(f => (
            <div key={f.key} className="mb-1">
              <label className="text-xs text-gray-400 mb-0.5 block">{f.label}</label>
              {(f.type === 'image' || f.key === 'imageUrl' || f.key === 'url') ? (
                <ImageUpload
                  value={slide[f.key] ?? ''}
                  onChange={(val) => {
                    const next = [...slides];
                    next[i] = { ...next[i], [f.key]: val };
                    onChange(next);
                  }}
                />
              ) : f.type === 'richtext' ? (
                <RichTextInput
                  props={slide}
                  fieldKey={f.key}
                  onChangeMulti={opts => {
                    const next = [...slides];
                    next[i] = { ...next[i], ...opts };
                    onChange(next);
                  }}
                  rows={f.rows || 2}
                />
              ) : (
                <input
                  value={slide[f.key] ?? ''}
                  onChange={e => {
                    const next = [...slides];
                    next[i] = { ...next[i], [f.key]: e.target.value };
                    onChange(next);
                  }}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={() => onChange([...(slides || []), fields.reduce((a, f) => ({ ...a, [f.key]: '' }), {})])}
        className="text-xs text-indigo-600 hover:underline text-left"
      >
        + Add slide
      </button>
    </div>
  );
}

function ButtonGroupEditor({ buttons, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {(buttons || []).map((btn, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Button {i + 1}</span>
            <button onClick={() => onChange((buttons || []).filter((_, idx) => idx !== i))} className="text-red-400"><X size={13} /></button>
          </div>
          {[
            { key: 'label', label: 'Label' },
            { key: 'link', label: 'URL' },
            { key: 'color', label: 'Background' },
            { key: 'textColor', label: 'Text Color' },
          ].map(f => (
            <div key={f.key} className="mb-1">
              <label className="text-xs text-gray-400 block mb-0.5">{f.label}</label>
              <input
                value={btn[f.key] ?? ''}
                onChange={e => {
                  const next = [...buttons];
                  next[i] = { ...next[i], [f.key]: e.target.value };
                  onChange(next);
                }}
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => onChange([...(buttons || []), { label: 'Button', link: '#', color: '#4F46E5', textColor: '#fff' }])} className="text-xs text-indigo-600 hover:underline text-left">+ Add button</button>
    </div>
  );
}

const fieldConfig = {
  'header-logo-center': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'logoUrl', label: 'Logo URL', type: 'image' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'header-logo-left': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'logoUrl', label: 'Logo URL', type: 'image' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'navLinks', label: 'Nav Links', type: 'stringlist' },
  ],
  'header-banner': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'header-minimal': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'title', label: 'Company Name', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'borderBottom', label: 'Border (e.g. 3px solid #4F46E5)', type: 'text' },
  ],
  'hero-fullwidth': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'link', label: 'Link URL', type: 'text' },
  ],
  'hero-overlay': [
    { key: 'imageUrl', label: 'Background Image URL', type: 'image' },
    { key: 'overlayText', label: 'Overlay Title', type: 'richtext' },
    { key: 'overlaySubtext', label: 'Overlay Subtext', type: 'richtext', rows: 4 },
    { key: 'overlayColor', label: 'Overlay Color (rgba)', type: 'text' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'hero-split': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'body', label: 'Body', type: 'richtext', rows: 4 },
    { key: 'ctaLabel', label: 'Button Label', type: 'text' },
    { key: 'ctaLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'content-single': [
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'body', label: 'Body', type: 'richtext', rows: 5 },
    { key: 'titleColor', label: 'Title Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
  ],
  'content-two-col': [
    { key: 'col1Title', label: 'Column 1 Title', type: 'richtext' },
    { key: 'col1Body', label: 'Column 1 Body', type: 'richtext', rows: 4 },
    { key: 'col2Title', label: 'Column 2 Title', type: 'richtext' },
    { key: 'col2Body', label: 'Column 2 Body', type: 'richtext', rows: 4 },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'content-quote': [
    { key: 'quote', label: 'Quote', type: 'richtext', rows: 4 },
    { key: 'attribution', label: 'Attribution', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' },
  ],
  'content-numbered': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'steps', label: 'Steps', type: 'stringlist' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'cta-centered': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],
  'cta-banner': [
    { key: 'text', label: 'Banner Text', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],
  'cta-split': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],
  'button-primary': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'button-outline': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'border', label: 'Border (e.g. 2px solid #4F46E5)', type: 'text' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'button-group': [
    { key: 'buttons', label: 'Buttons', type: 'buttongroup' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'button-pill': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'image-single': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'caption', label: 'Caption', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'link', label: 'Link URL', type: 'text' },
    { key: 'imageWidth', label: 'Image Width (e.g. 320px or 80%)', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'image-two-col': [
    { key: 'image1Url', label: 'Image 1 URL', type: 'image' },
    { key: 'alt1', label: 'Image 1 Alt', type: 'text' },
    { key: 'link1', label: 'Image 1 Link', type: 'text' },
    { key: 'caption1', label: 'Image 1 Caption', type: 'text' },
    { key: 'image1Width', label: 'Image 1 Size (e.g. 100%)', type: 'text' },
    { key: 'align1', label: 'Image 1 Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'image2Url', label: 'Image 2 URL', type: 'image' },
    { key: 'alt2', label: 'Image 2 Alt', type: 'text' },
    { key: 'link2', label: 'Image 2 Link', type: 'text' },
    { key: 'caption2', label: 'Image 2 Caption', type: 'text' },
    { key: 'image2Width', label: 'Image 2 Size (e.g. 100%)', type: 'text' },
    { key: 'align2', label: 'Image 2 Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'image-three-col': [
    { key: 'image1Url', label: 'Image 1 URL', type: 'image' },
    { key: 'link1', label: 'Image 1 Link', type: 'text' },
    { key: 'caption1', label: 'Image 1 Caption', type: 'text' },
    { key: 'image1Width', label: 'Image 1 Size (e.g. 100%)', type: 'text' },
    { key: 'align1', label: 'Image 1 Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'image2Url', label: 'Image 2 URL', type: 'image' },
    { key: 'link2', label: 'Image 2 Link', type: 'text' },
    { key: 'caption2', label: 'Image 2 Caption', type: 'text' },
    { key: 'image2Width', label: 'Image 2 Size (e.g. 100%)', type: 'text' },
    { key: 'align2', label: 'Image 2 Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'image3Url', label: 'Image 3 URL', type: 'image' },
    { key: 'link3', label: 'Image 3 Link', type: 'text' },
    { key: 'caption3', label: 'Image 3 Caption', type: 'text' },
    { key: 'image3Width', label: 'Image 3 Size (e.g. 100%)', type: 'text' },
    { key: 'align3', label: 'Image 3 Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'image-grid-2x2': [
    { key: 'images', label: 'Images', type: 'slides', fields: [{ key: 'url', label: 'Image URL' }, { key: 'link', label: 'Link' }, { key: 'caption', label: 'Caption' }] },
    { key: 'imageWidth', label: 'Image Width (e.g. 100%)', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'image-grid-3-horizontal': [
    { key: 'images', label: 'Images', type: 'slides', fields: [{ key: 'url', label: 'Image URL' }, { key: 'link', label: 'Link' }, { key: 'caption', label: 'Caption' }] },
    { key: 'imageWidth', label: 'Image Width (e.g. 100%)', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'image-caption': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
    { key: 'imageWidth', label: 'Image Width (e.g. 320px or 80%)', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'image-panorama': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'caption', label: 'Caption', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'link', label: 'Link URL', type: 'text' },
    { key: 'imageWidth', label: 'Image Width (e.g. 600px or 100%)', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'card-product': [
    { key: 'imageUrl', label: 'Product Image URL', type: 'image' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'price', label: 'Price', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'image-left-text': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'caption', label: 'Image Caption', type: 'text' },
    { key: 'imageColumnWidth', label: 'Image Column Width (e.g. 42%)', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'body', label: 'Body', type: 'richtext', rows: 4 },
    { key: 'readMoreLink', label: 'Read More Link', type: 'text' },
    { key: 'readMoreLabel', label: 'Read More Label', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'image-right-text': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'caption', label: 'Image Caption', type: 'text' },
    { key: 'imageColumnWidth', label: 'Image Column Width (e.g. 42%)', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'body', label: 'Body', type: 'richtext', rows: 4 },
    { key: 'readMoreLink', label: 'Read More Link', type: 'text' },
    { key: 'readMoreLabel', label: 'Read More Label', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'image-big-button': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'caption', label: 'Caption', type: 'text' },
    { key: 'imageWidth', label: 'Image Width (e.g. 420px or 100%)', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'body', label: 'Body', type: 'richtext', rows: 4 },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'image-big-col': [
    { key: 'mainImage', label: 'Main Image URL', type: 'image' },
    { key: 'caption', label: 'Image Caption', type: 'text' },
    { key: 'mainColumnWidth', label: 'Main Column Width (e.g. 48%)', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'mainTitle', label: 'Main Title', type: 'text' },
    { key: 'mainBody', label: 'Main Body', type: 'textarea' },
    { key: 'sideArticles', label: 'Side Articles', type: 'slides', fields: [{ key: 'date', label: 'Date' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Body' }, { key: 'link', label: 'Link' }, { key: 'imageUrl', label: 'Image URL' }] },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'image-video': [
    { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'image' },
    { key: 'caption', label: 'Thumbnail Caption', type: 'text' },
    { key: 'imageWidth', label: 'Thumbnail Width (e.g. 420px or 100%)', type: 'text' },
    { key: 'videoLink', label: 'Video Link', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'useBackgroundColor', label: 'Background Fill', type: 'boolean', checkboxLabel: 'Enable background color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],

  'cta-app-store': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'appStoreLink', label: 'App Store Link', type: 'text' },
    { key: 'playStoreLink', label: 'Google Play Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'cta-newsletter': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'inputPlaceholder', label: 'Input Placeholder', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'cta-event': [
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],

  // ── ECOMMERCE ──────────────────────────────────────────────────────────────
  'ecom-product-single': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'title', label: 'Product Name', type: 'richtext' },
    { key: 'price', label: 'Price', type: 'text' },
    { key: 'originalPrice', label: 'Original Price', type: 'text' },
    { key: 'description', label: 'Description', type: 'richtext', rows: 3 },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-product-two': [
    { key: 'products', label: 'Products', type: 'slides', fields: [{ key: 'imageUrl', label: 'Image URL' }, { key: 'title', label: 'Title' }, { key: 'price', label: 'Price' }, { key: 'link', label: 'Link' }] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-product-three': [
    { key: 'products', label: 'Products', type: 'slides', fields: [{ key: 'imageUrl', label: 'Image URL' }, { key: 'title', label: 'Title' }, { key: 'price', label: 'Price' }, { key: 'link', label: 'Link' }] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-flash-sale': [
    { key: 'badge', label: 'Badge Text', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'ecom-featured': [
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'align', label: 'Image Side', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] },
  ],
  'ecom-order-confirm': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'orderNumber', label: 'Order Number', type: 'text' },
    { key: 'total', label: 'Total', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-abandoned-cart': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'itemName', label: 'Item Name', type: 'text' },
    { key: 'itemPrice', label: 'Item Price', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-promo-code': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'code', label: 'Promo Code', type: 'text' },
    { key: 'expiry', label: 'Expiry Text', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' },
  ],
  'ecom-new-arrivals': [
    { key: 'title', label: 'Section Title', type: 'text' },
    { key: 'products', label: 'Products', type: 'slides', fields: [{ key: 'imageUrl', label: 'Image URL' }, { key: 'title', label: 'Title' }, { key: 'tag', label: 'Tag' }, { key: 'price', label: 'Price' }, { key: 'link', label: 'Link' }] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-review': [
    { key: 'imageUrl', label: 'Product Image URL', type: 'image' },
    { key: 'productName', label: 'Product Name', type: 'text' },
    { key: 'reviewText', label: 'Review Text', type: 'textarea' },
    { key: 'reviewer', label: 'Reviewer Name', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-wishlist': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'ecom-referral': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'points', label: 'Points', type: 'text' },
    { key: 'equivalent', label: 'Equivalent Value', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' },
  ],
  'ecom-bundle': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'products', label: 'Products', type: 'slides', fields: [{ key: 'imageUrl', label: 'Image URL' }, { key: 'title', label: 'Title' }] },
    { key: 'bundlePrice', label: 'Bundle Price', type: 'text' },
    { key: 'originalPrice', label: 'Original Price', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],

  // ── NEW CARDS ──────────────────────────────────────────────────────────────
  'card-blog': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'readMoreLink', label: 'Read More Link', type: 'text' },
    { key: 'readMoreLabel', label: 'Read More Label', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'card-testimonial': [
    { key: 'quote', label: 'Quote', type: 'richtext', rows: 4 },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'avatarUrl', label: 'Avatar URL', type: 'image' },
    { key: 'stars', label: 'Stars (1–5)', type: 'number' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'card-event': [
    { key: 'date', label: 'Day', type: 'text' },
    { key: 'month', label: 'Month / Year', type: 'text' },
    { key: 'title', label: 'Event Title', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' },
  ],
  'card-stat': [
    { key: 'stats', label: 'Stats', type: 'slides', fields: [{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'card-checklist-item': [
    { key: 'imageUrl', label: 'Image URL', type: 'image' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'items', label: 'Checklist Items', type: 'stringlist' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],

  // ── NEW BUTTONS ────────────────────────────────────────────────────────────
  'button-icon-left': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'button-full-width': [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
  ],

  // ── NEW SURVEYS ────────────────────────────────────────────────────────────
  'survey-csat': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'emojis', label: 'Emojis', type: 'stringlist' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],
  'survey-poll': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'choices', label: 'Choices', type: 'stringlist' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],

  // ── NEW CAROUSEL ───────────────────────────────────────────────────────────
  'carousel-testimonial': [
    { key: 'slides', label: 'Slides', type: 'slides', fields: [{ key: 'quote', label: 'Quote' }, { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }] },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
  ],

  // ── NEW FOOTERS ────────────────────────────────────────────────────────────
  'footer-minimal-dark': [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'unsubscribeLink', label: 'Unsubscribe Link', type: 'text' },
    { key: 'privacyLink', label: 'Privacy Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'footer-logo-links': [
    { key: 'logoUrl', label: 'Logo URL', type: 'image' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  // ── AUTO GENERATED MISSING ELEMENTS ──
  'header-dark': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'logoUrl', label: 'Logo Url', type: 'image' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
  ],
  'header-logo-tagline': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'logoUrl', label: 'Logo Url', type: 'image' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'align', label: 'Align', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'header-gradient': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'title', label: 'Title', type: 'richtext' },
    { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
    { key: 'gradientFrom', label: 'Gradient From', type: 'color' },
    { key: 'gradientTo', label: 'Gradient To', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'header-announcement': [
    { key: 'height', label: 'Height (e.g. 80px, auto)', type: 'text' },
    { key: 'message', label: 'Message', type: 'textarea' },
    { key: 'linkLabel', label: 'Link Label', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'hero-split-left': [
    { key: 'ctaLabel', label: 'Cta Label', type: 'text' },
    { key: 'ctaLink', label: 'Cta Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'hero-video': [
    { key: 'thumbnailUrl', label: 'Thumbnail Url', type: 'image' },
    { key: 'videoLink', label: 'Video Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'hero-centered-text': [
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'ctaLabel', label: 'Cta Label', type: 'text' },
    { key: 'ctaLink', label: 'Cta Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'content-update': [
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'readMoreLink', label: 'Read More Link', type: 'text' },
    { key: 'readMoreLabel', label: 'Read More Label', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'content-blog-two-col': [
    { key: 'articles', label: 'Articles', type: 'slides', fields: [{ key: 'tag', label: 'Tag' }, { key: 'title', label: 'Title', type: 'richtext', rows: 2 }, { key: 'date', label: 'Date' }, { key: 'body', label: 'Body', type: 'richtext', rows: 3 }, { key: 'link', label: 'Read More Link' }, { key: 'readMoreLabel', label: 'Read More Label' }, { key: 'imageUrl', label: 'Image URL', type: 'image' }] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'content-checklist': [
    { key: 'items', label: 'Items', type: 'stringlist' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'content-divider': [
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'thickness', label: 'Thickness', type: 'text' },
    { key: 'marginTop', label: 'Margin Top', type: 'text' },
    { key: 'marginBottom', label: 'Margin Bottom', type: 'text' },
  ],
  'content-spacer': [
    { key: 'height', label: 'Height', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'content-three-col': [
    { key: 'cols', label: 'Cols', type: 'slides', fields: [{ key: 'title', label: 'Title' }, { key: 'body', label: 'Body' }] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'content-intro': [
    { key: 'tags', label: 'Tags', type: 'slides', fields: [{ key: 'text', label: 'Tag Text' }, { key: 'color', label: 'Tag Color' }] },
    { key: 'tagsAlign', label: 'Tags Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'align', label: 'Align', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
  ],
  'cta-image-bg': [
    { key: 'overlayColor', label: 'Overlay Color', type: 'color' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'cta-countdown': [
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'timerLabel', label: 'Timer Label', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],
  'cta-referral': [
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'buttonColor', label: 'Button Color', type: 'color' },
    { key: 'buttonTextColor', label: 'Button Text Color', type: 'color' },
  ],
  'card-feature': [
    { key: 'cards', label: 'Cards', type: 'slides', fields: [{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Body' }] },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'card-profile': [
    { key: 'avatarUrl', label: 'Avatar Url', type: 'image' },
    { key: 'bio', label: 'Bio', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'survey-rating': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'stars', label: 'Stars', type: 'number' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
  ],
  'survey-nps': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'lowLabel', label: 'Low Label', type: 'text' },
    { key: 'highLabel', label: 'High Label', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'survey-choice': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'choices', label: 'Choices', type: 'stringlist' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
  ],
  'survey-yesno': [
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'yesLink', label: 'Yes Link', type: 'text' },
    { key: 'noLink', label: 'No Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  'carousel-basic': [
    { key: 'slides', label: 'Slides', type: 'slides', fields: [{ key: 'title', label: 'Title' }, { key: 'imageUrl', label: 'Image URL' }, { key: 'link', label: 'Link' }, { key: 'price', label: 'Price' }] },
  ],
  'carousel-product': [
    { key: 'slides', label: 'Slides', type: 'slides', fields: [{ key: 'title', label: 'Title' }, { key: 'imageUrl', label: 'Image URL' }, { key: 'link', label: 'Link' }, { key: 'price', label: 'Price' }] },
  ],
  'footer-simple': [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'unsubscribeLink', label: 'Unsubscribe Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'footer-social': [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'socialLinks', label: 'Social Links', type: 'slides', fields: [{ key: 'platform', label: 'Platform' }, { key: 'link', label: 'Link' }, { key: 'icon', label: 'Icon (emoji or url)' }] },
    { key: 'unsubscribeLink', label: 'Unsubscribe Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],
  'footer-full': [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'slides', fields: [{ key: 'title', label: 'Title' }, { key: 'links', label: 'Links (comma separated)' }] },
    { key: 'links', label: 'Links', type: 'text' },
    { key: 'unsubscribeLink', label: 'Unsubscribe Link', type: 'text' },
    { key: 'privacyLink', label: 'Privacy Link', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
  ],

  'raw-html': [
    { key: 'html', label: 'HTML', type: 'textarea', rows: 16 },
  ],
};

function parseSpacing(value = '', fallback = '0px') {
  const str = String(value || '').trim();
  const parts = str.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return [fallback, fallback, fallback, fallback];
  if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
  if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
  if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
  return [parts[0], parts[1], parts[2], parts[3]];
}

const InputSquare = ({ val, idx, icon, update }) => (
  <div className="flex flex-col gap-1 items-center">
    <span className="text-[10px] text-gray-400 font-medium">{icon}</span>
    <input
      type="text"
      value={val.replace('px', '')}
      onChange={e => update(idx, e.target.value ? `${e.target.value}px` : '')}
      className="w-full text-center border border-gray-200 rounded px-1 py-1 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-shadow"
    />
  </div>
);

function SpacingEditor({ value, onChange, label, fallback = '0px' }) {
  const [top, right, bottom, left] = parseSpacing(value, fallback);

  const update = (idx, val) => {
    const next = [top, right, bottom, left];
    next[idx] = val || '0px';
    if (next[0] === next[2] && next[1] === next[3]) {
      if (next[0] === next[1]) {
        onChange(next[0]);
      } else {
        onChange(`${next[0]} ${next[1]}`);
      }
    } else {
      onChange(next.join(' '));
    }
  };


  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-gray-600 mb-2">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        <InputSquare val={top} idx={0} icon="Top" update={update} />
        <InputSquare val={bottom} idx={2} icon="Bottom" update={update} />
        <InputSquare val={left} idx={3} icon="Left" update={update} />
        <InputSquare val={right} idx={1} icon="Right" update={update} />
      </div>
    </div>
  );
}

export default function PropertyPanel({ element, onUpdate, onDelete, onClose }) {
    if (!element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm px-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        </div>
        <p className="font-medium text-gray-500">No element selected</p>
        <p className="text-xs mt-1">Click an element on the canvas to edit its properties</p>
      </div>
    );
  }

  const fields = fieldConfig[element.type] || [];

  const handleChange = (key, value) => {
    onUpdate({ ...element, props: { ...element.props, [key]: value } });
  };

  const handleChangeMulti = (patch) => {
    onUpdate({ ...element, props: { ...element.props, ...patch } });
  };

  const renderField = (field) => {
    const val = element.props[field.key];
    const keyLooksLikeImageUrl = /(?:image|logo|avatar|thumbnail).*(?:Url|URL)$/.test(field.key || '');
    if (field.type === 'color') {
      return <ColorInput key={field.key} value={val} onChange={v => handleChange(field.key, v)} />;
    }
    if (field.type === 'boolean') {
      return <Checkbox key={field.key} value={val} onChange={v => handleChange(field.key, v)} label={field.checkboxLabel || field.label} />;
    }
    if (field.type === 'textarea') {
      return <Textarea key={field.key} value={val} rows={field.rows || 3} onChange={v => handleChange(field.key, v)} />;
    }
    if (field.type === 'richtext') {
      return <RichTextInput key={field.key} fieldKey={field.key} props={element.props} onChangeMulti={handleChangeMulti} rows={field.rows || 3} />;
    }
    if (field.type === 'select') {
      return <Select key={field.key} value={val} onChange={v => handleChange(field.key, v)} options={field.options} />;
    }
    if (field.type === 'number') {
      return <Input key={field.key} type="number" value={val} onChange={v => handleChange(field.key, Number(v))} />;
    }
    if (field.type === 'stringlist') {
      return <StringListEditor key={field.key} value={val} onChange={v => handleChange(field.key, v)} />;
    }
    if (field.type === 'slides') {
      return <SlideEditor key={field.key} slides={val} onChange={v => handleChange(field.key, v)} fields={field.fields || []} />;
    }
    if (field.type === 'buttongroup') {
      return <ButtonGroupEditor key={field.key} buttons={val} onChange={v => handleChange(field.key, v)} />;
    }
    if (field.type === 'image' || keyLooksLikeImageUrl) {
      return <ImageUpload key={field.key} value={val} onChange={v => handleChange(field.key, v)} />;
    }
    return <Input key={field.key} value={val} onChange={v => handleChange(field.key, v)} />;
  };

  const isFieldHideable = (field) => {
    return ['text', 'textarea', 'richtext', 'image', 'number'].includes(field.type);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Properties</h3>
          <p className="text-xs text-gray-400 mt-0.5">{element.type}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDelete}
            title="Delete element"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">

        {(() => {
          if (fields.length === 0) return <p className="text-xs text-gray-400">No editable properties for this element.</p>;

          const groups = {
            Content: [],
            Appearance: [],
            Actions: [],
            Advanced: [],
          };

          fields.forEach(field => {
            const key = field.key.toLowerCase();
            if (field.type === 'color' || field.type === 'boolean' || key.includes('align') || key.includes('width') || key.includes('height') || key.includes('radius') || key.includes('border')) {
              groups.Appearance.push(field);
            } else if (key.includes('link') || key.includes('button') || key.includes('cta') || field.type === 'buttongroup') {
              groups.Actions.push(field);
            } else if (field.type === 'text' || field.type === 'textarea' || field.type === 'richtext' || field.type === 'image' || field.type === 'stringlist' || field.type === 'slides' || field.type === 'number') {
              groups.Content.push(field);
            } else {
              groups.Advanced.push(field);
            }
          });

          return Object.entries(groups).map(([groupName, groupFields]) => {
            if (groupFields.length === 0) return null;
            return (
              <div key={groupName} className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">{groupName}</h4>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>
                {groupFields.map(field => {
                  const hidden = !!element.props[`${field.key}Hidden`];
                  const hideable = isFieldHideable(field);
                  return (
                    <Field
                      key={field.key}
                      label={field.label}
                      right={hideable ? (
                        <label className="inline-flex items-center gap-1 text-[11px] text-gray-500 select-none">
                          <input
                            type="checkbox"
                            checked={!hidden}
                            onChange={e => handleChange(`${field.key}Hidden`, !e.target.checked)}
                            className="w-3.5 h-3.5 accent-indigo-600"
                          />
                          Show
                        </label>
                      ) : null}
                    >
                      {renderField(field)}
                    </Field>
                  );
                })}
              </div>
            );
          });
        })()}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase mb-2">Element Spacing</p>
          <SpacingEditor
            label="Padding (px)"
            value={element.props.elementPadding || ''}
            onChange={v => handleChange('elementPadding', v)}
          />
          <SpacingEditor
            label="Margin (px)"
            value={element.props.elementMargin || ''}
            onChange={v => handleChange('elementMargin', v)}
          />
        </div>
      </div>
    </div>
  );
}
