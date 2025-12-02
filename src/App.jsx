import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/ui/toaster';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ClientAreaPage from '@/pages/ClientArea Page';
import ServicesPage from '@/pages/ServicesPage';
import OrderPage from '@/pages/OrderPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminPromosPage from '@/pages/admin/AdminPromosPage';
import AdminPlansPage from '@/pages/admin/AdminPlansPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminManagerPage from '@/pages/admin/AdminManagerPage';
import { MousePositionProvider } from '@/hooks/useMousePosition.jsx';

import { CartProvider } from '@/context/CartContext';
import CartPage from '@/pages/CartPage';

const App = () => {
  return (
    <Router>
      <MousePositionProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected User Routes */}
              <Route path="/client-area" element={
                <ProtectedRoute>
                  <ClientAreaPage />
                </ProtectedRoute>
              } />
              <Route path="/order/:planId" element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              } />
              <Route path="/admin/manager" element={
                <AdminRoute>
                  <AdminManagerPage />
                </AdminRoute>
              } />
              <Route path="/admin/promos" element={
                <AdminRoute>
                  <AdminPromosPage />
                </AdminRoute>
              } />
              <Route path="/admin/plans" element={
                <AdminRoute>
                  <AdminPlansPage />
                </AdminRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminRoute>
                  <AdminCategoriesPage />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              } />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </CartProvider>
      </MousePositionProvider>
    </Router>
  );
};

export default App;