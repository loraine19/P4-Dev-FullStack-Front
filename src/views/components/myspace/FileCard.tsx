import { Description, Lock } from '@project-lary/react-material-symbols';
import ContextMenu from '../shared/ContextMenu';
import type { FileItem } from '../../../types/file.types';

/* FILE CARD PROPS */
interface IFileCardProps {
  file: FileItem;
  expiryText: string;
  onDelete: (fileId: number) => void;
  onDownload: (file: FileItem) => void;
}

/* FILE CARD */
const FileCard = ({ file, expiryText, onDelete, onDownload }: IFileCardProps) => {
  const isExpired = new Date(file.expiresAt) <= new Date();

  /* MENU ITEMS */
  const menuItems = [
    { label: 'Télécharger', action: () => onDownload(file) },
    { label: 'Supprimer', action: () => onDelete(file.id) },
  ];

  return (
    <div className="file-card">
      <div className="file-card-main">
        <Description className="file-card-icon" />

        <div className="file-card-copy">
          <h3 className="file-card-title">{file.originalName}</h3>
          <p className={`file-card-expiry ${isExpired ? 'is-expired' : ''}`}>{expiryText}</p>
        </div>
      </div>

      <div className="file-card-actions">
        {file.passwordProtected && (
          <span className="file-card-lock" aria-label="Fichier protégé">
            <Lock />
          </span>
        )}

        {!isExpired && (
          <ContextMenu items={menuItems} />
        )}
      </div>
    </div>
  );
};

export default FileCard;

