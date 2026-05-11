import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';
import { FieldValidator } from '../../../utils/fieldValidation';
import type { TFieldErrors } from '../../../utils/fieldValidation';
import { validateLoginField, type TLoginField } from '../../../utils/authValidation';
import InputField from '../shared/InputField';
import Button from '../shared/Button';
import SwitchText from '../shared/SwitchText';

const loginValidator = new FieldValidator<TLoginField>(validateLoginField);

/* LOGIN FORM PROPS */
interface ILoginFormProps {
  onSwitch: () => void;
}

/* LOGIN FORM */
const LoginForm = ({ onSwitch }: ILoginFormProps) => {
  const navigate = useNavigate();
  const { clearError, error, isLoading, login } = useAuthStore(
    useShallow((s) => ({ clearError: s.clearError, error: s.error, isLoading: s.isLoading, login: s.login })),
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<TFieldErrors<TLoginField>>({});

  /* HANDLE FIELD CHANGE */
  const handleChange = (field: TLoginField, setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    clearError();
  };

  /* HANDLE FIELD BLUR */
  const handleBlur = (field: TLoginField, value: string) => {
    const err = loginValidator.validateOne(field, value, { email, password });
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  /* HANDLE SUBMIT */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = loginValidator.validateAll({ email, password });
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    const success = await login({ email, password });
    if (success) navigate('/my-space');
  };

  return (
    <section className="card" aria-label="Formulaire de connexion">
      <h2 className="card-title">Connexion</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <InputField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleChange('email', setEmail)}
          onBlur={(event) => handleBlur('email', event.target.value)}
          disabled={isLoading}
          error={fieldErrors.email}
        />
        <InputField
          id="login-password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChange('password', setPassword)}
          onBlur={(event) => handleBlur('password', event.target.value)}
          disabled={isLoading}
          error={fieldErrors.password}
        />
        {error ? <div className="callout callout-error" role="alert">{error.message}</div> : null}
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Connexion'}
        </Button>
      </form>
      <SwitchText prefix="Pas de compte ?" actionLabel="Créer un compte" onClick={onSwitch} />
    </section>
  );
};

export default LoginForm;
