import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import NotFound from './components/NotFound.jsx';
import LoginPage from './components/LoginPage.jsx';
import UserPage from './components/UserPage.jsx';
import withAuth from './components/withAuth.jsx';

const ProtectedUserPage = withAuth(UserPage);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProtectedUserPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
