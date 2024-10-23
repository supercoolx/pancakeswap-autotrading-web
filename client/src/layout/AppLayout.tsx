import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className=''>
      <Header />
      <main className='container mx-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
