import { useNavigate } from 'react-router-dom';
import { useAuthStoreShallow } from '../../../stores/authStore';
import { LOGIN_INPUTS, type TLoginField } from '../../../constants/formConfigs';
import type { FieldValues } from '../../../utils/fieldValidation';
import Form from '../shared/forms/Form';
import SwitchText from '../shared/SwitchText';

/* LOGIN FORM PROPS */
interface LoginFormProps {
  onSwitch: () => void;
}

/* LOGIN FORM */
const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const navigate = useNavigate();
  const { error, isLoading, login } = useAuthStoreShallow((s) => ({
    error: s.error,
    isLoading: s.isLoading,
    login: s.login,
  }));

  /* HANDLE SUBMIT */
  const handleSubmit = async ({ email, password }: FieldValues<TLoginField>) => {
    const success = await login({ email, password });
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
