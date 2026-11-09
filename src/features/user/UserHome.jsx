import { Link } from 'react-router-dom';
import { availableCopies, ownLoans, statusOf } from './userUtils.js';

export default function UserHome({ books = [], loans = [], readers = [], user }) {
  const mine = ownLoans(loans, readers, user);
  const active = mine.filter(loan => ['Đang mượn', 'Quá hạn'].includes(statusOf(loan)));
  const available = books.filter(book => availableCopies(book, loans) > 0);
  const newest = [...available].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 8);

  return <main className="user-home-page">
    <section className="user-welcome-banner"><div><span className="user-kicker"><i className="bi bi-bookmark-star" /> GÓC ĐỌC CỦA BẠN</span><h1>Xin chào{user?.name ? `, ${user.name}` : ''}!</h1><p>Hôm nay bạn muốn khám phá cuốn sách nào?</p><Link to="/catalog" className="btn btn-primary">Tìm sách ngay <i className="bi bi-search" /></Link></div><div className="user-banner-icon"><i className="bi bi-journal-bookmark" /></div></section>

    <section className="user-section"><div className="user-section-heading"><div><span className="user-kicker">GỢI Ý CHO BẠN</span><h2>Sách mới và nổi bật</h2><p className="user-section-subtitle">Một số đầu sách đang có sẵn trong thư viện</p></div><Link to="/catalog">Xem tất cả <i className="bi bi-arrow-right" /></Link></div><div className="user-book-grid">{newest.map(book => <article className="user-book-card" key={book.id}><div className="user-book-cover">{book.cover ? <img src={book.cover} alt={book.title} /> : <i className="bi bi-book" />}</div><div className="user-book-details"><h3>{book.title}</h3><p>{book.author}</p><small>{book.year || 'Chưa rõ'} · Còn {availableCopies(book, loans)} bản</small><Link to={`/catalog/${book.id}`} className="user-book-link">Xem chi tiết</Link></div></article>)}</div>{!newest.length && <p className="text-muted">Hiện chưa có sách có sẵn.</p>}</section>

    <section className="user-section user-loan-preview"><div className="user-section-heading"><div><span className="user-kicker">THEO DÕI CỦA BẠN</span><h2>Sách đang mượn</h2></div><Link to="/my-loans">Xem lịch sử</Link></div>{active.length ? active.slice(0, 3).map(loan => <div className="user-loan-row" key={loan.id}><div className="user-loan-icon"><i className="bi bi-book" /></div><div><strong>{books.find(book => String(book.id) === String(loan.bookId))?.title || 'Sách không xác định'}</strong><small>Hạn trả: {loan.dueDate || 'Chưa có'}</small></div><span className={`user-loan-status ${statusOf(loan) === 'Quá hạn' ? 'overdue' : ''}`}>{statusOf(loan)}</span></div>) : <p className="text-muted">Bạn chưa mượn sách nào.</p>}</section>
  </main>;
}
