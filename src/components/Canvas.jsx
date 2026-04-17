import { useEffect, useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { renderElementHtmlWithPostProcessing } from '../utils/htmlRenderer';

function DroppableElement({ element, index, isSelected, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, onAdd, totalElements }) {
  const [dropPosition, setDropPosition] = useState(null); // 'before' | 'after' | null

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementCenter = rect.top + rect.height / 2;

    // Determine if mouse is in top half (before) or bottom half (after)
    const position = mouseY < elementCenter ? 'before' : 'after';
    setDropPosition(position);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDropPosition(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const elementData = JSON.parse(data);
        // Calculate insert index based on drop position
        const insertIndex = dropPosition === 'before' ? index : index + 1;
        onAdd?.(elementData, insertIndex);
      }
    } catch (err) {
      console.error('Failed to parse dropped element:', err);
    }
    setDropPosition(null);
  }, [dropPosition, index, onAdd]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {/* Drop indicator - before element */}
      {dropPosition === 'before' && (
        <div
          className="absolute -top-2 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '4px',
            background: '#6366f1',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
          }}
        >
          <div
            className="absolute -left-1 -top-1 w-3 h-3 rounded-full"
            style={{ background: '#6366f1' }}
          />
          <div
            className="absolute -right-1 -top-1 w-3 h-3 rounded-full"
            style={{ background: '#6366f1' }}
          />
        </div>
      )}

      <SortableElement
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />

      {/* Drop indicator - after element (only for last element) */}
      {dropPosition === 'after' && index === totalElements - 1 && (
        <div
          className="absolute -bottom-2 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '4px',
            background: '#6366f1',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
          }}
        >
          <div
            className="absolute -left-1 -top-1 w-3 h-3 rounded-full"
            style={{ background: '#6366f1' }}
          />
          <div
            className="absolute -right-1 -top-1 w-3 h-3 rounded-full"
            style={{ background: '#6366f1' }}
          />
        </div>
      )}
    </div>
  );
}

function SortableElement({ element, isSelected, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Optimize: Memoize HTML rendering since it uses expensive regex replacements
  // and string concats which can drop frame rates during 60fps drag operations
  const html = useMemo(() => {
    return renderElementHtmlWithPostProcessing(element);
  }, [element]);

  return (
    <div
      id={`element-${element.id}`}
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all ${
        isSelected
          ? 'ring-2 ring-indigo-500 ring-offset-1'
          : 'hover:ring-1 hover:ring-indigo-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
    >
      {/* Toolbar */}
      <div className={`absolute -top-8 left-0 flex items-center gap-0.5 z-20 transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-1 bg-indigo-600 text-white rounded px-2 py-1 text-xs cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={12} />
          <span className="font-medium">{element.type}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded p-1 shadow-sm"
          title="Move up"
        >
          <ChevronUp size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded p-1 shadow-sm"
          title="Move down"
        >
          <ChevronDown size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded p-1 shadow-sm"
          title="Duplicate"
        >
          <Copy size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded p-1 shadow-sm"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Rendered HTML */}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="w-full pointer-events-none"
        style={{ fontFamily: 'sans-serif' }}
      />
    </div>
  );
}

export default function Canvas({ elements, selectedId, onSelect, onReorder, onDelete, onDuplicate, onAdd, emailMeta }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Handle empty canvas drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const elementData = JSON.parse(data);
        onAdd?.(elementData);
      }
    } catch (err) {
      console.error('Failed to parse dropped element:', err);
    }
  }, [onAdd]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex(e => e.id === active.id);
      const newIndex = elements.findIndex(e => e.id === over.id);
      onReorder(arrayMove(elements, oldIndex, newIndex));
    }
  };

  const scrollToElement = (id) => {
    setTimeout(() => {
      document.getElementById(`element-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleMoveUp = useCallback((index) => {
    if (index === 0) return;
    const id = elements[index].id;
    onReorder(arrayMove(elements, index, index - 1));
    scrollToElement(id);
  }, [elements, onReorder]);

  const handleMoveDown = useCallback((index) => {
    if (index === elements.length - 1) return;
    const id = elements[index].id;
    onReorder(arrayMove(elements, index, index + 1));
    scrollToElement(id);
  }, [elements, onReorder]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea/select
      const activeTag = document.activeElement?.tagName?.toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;
      if (document.activeElement?.isContentEditable) return;

      if (!selectedId) return;

      const idx = elements.findIndex(el => el.id === selectedId);
      if (idx === -1) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleMoveUp(idx);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleMoveDown(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedId, onReorder, handleMoveUp, handleMoveDown]);

  if (elements.length === 0) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center text-center px-8"
        onClick={() => onSelect(null)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
          transition: 'background 0.2s ease',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
          style={{
            background: isDragOver ? '#6366f1' : '#e0e7ff',
            transform: isDragOver ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke={isDragOver ? '#ffffff' : '#6366f1'}
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-semibold text-gray-700 text-lg mb-1">
          {isDragOver ? 'Drop element here' : 'Start building your email'}
        </h3>
        <p className="text-sm text-gray-400 max-w-xs">
          {isDragOver
            ? 'Release to add this element to your email'
            : 'Drag elements from the sidebar or click to add them to your canvas'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-full py-8 px-4 flex justify-center"
      onClick={() => onSelect(null)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: isDragOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
        transition: 'background 0.2s ease',
      }}
    >
      <div
        className="w-full shadow-md rounded-lg overflow-hidden transition-all duration-300"
        style={{
          maxWidth: emailMeta?.canvasWidth ? `${emailMeta.canvasWidth}px` : '600px',
          minHeight: 100,
          margin: '0 auto',
          backgroundColor: emailMeta?.backgroundColor || '#ffffff',
          fontFamily: emailMeta?.fontFamily || 'sans-serif'
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={elements.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="relative" style={{ paddingTop: 4 }}>
              {elements.map((el, index) => (
                <DroppableElement
                  key={el.id}
                  element={el}
                  index={index}
                  isSelected={selectedId === el.id}
                  onSelect={onSelect}
                  onDelete={() => onDelete(el.id)}
                  onDuplicate={() => onDuplicate(el.id)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                  onAdd={onAdd}
                  totalElements={elements.length}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
