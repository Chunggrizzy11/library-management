export function availableCopies(book, loans) {
  const active = loans.filter(loan => !loan.returnDate && !['pending', 'rejected'].includes(loan.status) && String(loan.bookId) === String(book.id)).length;
  return Number(book.quantity) - active;
}

export function loanStatus(loan, currentDate) {
  if (loan.status === 'pending' || loan.status === 'rejected') return loan.status;
  if (loan.returnDate) return 'done';
  return loan.dueDate < currentDate ? 'late' : 'active';
}

export function canRemoveBook(bookId, loans) {
  return !loans.some(loan => String(loan.bookId) === String(bookId));
}

export function canRemoveReader(readerId, loans) {
  return !loans.some(loan => String(loan.readerId) === String(readerId));
}

export function readerName(loan, readers = []) {
  const reader = readers.find(item =>
    (loan.readerId != null && String(item.id) === String(loan.readerId))
    || (loan.userId != null && item.userId != null && String(item.userId) === String(loan.userId))
    || (loan.userEmail && item.email && item.email.toLowerCase() === loan.userEmail.toLowerCase())
  );
  return reader?.name || loan.userName || 'Không xác định';
}
