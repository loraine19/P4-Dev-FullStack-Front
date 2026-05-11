import { Description, Lock } from '@project-lary/react-material-symbols';
import ContextMenu from '../shared/ContextMenu';
import type { IFile } from '../../../utils/mockFiles';
import { FILE_STATUS } from '../../../utils/mockFiles';

/* FILE CARD PROPS */
interface IFileCardProps {
  file: IFile;
  expiryText: string;
  onDelete: (fileId: string) => void;
  onDownload: (fileId: string) => void;
}

/* FILE CARD */
const FileCard = ({ file, expiryText, onDelete, onDownload }: IFileCardProps) => {
  const isExpired = file.status === FILE_STATUS.EXPIRED;

  /* MENU ITEMS */
  const menuItems = [
    { label: 'Télécharger', action: () => onDownload(file.id) },
    { label: 'Supprimer', action: () => onDelete(file.id) },
  ];

  return (
    <div className="file-card">
      <div className="file-card-main">
        <Description className="file-card-icon" />

        <div className="file-card-copy">
          <h3 className="file-card-title">{file.name}</h3>
          <p className={`file-card-expiry ${isExpired ? 'is-expired' : ''}`}>{expiryText}</p>
        </div>
      </div>

      <div className="file-card-actions">
        {file.protectedFile && (
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

