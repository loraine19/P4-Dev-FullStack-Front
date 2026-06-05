import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './views/pages/WelcomePage';
import MySpacePage from './views/pages/MySpacePage';
import UploadPage from './views/pages/UploadPage';
import DownloadPage from './views/pages/DownloadPage';
import ProtectedRoute from './views/components/routing/ProtectedRoute';
import ConfigPage from './views/components/routing/ConfigPage';
import UploadRoute from './views/components/routing/UploadRoute';
import useAuthStore from './stores/authStore';

/* APP ROUTES */
const AppRoutes = () => {
  const { pathname } = useLocation();

  /* VERIFY SESSION */
  useEffect(() => {
    if (pathname.startsWith('/download/')) {
      useAuthStore.getState().setInitialized();
      return;
    }
    void useAuthStore.getState().verifySession();
  }, [pathname]);

  return (
    <Routes>
      <Route element={<ConfigPage />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/download/:shareToken" element={<DownloadPage />} />
        <Route
          path="/upload"
          element={
            <UploadRoute>
              <UploadPage />
            </UploadRoute>
          }
        />
      </Route>

      <Route
        path="/my-space"
        element={
          <ProtectedRoute>
            <MySpacePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
