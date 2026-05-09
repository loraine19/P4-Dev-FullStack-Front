import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './views/pages/WelcomePage';
import MySpacePage from './views/pages/MySpacePage';
import UploadPage from './views/pages/UploadPage';
import DownloadPage from './views/pages/DownloadPage';
import ProtectedRoute from './views/components/shared/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/download/:shareToken" element={<DownloadPage />} />
        <Route
          path="/my-space"
          element={
            <ProtectedRoute>
              <MySpacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
