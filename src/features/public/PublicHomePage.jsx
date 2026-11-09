import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '../../services/libraryService';

export default function PublicHomePage() {
  const [data, setData] = useState({ books: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryService.getAll().then(result => setData(result)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const newest = [...data.books].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 8);
  const featured = data.books.slice(0, 3);

  return <div className="public-home">
    <header className="public-header">
      <div className="public-container public-header-inner">
        <Link to="/" className="public-brand"><span className="public-brand-icon"><i className="bi bi-book-half" /></span> Libra<span>Space</span></Link>
        <nav className="public-nav"><a href="#new-books">Sách mới</a></nav>
        <div className="public-actions"><Link to="/login" className="public-login">Đăng nhập</Link><Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link></div>
      </div>
    </header>

    <main>
      <section className="public-hero"><div className="public-container public-hero-grid">
        <div className="public-hero-copy"><span className="public-kicker"><i className="bi bi-bookmark-star" /> THƯ VIỆN CỦA BẠN</span><h1>Đọc thêm mỗi ngày,<br /><span>mở rộng hiểu biết.</span></h1><p>Tra cứu sách, khám phá các chủ đề yêu thích và gửi yêu cầu mượn sách thật dễ dàng.</p><div className="public-hero-actions"><Link to="/register" className="btn btn-primary">Bắt đầu đọc sách <i className="bi bi-arrow-right" /></Link><a href="#new-books" className="btn btn-outline-secondary">Xem sách mới</a></div></div>
        <div className="public-hero-books"><div className="hero-circle hero-circle-one" /><div className="hero-circle hero-circle-two" />{featured.map((book, index) => <div className={`hero-book hero-book-${index}`} key={book.id}>{book.cover ? <img src={book.cover} alt={book.title} /> : <i className="bi bi-book" />}</div>)}</div>
      </div></section>

      <section className="public-container public-content" id="new-books"><div className="public-section-title"><div><span className="public-kicker">GỢI Ý CHO BẠN</span><h2>Sách mới trong thư viện</h2><p className="public-section-subtitle">Khám phá những đầu sách đang có sẵn tại LibraSpace</p></div><Link to="/login" className="public-see-all">Xem tất cả <i className="bi bi-arrow-right" /></Link></div>
        {loading ? <p className="text-muted">Đang tải danh sách sách...</p> : <div className="public-book-grid">{newest.map(book => <article className="public-book-card" key={book.id}><div className="public-cover">{book.cover ? <img src={book.cover} alt={book.title} /> : <i className="bi bi-book" />}</div><div className="public-book-info"><h3>{book.title}</h3><p>{book.author}</p><small>{book.year || 'Chưa rõ'} · Còn {book.quantity} bản</small></div></article>)}</div>}
      </section>


    </main>
  </div>;
}
