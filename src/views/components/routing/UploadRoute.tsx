import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';

/* UPLOAD ROUTE PROPS */
interface IUploadRouteProps {
  children: React.ReactNode;
}

/* UPLOAD ROUTE */
// allows access if user is authenticated OR anonymous upload is enabled
const UploadRoute = ({ children }: IUploadRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const allowedWithoutAuth = import.meta.env.VITE_ANONYMOUS_UPLOAD === 'true';

  return (isAuthenticated || allowedWithoutAuth) ? <>{children}</> : <Navigate to="/" replace />;
};

export default UploadRoute;

