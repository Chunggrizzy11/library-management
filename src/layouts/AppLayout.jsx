import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menu, userMenu } from '../constants/navigation';
import { today } from '../utils/format';
import { loanStatus } from '../utils/library';

function initials(name) {
  return (name || 'User').trim().split(/\s+/).slice(-2).map(part => part[0]?.toUpperCase()).join('');
}

export default function AppLayout({ loans, error, reload, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const activeMenu = user.role === 'admin' ? menu : userMenu;
  const title = activeMenu.find(item => item.path === location.pathname)?.title || 'Tổng quan';

  const signOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brand-mark"><i className="bi bi-book-half" /></div>
        <div><strong>Libra<span>Space</span></strong><small>LIBRARY MANAGEMENT</small></div>
      </Link>
      <div className="sidebar-label">KHÔNG GIAN LÀM VIỆC</div>
      <nav className="side-nav">
        {activeMenu.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className={`bi bi-${item.icon}`} />
          <span>{item.title}</span>
          {item.path === '/loans' && loans.some(loan => loanStatus(loan, today()) === 'late') && <span className="nav-notice" />}
        </NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile">
          <div className="profile-avatar">{initials(user.name)}</div>
          <div><strong>{user.name}</strong><small>{user.role === 'admin' ? 'Quản trị viên' : 'Độc giả'}</small></div>
          <button aria-label="Đăng xuất" title="Đăng xuất" className="logout-icon" onClick={signOut}><i className="bi bi-box-arrow-right" /></button>
        </div>
      </div>
    </aside>

    <div className="main-area">
      <header className="topbar">
        <div className="breadcrumb"><span>Thư viện</span><i className="bi bi-chevron-right" /><b>{title}</b></div>
        <div className="topbar-right">
          <span className="today"><i className="bi bi-calendar3" /> {new Date().toLocaleDateString('vi-VN')}</span>
          <span className="top-avatar" title={user.name}>{initials(user.name)}</span>
          <button type="button" className="header-logout" onClick={signOut}><i className="bi bi-box-arrow-right" /> Đăng xuất</button>
        </div>
      </header>
      <main className="content">
        {error && <div className="alert alert-danger d-flex align-items-center justify-content-between"><span><i className="bi bi-exclamation-triangle me-2" />{error}</span><button className="btn btn-sm btn-outline-danger" onClick={reload}>Thử lại</button></div>}
        {children}
      </main>
      <footer className="footer">© 2026 LibraSpace <span>Built with React · Vite · JSON Server</span></footer>
    </div>
  </div>;
}
