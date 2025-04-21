
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
