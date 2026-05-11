/* SWITCH TEXT PROPS */
interface ISwitchTextProps {
  prefix: string;
  actionLabel: string;
  onClick: () => void;
}

/* SWITCH TEXT */
const SwitchText = ({ prefix, actionLabel, onClick }: ISwitchTextProps) => {
  return (
    <button type="button" className="switch-text" onClick={onClick}>
      {prefix} <strong>{actionLabel}</strong>
    </button>
  );
};

export default SwitchText;