import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

import AuthPage from "../pages/auth/AuthPage";

import CartPage from "../pages/customer/CartPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import ProductDetailPage from "../pages/customer/ProductDetailPage";
import OrdersPage from "../pages/customer/OrdersPage";
import ProfilePage from "../pages/customer/ProfilePage";

import DashboardPage from "../pages/admin/DashboardPage";
import InventoryPage from "../pages/admin/InventoryPage";
import OrderManagerPage from "../pages/admin/OrderManagerPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";

import ContactPage from "@/pages/customer/ContactPage";
import HomePage from "../pages/customer/HomePage";
import CatalogPage from "@/pages/customer/CatalogPage";
import OrderDetailPage from "@/pages/customer/OrderDetailPage";

import AdminLayout from "@/components/admin/AdminLayout";
import ProductsPage from "@/pages/admin/ProductsPage";
import PaymentResultPage, {
  LegacyPaymentResultPage,
} from "@/pages/customer/PaymentResultPage";

const publicRoutes = (
  <>
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage />} />
  </>
);

const customerRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route
      path="/orders/:orderId/payment-result"
      element={<LegacyPaymentResultPage />}
    />
    <Route
      path="/payment-result/:paymentIntentId"
      element={<PaymentResultPage />}
    />
  </>
);

const adminRoutes = (
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/admin/dashboard" element={<DashboardPage />} />
    <Route path="/admin/products" element={<ProductsPage />} />
    <Route path="/admin/inventory" element={<InventoryPage />} />
    <Route path="/admin/orders" element={<OrderManagerPage />} />
    <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
  </Route>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {publicRoutes}

      <Route element={<ProtectedRoute allowedRoles={["customer", "admin"]} />}>
        {customerRoutes}
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        {adminRoutes}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
