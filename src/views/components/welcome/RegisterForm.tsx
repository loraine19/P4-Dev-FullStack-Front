import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';
import { REGISTER_INPUTS, type TRegisterField } from '../../../constants/formConfigs';
import type { FieldValues } from '../../../utils/fieldValidation';
import Form from '../shared/forms/Form';
import SwitchText from '../shared/SwitchText';


/* REGISTER FORM PROPS */
interface IRegisterFormProps {
  onSwitch: () => void;
}

/* REGISTER FORM */
const RegisterForm = ({ onSwitch }: IRegisterFormProps) => {
  const { error, isLoading, register } = useAuthStore(
    useShallow((s) => ({ error: s.error, isLoading: s.isLoading, register: s.register })),
  );

  /* HANDLE SUBMIT */
  const handleSubmit = async (values: FieldValues<TRegisterField>) => {
    const success = await register({ name: values.name, email: values.email, password: values.password });
    if (success) onSwitch();
  };

  return (
    <Form
      id="register"
      title="Créer un compte"
      inputs={REGISTER_INPUTS}
      onSubmit={handleSubmit}
      submitLabel="Créer un compte"
      loading={isLoading}
      error={error?.message}
      footer={<SwitchText prefix="Déjà un compte ?" actionLabel="Connexion" onClick={onSwitch} />}
    />
  );
};

export default RegisterForm;
