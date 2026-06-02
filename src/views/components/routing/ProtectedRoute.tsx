import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useAuthStore from '../../../stores/authStore';

/* PROTECTED ROUTE PROPS */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/* PROTECTED ROUTE */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuthStore(
    useShallow((s) => ({ isAuthenticated: s.isAuthenticated, isInitialized: s.isInitialized })),
  );
  // wait for verifySession() to complete before deciding to redirect
  if (!isInitialized) return null;
  // replace prevents back-button loops on protected routes
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
