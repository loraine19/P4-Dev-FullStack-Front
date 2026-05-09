import { Navigate } from 'react-router-dom';

// ProtectedRoute — redirige vers / si l'utilisateur n'est pas authentifié
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: lire le token depuis authStore
  const isAuthenticated = false;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
