import { Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = () => {
  const { isAuthenticatied } = useAuth();
    if (!isAuthenticatied) {
      return <div className="flex items-center justify-center mt-10 text-5xl font-bold">Please login.</div>
    }
  
    return <Outlet />
  };

export default ProtectedRoute;
