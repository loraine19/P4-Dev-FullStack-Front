import { useMemo, useState } from 'react';
import Button from '../shared/Button';
import InputField from '../shared/InputField';
import SelectField from '../shared/SelectField';
import TagComponent from '../shared/TagComponent';

/* EXISTING TAGS */
const EXISTING_TAGS = ['design', 'client', 'facture', 'urgent', 'contract', 'media'];

/* UPLOAD FORM */
const UploadForm = () => {
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /* TAG ACTIONS */
  const normalizedTag = useMemo(() => tagInput.trim().toLowerCase(), [tagInput]);

  const handleAddTag = () => {
    if (!normalizedTag) return;
    if (selectedTags.includes(normalizedTag)) return;

    setSelectedTags((currentTags) => [...currentTags, normalizedTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <section className="card center-block sheet-mobile" aria-label="Formulaire d'upload">
      <h2 className="card-title">Uploader un fichier</h2>

      <form className="form-grid">
        <InputField
          id="upload-file"
          label="Fichier"
          type="file"
          inputClassName="form-file"
        />

        <div className="grid-2">
          <SelectField
            id="upload-expiration"
            className="grid-1"
            label="Durée d'expiration"
            defaultValue="24h"
            options={[
              { value: '1h', label: '1 heure' },
              { value: '24h', label: '24 heures' },
              { value: '7d', label: '7 jours' },
              { value: '30d', label: '30 jours' },
            ]}
          />

          <InputField
            id="upload-password"
            className="grid-1"
            label="Mot de passe (optionnel)"
            type="password"
            placeholder="Ajouter un mot de passe"
            autoComplete="new-password"
          />
        </div>

        <TagComponent
          id="upload-tags"
          label="Tags"
          value={tagInput}
          onChange={setTagInput}
          suggestions={EXISTING_TAGS}
          tags={selectedTags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          placeholder="design, client, facture"
        />

        <Button variant="primary">Générer un lien de partage</Button>
      </form>
    </section>
  );
};

export default UploadForm;
