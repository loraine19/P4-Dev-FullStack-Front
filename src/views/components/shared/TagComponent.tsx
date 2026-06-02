import { useState } from 'react';
import type { Tag } from '../../../types/tag.types';
import Button from './Button';

/* TAG COMPONENT PROPS */
interface TagComponentProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  onChange: (nextValue: string) => void;
  onAdd: () => void;
}

/* TAG COMPONENT */
const TagComponent = ({
  id,
  label,
  placeholder,
  value,
  tags,
  selectedTags,
  setSelectedTags,
  onChange,
  onAdd,
}: TagComponentProps) => {

  const [showAddButton, setShowAddButton] = useState(false);
  return (
   
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="tag-row">
        <input
        aria-label="Saisir un tag"
          id={id}
          className="form-input"
          type="text"
          value={value}
          onChange={(event) => {
            const val = event.target.value;
            onChange(val);
            const exist = tags.find((tag) => tag.name === val);
            const alreadySelected = selectedTags.find((tag) => tag.name === val);
            if (exist && !alreadySelected) {
              setSelectedTags([...selectedTags, exist]);
              onChange('');
              setShowAddButton(false);
            }
            else setShowAddButton(val.length > 0 && !alreadySelected);
          }}
          placeholder={placeholder}
          list={`${id}-suggestions`}
        />
        {showAddButton &&
          <Button
            variant="plus"
            onClick={onAdd}
            aria-label="Ajouter le tag">
          +
        </Button>}
      </div>

      <datalist id={`${id}-suggestions`}>
        {tags.filter((tag) => !selectedTags.some((t) => t.id === tag.id)).map((tag) => (
          <option key={tag.id} value={tag.name} />
        ))}
      </datalist>

      {selectedTags.length > 0 ? (
        <div className="chip-row" aria-label="Tags sélectionnés">
          {[...new Set(selectedTags)].map((tag) => (
            <button
              aria-label={`Retirer le tag ${tag.name}`}
              title={`Retirer le tag ${tag.name}`}
              key={`${tag.id}-chip`}
              type="button"
              className="chip chip-action"
              onClick={() => setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))} 
            >
              {tag.name} ×
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TagComponent;
