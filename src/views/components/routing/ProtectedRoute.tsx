import { Navigate } from 'react-router-dom';
import { useAuthStoreShallow } from '../../../stores/authStore';

/* PROTECTED ROUTE PROPS */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/* PROTECTED ROUTE */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuthStoreShallow((s) => ({
    isAuthenticated: s.isAuthenticated,
    isInitialized: s.isInitialized,
  }));
  // wait for verifySession() to complete before deciding to redirect
  if (!isInitialized) return null;
  // replace prevents back-button loops on protected routes
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
