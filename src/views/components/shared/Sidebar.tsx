import Button from './Button';

/* SIDEBAR PROPS */
interface ISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFiles: () => void;
  onLogout: () => void;
}

/* SIDEBAR */
const Sidebar = ({ isOpen, onClose, onAddFiles, onLogout }: ISidebarProps) => {
  return (
    <>
      <button
        type="button"
        className={`my-space-overlay ${isOpen ? 'is-visible' : ''}`}
        aria-label="Fermer le menu"
        onClick={onClose}
      />

      <aside className={`sidebar my-space-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="my-space-sidebar-header">
          <h2 className="my-space-sidebar-title">Datashare</h2>
          <button type="button" className="my-space-sidebar-close" onClick={onClose} aria-label="Fermer le menu latéral">
            ×
          </button>
        </div>

        <div className="my-space-sidebar-content">
          <Button variant="text" className="my-space-sidebar-link is-active">
            Mes fichiers
          </Button>

          <Button variant="dark" onClick={onAddFiles}>
            Ajouter des fichiers
          </Button>

          <Button variant="text" onClick={onLogout}>
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

