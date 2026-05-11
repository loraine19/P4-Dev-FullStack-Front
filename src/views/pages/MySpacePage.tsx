import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Switch from '../components/shared/Switch';
import Button from '../components/shared/Button';
import FileCard from '../components/myspace/FileCard';
import generateMockFiles, { FILE_STATUS } from '../../utils/mockFiles';
import useAuthStore from '../../stores/authStore';

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
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_TYPE[keyof typeof FILTER_TYPE]>(FILTER_TYPE.ALL);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [files] = useState(generateMockFiles());

  /* FILTER TABS */
  const filterTabs = [
    { id: FILTER_TYPE.ALL, label: 'Tous' },
    { id: FILTER_TYPE.ACTIVE, label: 'Actifs' },
    { id: FILTER_TYPE.EXPIRED, label: 'Expiré' },
  ];

  /* GET FILTERED FILES */
  const filteredFiles = useMemo(() => {
    if (activeFilter === FILTER_TYPE.ALL) return files;
    if (activeFilter === FILTER_TYPE.ACTIVE) return files.filter((f) => f.status === FILE_STATUS.ACTIVE);
    if (activeFilter === FILTER_TYPE.EXPIRED) return files.filter((f) => f.status === FILE_STATUS.EXPIRED);
    return files;
  }, [files, activeFilter]);

  /* FORMAT EXPIRY TEXT */
  const getExpiryText = (expiresAt: Date): string => {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays < 0) return 'Expiré';
    if (diffDays === 0) return 'Expire aujourd\'hui';
    if (diffDays === 1) return 'Expire demain';
    return `Expire dans ${diffDays} jours`;
  };

  /* HANDLE DELETE */
  const handleDeleteFile = (_fileId: string) => {
    // TODO: implement delete API call
  };

  /* HANDLE DOWNLOAD */
  const handleDownloadFile = (_fileId: string) => {
    // TODO: implement download API call
  };

  /* HANDLE ADD FILES */
  const handleAddFiles = () => {
    setIsSideMenuOpen(false);
    navigate('/upload');
  };

  /* HANDLE LOGOUT */
  const handleLogout = async () => {
    setIsSideMenuOpen(false);
    await logout();
    navigate('/');
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
          <Button variant="text" onClick={handleLogout}>
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
          <h1 className="page-heading">Mes fichiers</h1>

          {/* FILTER SWITCH */}
          <Switch activeTab={activeFilter} tabs={filterTabs} onTabChange={handleTabChange} />

          {/* FILE LIST */}
          <div className="file-list">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  expiryText={getExpiryText(file.expiresAt)}
                  onDelete={handleDeleteFile}
                  onDownload={handleDownloadFile}
                />
              ))
            ) : (
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

