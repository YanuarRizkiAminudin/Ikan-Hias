import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from '@/context/AdminContext'
import { AdminRoute } from '@/routes/AdminRoute'

import Home          from '@/pages/public/Home'
import Catalog       from '@/pages/public/Catalog'
import ProductDetail from '@/pages/public/ProductDetail'
import Export        from '@/pages/public/Export'
import About         from '@/pages/public/About'
import Contact       from '@/pages/public/Contact'

import AdminLogin    from '@/pages/admin/AdminLogin'
import Dashboard     from '@/pages/admin/Dashboard'
import Products      from '@/pages/admin/Products'
import ProductForm   from '@/pages/admin/ProductForm'
import Categories    from '@/pages/admin/Categories'
import Inquiries     from '@/pages/admin/Inquiries'
import StoreSettings from '@/pages/admin/StoreSettings'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Home />} />
          <Route path="/catalog"        element={<Catalog />} />
          <Route path="/product/:slug"  element={<ProductDetail />} />
          <Route path="/export"         element={<Export />} />
          <Route path="/about"          element={<About />} />
          <Route path="/contact"        element={<Contact />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected */}
          <Route path="/admin" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><Products /></AdminRoute>
          } />
          <Route path="/admin/products/create" element={
            <AdminRoute><ProductForm /></AdminRoute>
          } />
          <Route path="/admin/products/:id/edit" element={
            <AdminRoute><ProductForm /></AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute><Categories /></AdminRoute>
          } />
          <Route path="/admin/inquiries" element={
            <AdminRoute><Inquiries /></AdminRoute>
          } />
          <Route path="/admin/store" element={
            <AdminRoute><StoreSettings /></AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  )
}
