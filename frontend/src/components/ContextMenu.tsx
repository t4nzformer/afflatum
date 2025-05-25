import React from 'react';

export type ContextMenuType = 'afflation' | 'folder' | 'echo';

interface ContextMenuProps {
  type: ContextMenuType;
  id: number | string;
  position: { x: number; y: number };
  onDelete?: (id: number | string) => void;
  onRename?: (id: number | string) => void;
  onClose: () => void;
}

export default function ContextMenu({
  type,
  id,
  position,
  onDelete,
  onRename,
  onClose,
}: ContextMenuProps) {
  const baseStyles = 'block w-full text-left px-4 py-2 text-sm hover:bg-neutral-700';

  const options = [];

  if (onDelete) {
    options.push({
      label: `Delete ${type}`,
      action: () => onDelete(id),
      color: 'text-red-500',
    });
  }

  if (onRename) {
    options.push({
      label: 'Rename (soon)',
      action: () => onRename(id),
      color: 'text-gray-200',
    });
  }

  return (
    <div
      className="absolute z-50 bg-neutral-800 border border-gray-700 rounded shadow"
      style={{ top: position.y, left: position.x }}
      onClick={onClose}
    >
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            opt.action();
          }}
          className={`${baseStyles} ${opt.color}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
