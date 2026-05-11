import Button from '../shared/Button';
import Callout from '../shared/Callout';
import InputField from '../shared/InputField';

/* DOWNLOAD FORM */
const DownloadForm = () => {
  return (
    <section className="card center-block" aria-label="Formulaire de téléchargement">
      <h2 className="card-title">Télécharger le fichier</h2>

      <form className="form-grid">
        <Callout variant="info" message="Ce lien peut être protégé par un mot de passe." />

        <InputField
          id="download-password"
          label="Mot de passe (si demandé)"
          type="password"
          placeholder="Saisissez le mot de passe"
          autoComplete="current-password"
        />

        <Button variant="secondary">Télécharger</Button>
      </form>
    </section>
  );
};

export default DownloadForm;
