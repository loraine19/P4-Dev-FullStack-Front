import { useSearchParams } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import UploadCall from '../components/shared/UploadCall';
import LoginForm from '../components/welcome/LoginForm';
import RegisterForm from '../components/welcome/RegisterForm';

/* WELCOME PAGE */
const WelcomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const clearError = useAuthStore((state) => state.clearError);
  const authMode = searchParams.get('auth');

  /* OPEN LOGIN FLOW */
  const handleOpenLogin = () => {
    clearError();
    setSearchParams({ auth: 'login' });
  };

  /* OPEN REGISTER FLOW */
  const handleOpenRegister = () => {
    clearError();
    setSearchParams({ auth: 'register' });
  };

  return (
    <main className="clear-page">
      <section className="stack-center">
        {!authMode ? <UploadCall /> : null}
        {authMode === 'login' ? <LoginForm onSwitch={handleOpenRegister} /> : null}
        {authMode === 'register' ? <RegisterForm onSwitch={handleOpenLogin} /> : null}
      </section>
    </main>
  );
};

export default WelcomePage;
