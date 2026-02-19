import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { Usuarios } from '../pages/Usuarios';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
