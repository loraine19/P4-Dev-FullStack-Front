import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Switch from '../components/shared/Switch';
import Button from '../components/shared/Button';
import FileCard from '../components/myspace/FileCard';
import Callout from '../components/shared/Callout';
import useAuthStore from '../../stores/authStore';
import { useFileStoreShallow } from '../../stores/fileStore';
import { useTagStoreShallow } from '../../stores/tagStore';
import { FileItem } from '../../entities/FileItem';
import type { FileItemDto } from '../../types/file.types';
import ContextMenu from '../components/shared/ContextMenu';

/* FILTER CONSTANTS */
const FILTER_TYPE = {
  ALL: 'all',
  ACTIVE: 'active',
  EXPIRED: 'expired',
} as const;

/* MY SPACE PAGE */
const MySpacePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { files, loadFiles, deleteFile, error, isLoading } = useFileStoreShallow((s) => ({
    files: s.files,
    loadFiles: s.loadFiles,
    deleteFile: s.deleteFile,
    error: s.error,
    isLoading: s.isLoading,
  }));
  const { removeTag, errorTags } = useTagStoreShallow((s) => ({
    removeTag: s.removeTag,
    errorTags: s.errorTags,
  }));
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_TYPE[keyof typeof FILTER_TYPE]>(FILTER_TYPE.ALL);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const[availableTags, setAvailableTags] = useState<{ id: number; name: string }[]>([]);
  
  /* LOAD FILES */
  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  /* INITIALIZE AVAILABLE TAGS */
  useEffect(() => {
    if (files.length === 0) return;
    const allTags = files.flatMap((f) => f.tags);
    const uniqueTags = Array.from(new Set(allTags.map((t) => t.id))).map((id) => {
      return allTags.find((t) => t.id === id)!;
    });
    setAvailableTags(uniqueTags);
  }, [files]);

  /* FILTER TABS */
  const filterTabs = [
    { id: FILTER_TYPE.ALL, label: 'Tous' },
    { id: FILTER_TYPE.ACTIVE, label: 'Actifs' },
    { id: FILTER_TYPE.EXPIRED, label: 'Expiré' },
  ];

/* FILTERED FILES */
  const filteredFiles = useMemo(() => {
    let result = files;
    if (activeFilter === FILTER_TYPE.ACTIVE) result = result.filter((f) => !new FileItem(f).isExpired());
    if (activeFilter === FILTER_TYPE.EXPIRED) result = result.filter((f) => new FileItem(f).isExpired());
    if (selectedTagIds.length > 0) result = result.filter((f) => f.tags.some((t) => selectedTagIds.includes(t.id)));
    return result;
  }, [files, activeFilter, selectedTagIds ]);

  /* HANDLE DOWNLOAD */
  const handleDownloadFile = (file: FileItemDto) => {
    navigate(`/download/${file.shareToken}`);
  };

  /* HANDLE COPY LINK */
  const handleCopyLink = (shareToken: string) => {
    void navigator.clipboard.writeText(`${window.location.origin}/download/${shareToken}`);
  };

  /* HANDLE ADD FILES */
  const handleAddFiles = () => {
    setIsSideMenuOpen(false);
    navigate('/upload');
  };

  /* HANDLE LOGOUT */
  const handleLogout = async () => {
    setIsSideMenuOpen(false);
    const isLoggedOut = await logout();
    if (isLoggedOut) {
      navigate('/');
    }
  };

  /* OPEN SIDE MENU */
  const handleOpenSideMenu = () => {
    setIsSideMenuOpen(true);
  };

  /* CLOSE SIDE MENU */
  const handleCloseSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  /* HANDLE TAB CHANGE */
  const handleTabChange = (tabId: string) => {
    setActiveFilter(tabId as typeof FILTER_TYPE[keyof typeof FILTER_TYPE]);
  };

  /* HANDLE TAG FILTER */
  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  /* CONTEXT MENU ITEMS */
  const menuItems = (tagId: number) => [
    { label: 'Supprimer', action: async () => {
      await removeTag(tagId);
      await loadFiles();
    } },
  ];

  return (
    <main className="clear-page my-space-page">
      <header className="my-space-topbar">
        <div className="my-space-topbar-left">
          <Button variant="text" className="my-space-burger" aria-label="Ouvrir le menu latéral" onClick={handleOpenSideMenu}>
            ☰
          </Button>
        </div>

        <div className="my-space-topbar-actions">
          <Button variant="dark" onClick={handleAddFiles}>
            Ajouter des fichiers
          </Button>
          <Button
          id="logout-button"
            variant="text"
            onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <section className="my-space-layout">
        <Sidebar
          isOpen={isSideMenuOpen}
          onClose={handleCloseSideMenu}
          onAddFiles={handleAddFiles}
          onLogout={handleLogout}
        />

        <section className="my-space-main">

        {/* CONTENT */}
        <div className="my-space-content">
            <h1 className="page-heading">
              Mes fichiers
            </h1>

          {/* FILTER SWITCH */}
            <Switch
              activeTab={activeFilter}
              tabs={filterTabs}
              onTabChange={handleTabChange} />

          {/* TAG FILTER */}
            {availableTags && (
           
            <div className="chip-row">
                {availableTags.map((tag) => {
                 const isActive = selectedTagIds.includes(tag.id);
                 return (
                   <div
                  id={`tag-${tag.id}`}
                    key={tag.id ?? 'test'} className={`chip chip-action${isActive ? ' chip-active' : ''}`}  >
                     <button type="button"
                       onClick={() => handleToggleTag(tag.id)}>
                      <p className="chip-name">{tag.name}</p>
                       {isActive && <span className="chip-action-close">×</span>}
                     </button>
                     {!isActive &&
                         <ContextMenu items={menuItems(tag.id)} /> }
                  </div>
                );
              })}
            </div>
          )}

          {/* FILE LIST */}
            {(error || errorTags) && <Callout error={error ?? errorTags ?? undefined} />}
          <div className={`file-list ${isLoading ? 'hidden' : ''}`}>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => {
                const entity = new FileItem(file);
                return (
                  <FileCard
                    key={file.id}
                    file={file}
                    isExpired={entity.isExpired()}
                    expiryText={entity.formatExpiry()}
                    onDelete={deleteFile}
                    onDownload={handleDownloadFile}
                    onCopyLink={handleCopyLink}
                  />
                );
              }
              )
              )
             : (
              <p className="files-empty">Aucun fichier</p>
            )}
          </div>
        </div>
        </section>
      </section>
    </main>
  );
};

export default MySpacePage;

