import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';
import { FieldValidator } from '../../../utils/fieldValidation';
import type { TFieldErrors } from '../../../utils/fieldValidation';
import { validateRegisterField, type TRegisterField } from '../../../utils/authValidation';
import InputField from '../shared/InputField';
import Button from '../shared/Button';
import SwitchText from '../shared/SwitchText';

const registerValidator = new FieldValidator<TRegisterField>(validateRegisterField);

/* REGISTER FORM PROPS */
interface IRegisterFormProps {
  onSwitch: () => void;
}

/* REGISTER FORM */
const RegisterForm = ({ onSwitch }: IRegisterFormProps) => {
  const { clearError, error, isLoading, register } = useAuthStore(
    useShallow((s) => ({ clearError: s.clearError, error: s.error, isLoading: s.isLoading, register: s.register })),
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<TFieldErrors<TRegisterField>>({});

  /* HANDLE FIELD CHANGE */
  const handleChange = (field: TRegisterField, setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    clearError();
  };

  /* HANDLE FIELD BLUR */
  const handleBlur = (field: TRegisterField, value: string) => {
    const err = registerValidator.validateOne(field, value, { name, email, password, passwordConfirm });
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  /* HANDLE SUBMIT */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = registerValidator.validateAll({ name, email, password, passwordConfirm });
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    const success = await register({ name, email, password });
    if (success) onSwitch();
  };

  return (
    <section className="card" aria-label="Formulaire d'inscription">
      <h2 className="card-title">Créer un compte</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <InputField
          id="register-name"
          label="Nom"
          type="text"
          autoComplete="name"
          value={name}
          onChange={handleChange('name', setName)}
          onBlur={(event) => handleBlur('name', event.target.value)}
          disabled={isLoading}
          error={fieldErrors.name}
        />
        <InputField
          id="register-email"
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
          id="register-password"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={handleChange('password', setPassword)}
          onBlur={(event) => handleBlur('password', event.target.value)}
          disabled={isLoading}
          error={fieldErrors.password}
        />
        <InputField
          id="register-password-confirm"
          label="Vérification du mot de passe"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={handleChange('passwordConfirm', setPasswordConfirm)}
          onBlur={(event) => handleBlur('passwordConfirm', event.target.value)}
          disabled={isLoading}
          error={fieldErrors.passwordConfirm}
        />
        {error ? <div className="callout callout-error" role="alert">{error.message}</div> : null}
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Inscription...' : 'Créer un compte'}
        </Button>
      </form>
      <SwitchText prefix="Déjà un compte ?" actionLabel="Connexion" onClick={onSwitch} />
    </section>
  );
};

export default RegisterForm;
