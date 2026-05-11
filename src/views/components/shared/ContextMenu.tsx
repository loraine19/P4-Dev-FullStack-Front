import { useState, useRef, useEffect } from 'react';
import { MoreVert } from '@project-lary/react-material-symbols';

/* CONTEXT MENU ITEM */
interface IContextMenuItem {
  label: string;
  action: () => void;
}

/* CONTEXT MENU PROPS */
interface IContextMenuProps {
  items: IContextMenuItem[];
}

/* CONTEXT MENU */
const ContextMenu = ({ items }: IContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  /* HANDLE ITEM CLICK */
  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="context-menu" ref={menuRef}>
      <button
        type="button"
        className="context-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Options"
      >
        <MoreVert />
      </button>

      {isOpen && (
        <div className="context-menu-panel">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="context-menu-item"
              onClick={() => handleItemClick(item.action)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
