export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function validateRegistration({ name, email, password, confirmPassword }) {
  if (!name?.trim()) return 'Vui lòng nhập họ và tên.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))) return 'Email không hợp lệ.';
  if (!password || password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp.';
  return null;
}

const encodeHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

async function derivePassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: Uint8Array.from(salt.match(/.{2}/g), b => parseInt(b, 16)), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return encodeHex(new Uint8Array(bits));
}

export async function createPasswordHash(password) {
  const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, passwordHash: await derivePassword(password, salt) };
}

export async function verifyPassword(password, { salt, passwordHash }) {
  if (!salt || !passwordHash) return false;
  return (await derivePassword(password, salt)) === passwordHash;
}
