import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './layout/ProtectedRoute';
import AuthProvider from './providers/AuthProvider';
import Home from './pages/Home';
import TradingView from './pages/TradingView';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Loader from './layout/Loader';
import AppLayout from './layout/AppLayout';
import Error from './layout/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/sign-in',
        element: <Signin />,
      },
      {
        path: '/sign-up',
        element: <Signup />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/trading-view',
            element: <TradingView />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },

        ]
      }
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </AuthProvider>
  )
}

export default App;
