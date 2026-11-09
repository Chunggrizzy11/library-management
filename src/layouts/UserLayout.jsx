import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLayout({ categories = [], children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/', { replace: true }); };
  return <div className="student-layout">
    <header className="student-top"><div className="student-container student-top-inner"><Link to="/" className="student-logo"><i className="bi bi-book-half" /> LibraSpace</Link><div className="student-search"><i className="bi bi-search" /><span>Tìm kiếm sách, tác giả...</span></div><div className="student-account"><span><i className="bi bi-person-circle" /> {user.name}</span><button onClick={signOut}>Đăng xuất</button></div></div></header>
    <div className="student-nav"><div className="student-container"><NavLink to="/" end className={location.pathname === '/' ? 'selected' : ''}>Trang chủ</NavLink><NavLink to="/catalog">Tra cứu sách</NavLink><NavLink to="/my-loans">Sách của tôi</NavLink><NavLink to="/profile">Hồ sơ cá nhân</NavLink></div></div>
    <div className="student-container student-body"><aside className="student-sidebar"><h3><i className="bi bi-list" /> DANH MỤC SÁCH</h3>{categories.map(category => <Link to={`/catalog?category=${category.id}`} key={category.id}>{category.name}</Link>)}<div className="student-help"><i className="bi bi-info-circle" /> <b>Thư viện LibraSpace</b><small>Đọc sách mỗi ngày</small></div></aside><main className="student-main">{children}</main></div>
  </div>;
}
