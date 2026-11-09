import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { today } from '../../utils/format';
import { availableCopies, ownLoans, requestPayload } from './userUtils.js';

function introduction(book, categoryName) {
  if (book.description) return book.description;
  return `${book.title} là một tài liệu thuộc chủ đề ${categoryName || 'kiến thức'}, được viết bởi ${book.author || 'tác giả chưa cập nhật'}. Sách phù hợp cho bạn đọc muốn tìm hiểu thêm về nội dung và những kiến thức thực tế trong lĩnh vực này.`;
}

export default function BookDetailPage({ books = [], categories = [], loans = [], readers = [], user, create }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [dates, setDates] = useState({ borrowDate: today(), dueDate: '' });
  const book = books.find(item => String(item.id) === String(bookId));

  if (!book) return <section className="book-detail-panel"><h2>Không tìm thấy sách</h2><Link to="/catalog" className="btn btn-primary">Quay lại tra cứu</Link></section>;

  const category = categories.find(item => String(item.id) === String(book.categoryId));
  const mine = ownLoans(loans, readers, user);
  const pending = mine.some(loan => String(loan.bookId) === String(book.id) && loan.status === 'pending');
  const copies = availableCopies(book, loans);

  const openRequestForm = () => {
    setError('');
    setDates({ borrowDate: today(), dueDate: '' });
    setShowRequestForm(true);
  };

  const request = async event => {
    event.preventDefault();
    if (sending || pending || copies <= 0) return;
    if (!dates.dueDate || dates.dueDate < dates.borrowDate) {
      setError('Hạn trả phải từ ngày mượn trở đi.');
      return;
    }
    setError('');
    setMessage('');
    setSending(true);
    try {
      await create('loans', requestPayload(book, user, readers, dates));
      setShowRequestForm(false);
      setMessage('Đã gửi yêu cầu mượn sách. Vui lòng chờ Admin duyệt.');
    } catch (err) {
      setError(err?.message || 'Không thể gửi yêu cầu.');
    } finally {
      setSending(false);
    }
  };

  return <>
    <section className="book-detail-page">
      <div className="book-detail-page-nav"><button className="btn btn-link p-0" onClick={() => navigate('/catalog')}><i className="bi bi-arrow-left" /> Quay lại danh sách sách</button></div>
      <div className="book-detail-panel">
        <div className="book-detail-top">
          <div className="book-detail-image">{book.cover ? <img src={book.cover} alt={`Bìa sách ${book.title}`} /> : <i className="bi bi-book" />}</div>
          <div className="book-detail-summary">
            <span className="book-detail-label">THÔNG TIN SÁCH</span>
            <h1>{book.title}</h1>
            <p className="book-detail-author"><b>Tác giả:</b> {book.author || 'Chưa cập nhật'}</p>
            <div className="book-detail-meta"><span><b>Danh mục:</b> {category?.name || 'Chưa cập nhật'}</span><span><b>Năm xuất bản:</b> {book.year || 'Chưa cập nhật'}</span><span><b>ISBN:</b> {book.isbn || 'Chưa cập nhật'}</span><span><b>Số lượng còn:</b> {copies} / {book.quantity || 0}</span></div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && !showRequestForm && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary" disabled={sending || pending || copies <= 0} onClick={openRequestForm}>{sending ? 'Đang gửi...' : pending ? 'Đã gửi yêu cầu' : copies > 0 ? 'Yêu cầu mượn sách' : 'Đã hết sách'}</button>
          </div>
        </div>
        <div className="book-introduction"><h2>Giới thiệu sách</h2><h3>{book.title}</h3><p>{introduction(book, category?.name)}</p></div>
      </div>
    </section>
    {showRequestForm && <Modal title="Chọn ngày mượn sách" onClose={() => setShowRequestForm(false)}><form onSubmit={request}><div className="form-grid"><label className="field">Ngày mượn *<input type="date" required className="form-control" value={dates.borrowDate} onChange={event => setDates({ ...dates, borrowDate: event.target.value })} /></label><label className="field">Hạn trả *<input type="date" required min={dates.borrowDate} className="form-control" value={dates.dueDate} onChange={event => setDates({ ...dates, dueDate: event.target.value })} /></label></div>{error && <div className="alert alert-danger mt-3">{error}</div>}<div className="form-actions"><button type="button" className="btn btn-light" onClick={() => setShowRequestForm(false)}>Hủy</button><button disabled={sending} type="submit" className="btn btn-primary-main">{sending ? 'Đang gửi...' : 'Gửi yêu cầu'}</button></div></form></Modal>}
  </>;
}
