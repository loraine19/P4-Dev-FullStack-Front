import { useState, useRef, useEffect } from 'react';
import { MoreVert } from './Icons';

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
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  /* FOCUS FIRST ITEM ON OPEN */
  useEffect(() => {
    if (isOpen) {
      const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
      first?.focus();
    }
  }, [isOpen]);

  /* HANDLE ITEM CLICK */
  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  /* KEYBOARD NAVIGATION */
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const idx = menuItems.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      menuItems[(idx + 1) % menuItems.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      menuItems[(idx - 1 + menuItems.length) % menuItems.length]?.focus();
    }
  };

  return (
    <div className="context-menu" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        className="context-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVert />
      </button>

      {isOpen && (
        <div className="context-menu-panel" role="menu" onKeyDown={handleMenuKeyDown}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
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
