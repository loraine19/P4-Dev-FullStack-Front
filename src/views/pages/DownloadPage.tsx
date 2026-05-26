import { useParams } from 'react-router-dom';
import DownloadForm from '../components/download/DownloadForm';
import PageHeader from '../components/shared/PageHeader';

/* DOWNLOAD PAGE */
const DownloadPage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();

  return (
    <main className="clear-page">
      <section className="stack-center">
        <PageHeader
          title="Lien de téléchargement"
          subtitle="Télécharge le fichier partagé. Le lien peut expirer automatiquement."
        />
        <DownloadForm shareToken={shareToken ?? ''} />
      </section>
    </main>
  );
};

export default DownloadPage;
