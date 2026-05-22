import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';
import { RULES } from '../../../constants/validationRules';
import type { FieldValues } from '../../../utils/fieldValidation';
import Form from '../shared/forms/Form';
import SwitchText from '../shared/SwitchText';

type TLoginField = 'email' | 'password';

const LOGIN_INPUTS = [
  { name: 'email' as TLoginField,    label: 'Email',          type: 'email',    autoComplete: 'email',            rules: [RULES.required('Email requis'), RULES.email('Format email invalide')] },
  { name: 'password' as TLoginField, label: 'Mot de passe',   type: 'password', autoComplete: 'current-password', rules: [RULES.required('Mot de passe requis')] },
];

/* LOGIN FORM PROPS */
interface ILoginFormProps {
  onSwitch: () => void;
}

/* LOGIN FORM */
const LoginForm = ({ onSwitch }: ILoginFormProps) => {
  const navigate = useNavigate();
  const { error, isLoading, login } = useAuthStore(
    useShallow((s) => ({ error: s.error, isLoading: s.isLoading, login: s.login })),
  );

  /* HANDLE SUBMIT */
  const handleSubmit = async (values: FieldValues<TLoginField>) => {
    const success = await login({ email: values.email, password: values.password });
    if (success) navigate('/my-space');
  };

  return (
    <Form
      id="login"
      title="Connexion"
      inputs={LOGIN_INPUTS}
      onSubmit={handleSubmit}
      submitLabel="Connexion"
      loading={isLoading}
      error={error?.message}
      footer={<SwitchText prefix="Pas de compte ?" actionLabel="Créer un compte" onClick={onSwitch} />}
    />
  );
};

export default LoginForm;
