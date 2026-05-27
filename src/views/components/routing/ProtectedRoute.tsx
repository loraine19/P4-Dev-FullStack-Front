import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';

// ProtectedRoute -  redirige vers / si l'utilisateur n'est pas authentifié
const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
