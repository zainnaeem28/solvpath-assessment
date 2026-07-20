import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/templates/AppShell";
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
        <Route path="/" element={<OrdersPage />} />
        <Route path="/orders/:orderId/return" element={<ReturnFlowPage />} />
        <Route path="/returns/:returnId/success" element={<ReturnSuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
