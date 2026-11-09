import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Empty from '../../components/common/Empty';
import SectionHeader from '../../components/common/SectionHeader';
import Status from '../../components/common/Status';
import { today, fmtDate } from '../../utils/format';
import { availableCopies, loanStatus, readerName } from '../../utils/library';
import Pagination from '../../components/common/Pagination';

function dueInTwoWeeks() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function Loans({ loans, books, readers, onCreate, onUpdate, busy }) {
  const [filter, setFilter] = useState('all');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ bookId: '', readerId: '', borrowDate: today(), dueDate: '' }); const [page, setPage] = useState(1); const pageSize = 6;
  const available = book => availableCopies(book, loans);
  const filtered = loans.filter(loan => filter === 'all' || (filter === 'returned' ? loanStatus(loan, today()) === 'done' : loanStatus(loan, today()) === filter));
  useEffect(() => setPage(1), [filter]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const submit = async event => {
    event.preventDefault();
    if (form.dueDate < form.borrowDate) return alert('Hạn trả phải từ ngày mượn trở đi');
    const book = books.find(item => String(item.id) === String(form.bookId));
    if (!book || available(book) <= 0) return alert('Sách đã hết, vui lòng chọn sách khác');
    try { await onCreate('loans', { ...form, bookId: Number(form.bookId), readerId: Number(form.readerId), returnDate: null, status: 'active' }); setShow(false); } catch { /* hiển thị ở App */ }
  };
  const approve = async loan => {
    const book = books.find(item => String(item.id) === String(loan.bookId));
    if (!book || available(book) <= 0) return alert('Sách đã hết, không thể duyệt yêu cầu.');
    try {
      let reader = readers.find(item => (item.userId != null && String(item.userId) === String(loan.userId)) || (loan.userEmail && item.email?.toLowerCase() === loan.userEmail.toLowerCase()));
      if (!reader) reader = await onCreate('readers', { name: loan.userName || 'Độc giả', email: loan.userEmail || '', phone: '', joinedAt: today(), userId: loan.userId });
      await onUpdate('loans', loan.id, { readerId: reader.id, status: 'active', borrowDate: loan.borrowDate || today(), dueDate: loan.dueDate || dueInTwoWeeks(), returnDate: null });
    } catch { /* hiển thị ở App */ }
  };
  return <><SectionHeader kicker="LƯU THÔNG SÁCH" title="Mượn / Trả sách" desc="Quản lý phiếu mượn, yêu cầu và thời hạn trả sách" action={<button className="btn btn-primary-main" onClick={() => { setForm({ bookId: '', readerId: '', borrowDate: today(), dueDate: '' }); setShow(true); }}><i className="bi bi-plus-lg" /> Tạo phiếu mượn</button>} />
    <section className="panel"><div className="filter-bar tabs">{[['all','Tất cả'],['pending','Chờ duyệt'],['active','Đang mượn'],['late','Quá hạn'],['returned','Đã trả'],['rejected','Từ chối']].map(([value,label]) => <button key={value} className={`tab ${filter === value ? 'selected' : ''}`} onClick={() => setFilter(value)}>{label}</button>)}</div>
      <div className="table-responsive"><table className="table clean-table"><thead><tr><th>Mã phiếu</th><th>Sách</th><th>Độc giả</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{[...paged].reverse().map(loan => <tr key={loan.id}><td>#{String(loan.id).padStart(4,'0')}</td><td>{books.find(item => String(item.id) === String(loan.bookId))?.title || 'Không xác định'}</td><td>{readerName(loan, readers)}</td><td>{fmtDate(loan.borrowDate)}</td><td>{fmtDate(loan.dueDate)}</td><td><Status loan={loan} /></td><td>{loan.status === 'pending' ? <><button disabled={busy} className="btn btn-sm btn-primary-main me-2" onClick={() => approve(loan)}>Duyệt</button><button disabled={busy} className="btn btn-sm btn-outline-danger" onClick={() => onUpdate('loans', loan.id, { status: 'rejected' })}>Từ chối</button></> : !loan.returnDate && loan.status !== 'rejected' ? <button disabled={busy} className="btn btn-return" onClick={() => { if (confirm('Xác nhận đã nhận lại sách?')) onUpdate('loans', loan.id, { returnDate: today(), status: 'returned' }); }}>Trả sách</button> : fmtDate(loan.returnDate)}</td></tr>)}</tbody></table>{filtered.length === 0 && <Empty />}</div><Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
    </section>{show && <Modal title="Tạo phiếu mượn mới" onClose={() => setShow(false)}><form onSubmit={submit}><div className="form-grid"><label className="field full">Chọn sách *<select required className="form-select" value={form.bookId} onChange={event => setForm({ ...form, bookId: event.target.value })}><option value="">Chọn sách còn trong kho</option>{books.filter(book => available(book) > 0).map(book => <option key={book.id} value={book.id}>{book.title} (còn {available(book)})</option>)}</select></label><label className="field full">Độc giả *<select required className="form-select" value={form.readerId} onChange={event => setForm({ ...form, readerId: event.target.value })}><option value="">Chọn độc giả</option>{readers.map(reader => <option key={reader.id} value={reader.id}>{reader.name}</option>)}</select></label><label className="field">Ngày mượn *<input type="date" required className="form-control" value={form.borrowDate} onChange={event => setForm({ ...form, borrowDate: event.target.value })} /></label><label className="field">Hạn trả *<input type="date" required min={form.borrowDate} className="form-control" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })} /></label></div><div className="form-actions"><button type="button" className="btn btn-light" onClick={() => setShow(false)}>Hủy</button><button disabled={busy} type="submit" className="btn btn-primary-main">Tạo phiếu mượn</button></div></form></Modal>}</>;
}
