import type { ErrorMsg } from '../../../types/error.types';

/* CALLOUT VARIANT */
type TCalloutVariant = 'info' | 'success' | 'error' | 'warning';

/* CALLOUT PROPS */
interface ICalloutProps {
  variant?: TCalloutVariant;
  message?: string;
  error?: ErrorMsg;
}

/* CALLOUT */
const Callout = ({ variant = 'info', message, error }: ICalloutProps) => {
  if (!message && !error) return null;

  const displayMessage = error ? error.message : message;
  const displayVariant = error ? (error.level === 'warning' ? 'warning' : error.level === 'info' ? 'info' : 'error') : variant;
  const icon = displayVariant === 'success' ? '✓' : displayVariant === 'error' ? '⚠' : displayVariant === 'warning' ? '!' : 'ℹ';

  return (
    <p className={`callout callout-${displayVariant}`}>
      <span className="callout-icon">{icon}</span>
      {displayMessage}
    </p>
  );
};

export default Callout;