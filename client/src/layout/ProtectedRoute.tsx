import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = () => {
  const { isAuthenticatied } = useAuth();
    if (!isAuthenticatied) {
      return <Navigate to="/sign-in" replace />;
    }
  
    return <Outlet />
  };

export default ProtectedRoute;
