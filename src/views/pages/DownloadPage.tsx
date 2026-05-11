import Navbar from '../components/shared/Navbar';
import DownloadForm from '../components/download/DownloadForm';
import PageHeader from '../components/shared/PageHeader';

/* DOWNLOAD PAGE */
const DownloadPage = () => {
  return (
    <main className="app-gradient">
      <section className="app-shell">
        <Navbar ctaLabel="Retour accueil" ctaPath="/" />

        <section className="app-main">
          <div className="page-wrap">
              <PageHeader
                title="Lien de téléchargement"
                subtitle="Télécharge le fichier partagé. Le lien peut expirer automatiquement."
              />
            <DownloadForm />
          </div>
        </section>
      </section>
    </main>
  );
};

export default DownloadPage;
