import Button from './Button';
import UploadButton from './UploadButton';

/* UPLOAD CALL PROPS */
interface IUploadCallProps {
  text?: string;
  ctaLabel?: string;
  onAnonymousUpload?: () => void;
  onRequireLogin?: () => void;
}

/* UPLOAD CALL */
const UploadCall = ({
  text = 'Tu veux partager un fichier ?',
  ctaLabel,
  onAnonymousUpload,
  onRequireLogin,
}: IUploadCallProps) => {
  return (
    <div className="quick-share-hero">
      <h1>{text}</h1>
      <UploadButton />

      {onAnonymousUpload && ctaLabel ? (
        <Button variant="secondary" onClick={onAnonymousUpload}>
          {ctaLabel}
        </Button>
      ) : null}

      {onRequireLogin ? (
        <Button variant="text" onClick={onRequireLogin}>
          Se connecter
        </Button>
      ) : null}
    </div>
  );
};

export default UploadCall;
