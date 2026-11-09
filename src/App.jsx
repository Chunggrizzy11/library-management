import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import UserLayout from './layouts/UserLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import BooksPage from './features/books/BooksPage';
import ReadersPage from './features/readers/ReadersPage';
import LoansPage from './features/loans/LoansPage';
import CategoriesPage from './features/categories/CategoriesPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProfilePage from './features/profile/ProfilePage';
import AccountsPage from './features/accounts/AccountsPage';
import { UserHome, UserCatalog, UserLoans } from './features/user';
import BookDetailPage from './features/user/BookDetailPage';
import PublicHomePage from './features/public/PublicHomePage';

function ProtectedArea() {
  const { user, checking } = useAuth();
  const location = useLocation();
  if (checking) return <div className="loading">Đang kiểm tra tài khoản...</div>;
  if (!user) return location.pathname === '/' ? <PublicHomePage /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <LibraryProvider><LibraryRoutes /></LibraryProvider>;
}

function LibraryRoutes() {
  const { data, loading, error, reload, busy, create, update, remove } = useLibrary();
  const { user, updateProfile, changePassword } = useAuth();
  const admin = user.role === 'admin';
  const userProps = { ...data, user, create, update };
  if (!admin) return <UserLayout categories={data.categories}>{loading ? <div className="loading">Đang tải dữ liệu...</div> : <Routes>
    <Route path="/" element={<UserHome {...userProps} />} />
    <Route path="/profile" element={<ProfilePage user={user} onUpdate={updateProfile} onChangePassword={({ currentPassword, newPassword, confirmPassword }) => changePassword(currentPassword, newPassword, confirmPassword)} />} />
    <Route path="/catalog" element={<UserCatalog {...userProps} />} />
    <Route path="/catalog/:bookId" element={<BookDetailPage {...userProps} />} />
    <Route path="/my-loans" element={<UserLoans {...userProps} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>}</UserLayout>;
  return <AppLayout loans={data.loans} error={error} reload={reload}>
    {loading ? <div className="loading">Đang tải dữ liệu...</div> : <Routes>
      <Route path="/" element={admin ? <DashboardPage {...data} /> : <UserHome {...userProps} />} />
      <Route path="/profile" element={<ProfilePage user={user} onUpdate={updateProfile} onChangePassword={({ currentPassword, newPassword, confirmPassword }) => changePassword(currentPassword, newPassword, confirmPassword)} />} />
      <>
        <Route path="/books" element={<BooksPage {...data} onCreate={create} onUpdate={update} onDelete={remove} busy={busy} />} />
        <Route path="/readers" element={<ReadersPage {...data} onCreate={create} onUpdate={update} onDelete={remove} busy={busy} />} />
        <Route path="/loans" element={<LoansPage {...data} onCreate={create} onUpdate={update} busy={busy} />} />
        <Route path="/categories" element={<CategoriesPage {...data} onCreate={create} onDelete={remove} busy={busy} />} />
        <Route path="/accounts" element={<AccountsPage user={user} />} />
      </>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>}
  </AppLayout>;
}

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/*" element={<ProtectedArea />} />
  </Routes></AuthProvider>;
}
