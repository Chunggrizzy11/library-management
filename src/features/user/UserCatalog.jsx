import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { availableCopies, ownLoans, requestPayload } from './userUtils.js';

function bookIntroduction(book, categoryName) {
  if (book.description) return book.description;
  const category = categoryName || 'kiến thức';
  return `${book.title} là một tài liệu thuộc chủ đề ${category}, được viết bởi ${book.author || 'tác giả chưa cập nhật'}. Sách phù hợp cho bạn đọc muốn tìm hiểu thêm về nội dung và những kiến thức thực tế trong lĩnh vực này.`;
}

export default function UserCatalog({ books = [], categories = [], loans = [], readers = [], user, create }) {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const queryCategory = new URLSearchParams(location.search).get('category') || '';
  const [category, setCategory] = useState(queryCategory);
  const [availability, setAvailability] = useState('all');
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();
  const changeCategory = event => setCategory(event.target.value);
  useEffect(() => { setCategory(queryCategory); }, [queryCategory]);
  useEffect(() => setPage(1), [search, category, availability]);
  const myLoans = ownLoans(loans, readers, user);
  const pending = book => myLoans.some(loan => String(loan.bookId) === String(book.id) && loan.status === 'pending');
  const term = search.trim().toLocaleLowerCase();
  const filtered = books.filter(book => {
    const matches = [book.title, book.author, book.isbn].some(value => String(value || '').toLocaleLowerCase().includes(term));
    return matches && (!category || String(book.categoryId) === category) && (availability === 'all' || (availability === 'available' ? availableCopies(book, loans) > 0 : availableCopies(book, loans) <= 0));
  });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function request(book) {
    if (sending || pending(book) || availableCopies(book, loans) <= 0) return;
    setError(''); setMessage('');
    try {
      setSending(true);
      await create('loans', requestPayload(book, user, readers));
      setMessage(`Đã gửi yêu cầu mượn “${book.title}”.`);
      setSelected(null);
    } catch (err) { setError(err?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.'); }
    finally { setSending(false); }
  }

  const selectedCategory = selected && categories.find(item => String(item.id) === String(selected.categoryId));
  return <main className="student-catalog-page">
    <header className="catalog-heading"><h1>Khám phá sách</h1><p>Tìm sách và gửi yêu cầu mượn đến thư viện.</p></header>
    {message && <div role="status" className="alert alert-success">{message}</div>}
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    <div className="catalog-filters"><label>Tìm kiếm<input className="form-control" placeholder="Tên sách, tác giả hoặc ISBN" value={search} onChange={event => setSearch(event.target.value)} /></label><label>Danh mục<select className="form-select" value={category} onChange={changeCategory}><option value="">Tất cả danh mục</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Tình trạng<select className="form-select" value={availability} onChange={event => setAvailability(event.target.value)}><option value="all">Tất cả</option><option value="available">Còn sách</option><option value="unavailable">Hết sách</option></select></label></div>
    <p className="catalog-result-count">{filtered.length} kết quả</p>
    <div className="catalog-book-grid">{paged.map(book => <article className="catalog-book-card" key={book.id}><div className="catalog-card-cover">{book.cover ? <img src={book.cover} alt={book.title} /> : <i className="bi bi-book" />}</div><div className="catalog-card-content"><h2>{book.title}</h2><p>{book.author || 'Chưa rõ tác giả'}</p><span>{availableCopies(book, loans)} bản có sẵn</span><button className="btn btn-outline-primary" onClick={() => navigate(`/catalog/${book.id}`)}>Xem chi tiết</button></div></article>)}</div><Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
    {!filtered.length && <p>Không tìm thấy sách phù hợp.</p>}

    {selected && <section className="book-detail-panel" aria-label={`Chi tiết ${selected.title}`}><div className="book-detail-top"><button type="button" className="book-detail-close" onClick={() => setSelected(null)}><i className="bi bi-x-lg" /> Đóng</button><div className="book-detail-image">{selected.cover ? <img src={selected.cover} alt={`Bìa sách ${selected.title}`} /> : <i className="bi bi-book" />}</div><div className="book-detail-summary"><span className="book-detail-label">THÔNG TIN SÁCH</span><h2>{selected.title}</h2><p className="book-detail-author"><b>Tác giả:</b> {selected.author || 'Chưa cập nhật'}</p><div className="book-detail-meta"><span><b>Danh mục:</b> {selectedCategory?.name || 'Chưa cập nhật'}</span><span><b>Năm xuất bản:</b> {selected.year || 'Chưa cập nhật'}</span><span><b>ISBN:</b> {selected.isbn || 'Chưa cập nhật'}</span><span><b>Số lượng còn:</b> {availableCopies(selected, loans)} / {selected.quantity || 0}</span></div><button className="btn btn-primary" disabled={sending || pending(selected) || availableCopies(selected, loans) <= 0} onClick={() => request(selected)}>{sending ? 'Đang gửi...' : pending(selected) ? 'Đã gửi yêu cầu' : availableCopies(selected, loans) > 0 ? 'Yêu cầu mượn sách' : 'Đã hết sách'}</button></div></div><div className="book-introduction"><h3>Giới thiệu sách</h3><h4>{selected.title}</h4><p>{bookIntroduction(selected, selectedCategory?.name)}</p></div></section>}
  </main>;
}
