import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateRegistration } from './authUtils';
import AuthLayout from './AuthLayout';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const change = key => event => setForm(previous => ({ ...previous, [key]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    const validation = validateRegistration(form);
    if (validation) { setError(validation); return; }
    setError(''); setBusy(true);
    try { await register(form); navigate('/', { replace: true }); }
    catch (err) { setError(err.message || 'Đăng ký thất bại'); }
    finally { setBusy(false); }
  };

  return <AuthLayout title="Tạo tài khoản mới" description="Bắt đầu sử dụng hệ thống quản lý thư viện" footer={<>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></>}>
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="auth-error" role="alert"><i className="bi bi-exclamation-circle" /> {error}</div>}
      <label className="field">Họ và tên<input autoComplete="name" className="form-control" required placeholder="Nguyễn Văn A" value={form.name} onChange={change('name')} /></label>
      <label className="field">Địa chỉ email<input autoComplete="email" className="form-control" required type="email" placeholder="name@example.com" value={form.email} onChange={change('email')} /></label>
      <label className="field">Mật khẩu (ít nhất 8 ký tự)<div className="password-wrap"><input autoComplete="new-password" className="form-control" required minLength="8" type={visible ? 'text' : 'password'} placeholder="Tạo mật khẩu" value={form.password} onChange={change('password')} /><button aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} type="button" onClick={() => setVisible(!visible)}><i className={`bi bi-eye${visible ? '-slash' : ''}`} /></button></div></label>
      <label className="field">Nhập lại mật khẩu<input autoComplete="new-password" className="form-control" required type="password" placeholder="Xác nhận mật khẩu" value={form.confirmPassword} onChange={change('confirmPassword')} /></label>
      <button className="btn btn-primary-main auth-submit" disabled={busy} type="submit">{busy ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'} <i className="bi bi-arrow-right" /></button>
    </form>
  </AuthLayout>;
}
