import React from 'react';
import Layout from './components/Layout';
import { useAppStore } from './store/useAppStore';

import IntegrationsPage from './pages/IntegrationsPage';
import StoriesPage from './pages/StoriesPage';
import TestPlansPage from './pages/TestPlansPage';
import TestCasesPage from './pages/TestCasesPage';
import CodeGenPage from './pages/CodeGenPage';
import AuthScreen from './components/AuthScreen';

export default function App() {
  const { session, currentPage } = useAppStore();

  if (session === 'unauthenticated') {
    return <AuthScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'integrations': return <IntegrationsPage />;
      case 'stories': return <StoriesPage />;
      case 'plans': return <TestPlansPage />;
      case 'cases': return <TestCasesPage />;
      case 'code': return <CodeGenPage />;
      default: return <IntegrationsPage />;
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto p-6 z-10 relative">
        {renderPage()}
      </div>
    </Layout>
  );
}
