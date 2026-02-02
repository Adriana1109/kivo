import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading para código splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Materias = lazy(() => import('./pages/Materias'));
const Calendario = lazy(() => import('./pages/Calendario'));
const Apuntes = lazy(() => import('./pages/Apuntes'));
const Chatbot = lazy(() => import('./pages/Chatbot'));

// Loader consistente con el diseño
const Loader = () => (
  <div className="route-loader">
    <LoadingSpinner size="lg" text="Cargando..." />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Login - Sin Layout ni protección */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas con Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Home - Dashboard con estadísticas */}
          <Route path="/" element={<Home />} />
          
          {/* Gestión de Materias */}
          <Route path="/materias" element={<Materias />} />
          
          {/* Calendario Dinámico */}
          <Route path="/calendario" element={<Calendario />} />
          
          {/* Apuntes */}
          <Route path="/apuntes" element={<Apuntes />} />
          
          {/* Chatbot Académico */}
          <Route path="/chatbot" element={<Chatbot />} />
          
          {/* Fallback - redirigir a inicio */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
