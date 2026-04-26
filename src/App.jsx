import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ContactPage from './pages/ContactPage';
import TeamPage from './pages/TeamPage';
import PaymentPage from './pages/PaymentPage';
import PublicProjectsPage from './pages/public/Projects';
import ClientsPage from './pages/ClientsPage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProjectsPage from './pages/admin/Projects';
import AdminServicesPage from './pages/admin/ServicesManagementPage';
import AdminTeamPage from './pages/admin/TeamManagementPage';
import PaymentSettingsPage from './pages/admin/PaymentSettingsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import DocumentPreview from './pages/admin/DocumentPreview';
import NotFoundPage from './pages/NotFoundPage';
import useScrollToTop from './hooks/useScrollToTop';

const App = () => {
  useScrollToTop();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        <Route path="/projects" element={<PublicProjectsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="documents/:type/:clientId" element={<DocumentPreview />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="payment-settings" element={<PaymentSettingsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
