import Button from './Button';

/* TAG COMPONENT PROPS */
interface ITagComponentProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  suggestions: string[];
  tags: string[];
  onChange: (nextValue: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
}

/* TAG COMPONENT */
const TagComponent = ({
  id,
  label,
  placeholder,
  value,
  suggestions,
  tags,
  onChange,
  onAdd,
  onRemove,
}: ITagComponentProps) => {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="tag-row">
        <input
          id={id}
          className="form-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          list={`${id}-suggestions`}
        />
        <Button variant="plus" onClick={onAdd} aria-label="Ajouter le tag">
          +
        </Button>
      </div>

      <datalist id={`${id}-suggestions`}>
        {suggestions.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>

      {tags.length > 0 ? (
        <div className="chip-row" aria-label="Tags sélectionnés">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="chip chip-action"
              onClick={() => onRemove(tag)}
              aria-label={`Retirer le tag ${tag}`}
            >
              {tag} ×
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TagComponent;