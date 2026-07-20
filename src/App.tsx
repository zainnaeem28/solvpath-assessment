import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/templates/AppShell";
import { OrdersPage } from "@/pages/OrdersPage";
import { ReturnFlowPage } from "@/pages/ReturnFlowPage";
import { ReturnSuccessPage } from "@/pages/ReturnSuccessPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/orders/:orderId/return" element={<ReturnFlowPage />} />
        <Route path="/returns/:returnId/success" element={<ReturnSuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
