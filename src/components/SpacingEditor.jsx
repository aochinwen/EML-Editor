import React from 'react';

function parseSpacing(value = '', fallback = '0px') {
  const parts = value.trim().split(/\s+/).filter(Boolean);
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

export default function SpacingEditor({ value, onChange, label, fallback = '0px' }) {
  const [top, right, bottom, left] = parseSpacing(value, fallback);

  const update = (idx, val) => {
    const next = [top, right, bottom, left];
    next[idx] = val || '0px';
    // try to simplify
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
