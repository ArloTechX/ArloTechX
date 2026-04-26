import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackgroundEffects from '../components/layout/BackgroundEffects';

const MainLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <BackgroundEffects />
      <div className="relative z-10">
        <Navbar />
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
