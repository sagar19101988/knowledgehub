import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import OnboardingWizard from './components/auth/OnboardingWizard';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import AgentDetails from './pages/AgentDetails';
import DeveloperView from './pages/DeveloperView';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isConnected = useAuthStore((state) => state.isConnected);
  if (!isConnected) {
    return <Navigate to="/connect" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/connect" element={<OnboardingWizard />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="agent" element={<AgentDetails />} />
          <Route path="developer" element={<DeveloperView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
