export const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
export const fmtDate = value => {
  if (!value) return '—';
  const text = String(value);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? new Date(`${text}T00:00:00`)
    : new Date(text);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
};
export const normalize = value => String(value ?? '').toLocaleLowerCase('vi').trim();
