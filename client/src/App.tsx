import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ScoresPage } from "./pages/ScoresPage";
import { CharityPage } from "./pages/CharityPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { DrawsPage } from "./pages/DrawsPage";
import { DrawDetailsPage } from "./pages/DrawDetailsPage";
import { WinningsPage } from "./pages/WinningsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/admin/AdminPage";
import { LandingPage } from "./pages/LandingPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/charity" element={<CharityPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/draws" element={<DrawsPage />} />
          <Route path="/draws/:id" element={<DrawDetailsPage />} />
          <Route path="/winnings" element={<WinningsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
