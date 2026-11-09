import { Link } from 'react-router-dom';

export default function AuthLayout({ title, description, children, footer }) {
  return <div className="auth-screen">
    <div className="auth-side">
      <Link to="/" className="auth-brand"><i className="bi bi-book-half" /><span>Libra<strong>Space</strong></span></Link>
      <div className="auth-side-content"><div className="auth-decor"><i className="bi bi-journals" /></div><div className="auth-label">LIBRARY MANAGEMENT SYSTEM</div><h1>Quản lý tri thức,<br />kết nối tương lai.</h1><p>Một không gian quản trị thư viện trực quan, hiện đại và dễ sử dụng.</p><div className="auth-benefits"><span><i className="bi bi-check-circle" /> Quản lý sách và độc giả</span><span><i className="bi bi-check-circle" /> Theo dõi mượn trả</span><span><i className="bi bi-check-circle" /> Thống kê theo thời gian thực</span></div></div>
      <div className="auth-side-footer">© 2026 LibraSpace · React Learning Project</div>
    </div>
    <div className="auth-main"><div className="auth-card"><div className="auth-mobile-brand"><i className="bi bi-book-half" /> LibraSpace</div><div className="auth-icon"><i className="bi bi-person-lock" /></div><h2>{title}</h2><p className="auth-description">{description}</p>{children}<div className="auth-card-footer">{footer}</div></div></div>
  </div>;
}
