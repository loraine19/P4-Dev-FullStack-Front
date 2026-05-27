import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';
import useAuthStore from '../../../stores/authStore';

/* CONFIG PAGE PROPS */
interface IConfigPageProps {
  ctaLabel?: string;
  ctaPath?: string;
}

/* CONFIG PAGE */
const ConfigPage = ({ ctaLabel, ctaPath }: IConfigPageProps) => {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const resolvedCtaLabel = ctaLabel ?? (pathname === '/' ? (isAuthenticated ? 'Mon espace' : 'Se connecter') : (isAuthenticated ? 'Mon espace' : 'Retour accueil'));
  const resolvedCtaPath = ctaPath ?? (pathname === '/' ? (isAuthenticated ? '/my-space' : '/?auth=login') : (isAuthenticated ? '/my-space' : '/'));

  return (
    <>
      <Navbar ctaLabel={resolvedCtaLabel} ctaPath={resolvedCtaPath} />
      <Outlet />
      <Footer />
    </>
  );
};

export default ConfigPage;
