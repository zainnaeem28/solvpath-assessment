import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/templates/AppShell";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { ReturnQueueSync } from "@/features/returns/components/ReturnQueueSync";
import { LoginPage } from "@/pages/LoginPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ReturnFlowPage } from "@/pages/ReturnFlowPage";
import { ReturnSuccessPage } from "@/pages/ReturnSuccessPage";

export default function App() {
  return (
    <AppShell>
      <ReturnQueueSync />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders/:orderId/return"
          element={
            <RequireAuth>
              <ReturnFlowPage />
            </RequireAuth>
          }
        />
        <Route
          path="/returns/:returnId/success"
          element={
            <RequireAuth>
              <ReturnSuccessPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppShell>
  );
}
