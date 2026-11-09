import { httpClient } from '../../services/httpClient';
import { createPasswordHash, normalizeEmail, validateRegistration, verifyPassword } from './authUtils';

const publicUser = ({ id, name, email, role = 'user', locked = false }) => ({ id, name, email, role, locked });

export const authService = {
  async login(email, password) {
    const users = await httpClient(`users?email=${encodeURIComponent(normalizeEmail(email))}`);
    if (!users.length || !(await verifyPassword(password, users[0]))) {
      throw new Error('Email hoặc mật khẩu không đúng.');
    }
    if (users[0].locked) throw new Error('Tài khoản đã bị khóa.');
    return publicUser(users[0]);
  },

  async register(values) {
    const error = validateRegistration(values);
    if (error) throw new Error(error);

    const email = normalizeEmail(values.email);
    const existing = await httpClient(`users?email=${encodeURIComponent(email)}`);
    if (existing.length) throw new Error('Email này đã được đăng ký.');

    const hashed = await createPasswordHash(values.password);
    const created = await httpClient('users', {
      method: 'POST',
      body: JSON.stringify({ name: values.name.trim(), email, role: 'user', locked: false, ...hashed, createdAt: new Date().toISOString() })
    });
    return publicUser(created);
  },

  async getUser(id) {
    const account = await httpClient(`users/${id}`);
    if (account.locked) throw new Error('Tài khoản đã bị khóa.');
    return publicUser(account);
  },

  async updateProfile(id, values) {
    const name = values.name?.trim();
    const email = normalizeEmail(values.email);
    if (!name) throw new Error('Vui lòng nhập họ và tên.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email không hợp lệ.');
    const existing = await httpClient(`users?email=${encodeURIComponent(email)}`);
    if (existing.some(account => String(account.id) !== String(id))) throw new Error('Email này đã được đăng ký.');
    return publicUser(await httpClient(`users/${id}`, { method: 'PATCH', body: JSON.stringify({ name, email }) }));
  },

  async changePassword(id, currentPassword, newPassword, confirmPassword) {
    const account = await httpClient(`users/${id}`);
    if (!(await verifyPassword(currentPassword, account))) throw new Error('Mật khẩu hiện tại không đúng.');
    if (!newPassword || newPassword.length < 8) throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự.');
    if (newPassword !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.');
    const hashed = await createPasswordHash(newPassword);
    await httpClient(`users/${id}`, { method: 'PATCH', body: JSON.stringify(hashed) });
  }
};
