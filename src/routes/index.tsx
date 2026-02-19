import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { Dashboard } from '../pages/Dashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pai com o Layout Principal */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Rota Index (Home) renderiza o Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Adicione outras rotas aqui no futuro, exemplo: */}
          {/* <Route path="users" element={<UsersPage />} /> */}
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};