import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';
import { RULES } from '../../../constants/validationRules';
import type { FieldValues } from '../../../utils/fieldValidation';
import Form from '../shared/forms/Form';
import SwitchText from '../shared/SwitchText';

type TRegisterField = 'name' | 'email' | 'password' | 'passwordConfirm';

const REGISTER_INPUTS = [
  { name: 'name' as TRegisterField,            label: 'Nom',                          type: 'text',     autoComplete: 'name',         rules: [RULES.required('Nom requis')] },
  { name: 'email' as TRegisterField,           label: 'Email',                        type: 'email',    autoComplete: 'email',        rules: [RULES.required('Email requis'), RULES.email('Format email invalide')] },
  { name: 'password' as TRegisterField,        label: 'Mot de passe',                 type: 'password', autoComplete: 'new-password', rules: [RULES.required('Mot de passe requis'), RULES.minLen(8, '8 caractères min.')] },
  { name: 'passwordConfirm' as TRegisterField, label: 'Vérification du mot de passe', type: 'password', autoComplete: 'new-password', rules: [RULES.required('Confirmation requise'), RULES.matches('password', 'Les mots de passe ne correspondent pas')] },
];

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
