import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { UsuariosPage } from "@/features/usuarios/components/UsuariosPage";

export function RotasApp() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/usuarios" element={<UsuariosPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
