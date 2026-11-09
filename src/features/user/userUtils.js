const present = value => value !== undefined && value !== null && String(value).trim() !== '';
const same = (a, b) => present(a) && present(b) && String(a) === String(b);
const email = value => present(value) ? String(value).trim().toLowerCase() : '';

export function matchingReaders(readers = [], user = {}) {
  if (!user) return [];
  return readers.filter(reader => same(reader.userId, user.id) || (email(user.email) && email(reader.email) === email(user.email)));
}

export function ownLoans(loans = [], readers = [], user = {}) {
  if (!user || (!present(user.id) && !email(user.email))) return [];
  const ids = matchingReaders(readers, user).map(reader => reader.id).filter(present);
  return loans.filter(loan => {
    if (present(loan.userId)) return same(loan.userId, user.id);
    return ids.some(id => same(id, loan.readerId));
  });
}

export function availableCopies(book, loans = []) {
  const active = loans.filter(loan => same(loan.bookId, book.id) && !loan.returnDate && !['pending', 'rejected'].includes(loan.status)).length;
  return Math.max(0, (Number(book.quantity) || 0) - active);
}

export function requestPayload(book, user, readers = [], dates = {}) {
  if (!present(user?.id) || !present(book?.id)) throw new Error('Vui lòng đăng nhập để gửi yêu cầu.');
  const reader = matchingReaders(readers, user)[0];
  return { bookId: book.id, userId: user.id, userName: user.name, userEmail: user.email, ...(reader && present(reader.id) ? { readerId: reader.id } : {}), status: 'pending', borrowDate: dates.borrowDate || null, dueDate: dates.dueDate || null, returnDate: null };
}

export function statusOf(loan) {
  if (loan.status === 'pending') return 'Chờ duyệt';
  if (loan.status === 'rejected') return 'Đã từ chối';
  if (loan.returnDate) return 'Đã trả';
  const today = new Date();
  const localDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  if (loan.dueDate && loan.dueDate < localDate) return 'Quá hạn';
  return 'Đang mượn';
}
