import { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { normalizeEmail } from '../auth/authUtils';

export default function ProfilePage({ user, onUpdate, onChangePassword }) {
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => { setProfile({ name: user?.name || '', email: user?.email || '' }); }, [user?.id, user?.name, user?.email]);

  async function saveProfile(event) {
    event.preventDefault();
    const name = profile.name.trim();
    const email = normalizeEmail(profile.email);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileMessage({ error: true, text: 'Vui lòng nhập họ tên và email hợp lệ.' }); return;
    }
    setProfileMessage(null); setSavingProfile(true);
    try {
      await onUpdate({ name, email });
      setProfileMessage({ text: 'Đã cập nhật hồ sơ.' });
    } catch (error) { setProfileMessage({ error: true, text: error?.message || 'Không thể cập nhật hồ sơ.' }); }
    finally { setSavingProfile(false); }
  }

  async function savePassword(event) {
    event.preventDefault();
    if (!password.currentPassword) { setPasswordMessage({ error: true, text: 'Vui lòng nhập mật khẩu hiện tại.' }); return; }
    if (password.newPassword.length < 8) { setPasswordMessage({ error: true, text: 'Mật khẩu mới phải có ít nhất 8 ký tự.' }); return; }
    if (password.newPassword !== password.confirmPassword) { setPasswordMessage({ error: true, text: 'Mật khẩu xác nhận không khớp.' }); return; }
    setPasswordMessage(null); setSavingPassword(true);
    try {
      await onChangePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword, confirmPassword: password.confirmPassword });
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage({ text: 'Đã đổi mật khẩu.' });
    } catch (error) { setPasswordMessage({ error: true, text: error?.message || 'Không thể đổi mật khẩu.' }); }
    finally { setSavingPassword(false); }
  }

  return <>
    <SectionHeader kicker="TÀI KHOẢN" title="Hồ sơ cá nhân" desc="Cập nhật thông tin và mật khẩu của bạn" />
    <div className="category-layout">
      <section className="panel category-create">
        <h3>Thông tin cá nhân</h3><p>Quản lý tên và địa chỉ email</p>
        <form className="auth-form" onSubmit={saveProfile}>
          {profileMessage && <div className={profileMessage.error ? 'auth-error' : 'alert alert-success'} role={profileMessage.error ? 'alert' : 'status'}>{profileMessage.text}</div>}
          <label className="field">Họ và tên<input className="form-control" autoComplete="name" required value={profile.name} onChange={event => setProfile({ ...profile, name: event.target.value })} /></label>
          <label className="field">Email<input className="form-control" type="email" autoComplete="email" required value={profile.email} onChange={event => setProfile({ ...profile, email: event.target.value })} /></label>
          <button className="btn btn-primary-main" disabled={savingProfile} type="submit">{savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </form>
      </section>
      <section className="panel category-create">
        <h3>Đổi mật khẩu</h3><p>Mật khẩu mới cần ít nhất 8 ký tự</p>
        <form className="auth-form" onSubmit={savePassword}>
          {passwordMessage && <div className={passwordMessage.error ? 'auth-error' : 'alert alert-success'} role={passwordMessage.error ? 'alert' : 'status'}>{passwordMessage.text}</div>}
          <label className="field">Mật khẩu hiện tại<input className="form-control" type="password" autoComplete="current-password" required value={password.currentPassword} onChange={event => setPassword({ ...password, currentPassword: event.target.value })} /></label>
          <label className="field">Mật khẩu mới<input className="form-control" type="password" autoComplete="new-password" required minLength="8" value={password.newPassword} onChange={event => setPassword({ ...password, newPassword: event.target.value })} /></label>
          <label className="field">Xác nhận mật khẩu mới<input className="form-control" type="password" autoComplete="new-password" required value={password.confirmPassword} onChange={event => setPassword({ ...password, confirmPassword: event.target.value })} /></label>
          <button className="btn btn-primary-main" disabled={savingPassword} type="submit">{savingPassword ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
        </form>
      </section>
    </div>
  </>;
}
