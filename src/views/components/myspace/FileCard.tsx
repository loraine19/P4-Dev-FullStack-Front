import { Description, Lock } from '../shared/Icons';
import ContextMenu from '../shared/ContextMenu';
import type { FileItemDto } from '../../../types/file.types';

/* FILE CARD PROPS */
interface FileCardProps {
  file: FileItemDto;
  isExpired: boolean;
  expiryText: string;
  onDelete: (fileId: number) => void;
  onDownload: (file: FileItemDto) => void;
  onCopyLink: (shareToken: string) => void;
}

/* FILE CARD */
const FileCard = ({ file, isExpired, expiryText, onDelete, onDownload, onCopyLink }: FileCardProps) => {
  /* MENU ITEMS */
  const menuItems = [
    { label: 'Copier le lien', action: () => onCopyLink(file.shareToken) },
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
          {file.tags?.length > 0 && (
            <ul className="chip-row" aria-label="Tags">
              {file.tags.map((tag) => (
                <li key={tag.id} className="chip">{tag.name}</li>
              ))}
            </ul>
          )}
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

