import { useState } from 'react';
import { ShoppingCart, GripVertical } from 'lucide-react';
import { CATEGORIES, ELEMENT_TEMPLATES } from '../data/elements';
import ThumbnailPreview from './ElementThumbnail';
import { THEME_LIST } from '../data/themes';

function DraggableElement({ tmpl, onAdd }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: tmpl.id,
      props: { ...tmpl.defaults }
    }));
    // Set a custom drag image if needed
    e.dataTransfer.setDragImage(e.currentTarget, e.currentTarget.offsetWidth / 2, 20);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    onAdd({ type: tmpl.id, props: { ...tmpl.defaults } });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-move rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: isDragging ? '1px solid #6366f1' : '1px solid #2a2d3e',
        boxShadow: isDragging ? '0 8px 24px rgba(99, 102, 241, 0.35)' : isHovered ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
        transform: isHovered && !isDragging ? 'translateY(-4px)' : isDragging ? 'rotate(2deg) scale(1.02)' : 'translateY(0)',
        opacity: isDragging ? 0.9 : 1,
      }}
    >
      {/* Drag handle indicator - slides out on hover */}
      <div
        className="flex items-center justify-center gap-1 py-1 transition-all duration-300 overflow-hidden"
        style={{
          background: isHovered ? '#2d3250' : '#1e2030',
          borderBottom: '1px solid #2a2d3e',
          maxHeight: isHovered ? '28px' : '0px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <GripVertical size={12} style={{ color: '#6366f1' }} />
        <span className="text-[10px] font-medium" style={{ color: '#6366f1' }}>
          Drag to canvas
        </span>
      </div>

      {/* Thumbnail area */}
      <div
        className="w-full overflow-hidden"
        style={{ background: '#252840', padding: 8 }}
      >
        <div
          className="rounded-lg overflow-hidden transition-transform duration-300"
          style={{
            background: '#fff',
            transform: isHovered && !isDragging ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <ThumbnailPreview thumbnail={tmpl.thumbnail} label={tmpl.label} />
        </div>
      </div>

      {/* Label */}
      <div
        className="px-2.5 py-2 transition-colors"
        style={{ background: '#1e2030' }}
      >
        <p className="text-xs font-medium leading-tight" style={{ color: '#d1d5db' }}>
          {tmpl.label}
        </p>
      </div>
    </div>
  );
}

export default function ElementsSidebar({ onAdd, activeTheme, onThemeChange }) {
  const [activeCategory, setActiveCategory] = useState('header');

  const templates = ELEMENT_TEMPLATES[activeCategory] || [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Dark category list */}
      <div
        className="overflow-y-auto shrink-0 flex flex-col"
        style={{ width: 168, background: '#1e2030' }}
      >
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6b7280' }}>
            Themes
          </p>
        </div>
        <div className="px-4 flex gap-2 flex-wrap mb-4">
          {THEME_LIST.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: theme.colorPreview,
                borderColor: activeTheme === theme.id ? '#6366f1' : 'transparent',
                boxShadow: activeTheme === theme.id ? '0 0 0 2px #1e2030' : 'none'
              }}
              title={theme.name}
            />
          ))}
        </div>
        <div className="px-4 pt-2 pb-2 border-t border-gray-700/50">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6b7280' }}>
            Components
          </p>
        </div>
        <div className="flex flex-col gap-0.5 px-2 pb-4">
          {CATEGORIES.map(cat => {
            const count = (ELEMENT_TEMPLATES[cat.id] || []).length;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-all"
                style={{
                  background: active ? '#2d3250' : 'transparent',
                  color: active ? '#ffffff' : '#9ca3af',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#252840'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-sm font-medium">{cat.label}</span>
                <span
                  className="text-xs font-semibold tabular-nums ml-2 rounded px-1.5 py-0.5"
                  style={{
                    background: active ? '#4f5db3' : '#2a2d40',
                    color: active ? '#c7d2fe' : '#6b7280',
                    minWidth: 22,
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: 2-column thumbnail grid */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#181a27' }}>
        {/* Section header */}
        <div
          className="sticky top-0 z-10 px-4 pt-4 pb-3"
          style={{ background: '#181a27', borderBottom: '1px solid #2a2d3e' }}
        >
          <p className="text-sm font-semibold text-white">
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div className="p-3 grid grid-cols-2 gap-3">
          {templates.map(tmpl => (
            <DraggableElement
              key={tmpl.id}
              tmpl={tmpl}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
