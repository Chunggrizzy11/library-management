import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async event => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message || 'Đăng nhập thất bại'); }
    finally { setBusy(false); }
  };

  return <AuthLayout title="Chào mừng trở lại" description="Đăng nhập để tiếp tục quản lý thư viện của bạn" footer={<>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></>}>
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="auth-error" role="alert"><i className="bi bi-exclamation-circle" /> {error}</div>}
      <label className="field">Địa chỉ email<input autoComplete="email" className="form-control" type="email" placeholder="name@example.com" required value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label className="field">Mật khẩu<div className="password-wrap"><input autoComplete="current-password" className="form-control" type={visible ? 'text' : 'password'} placeholder="Nhập mật khẩu" required value={password} onChange={event => setPassword(event.target.value)} /><button type="button" aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setVisible(!visible)}><i className={`bi bi-eye${visible ? '-slash' : ''}`} /></button></div></label>
      <button className="btn btn-primary-main auth-submit" disabled={busy} type="submit">{busy ? 'Đang đăng nhập...' : 'Đăng nhập'} <i className="bi bi-arrow-right" /></button>
    </form>
    <p className="auth-hint">Chưa có tài khoản mẫu? Hãy chọn “Đăng ký ngay” để tạo tài khoản thử nghiệm.</p>
  </AuthLayout>;
}
