import { NavLink } from 'react-router-dom';
import Status from '../../components/common/Status';
import Empty from '../../components/common/Empty';
import { loanStatus, availableCopies, readerName } from '../../utils/library';
import { today, fmtDate } from '../../utils/format';

export default function Dashboard({ books, readers, loans, categories }) {
  const currentDate = today();
  const active = loans.filter(loan => ['active', 'late'].includes(loanStatus(loan, currentDate)));
  const late = active.filter(loan => loanStatus(loan, currentDate) === 'late');
  const totalCopies = books.reduce((sum, book) => sum + (Number(book.quantity) || 0), 0);
  const available = books.reduce((sum, book) => sum + availableCopies(book, loans), 0);
  const returned = loans.filter(loan => loanStatus(loan, currentDate) === 'done').length;
  const cards = [
    { title: 'Đầu sách', number: books.length, icon: 'book', color: 'blue', note: 'Trong kho thư viện' },
    { title: 'Độc giả', number: readers.length, icon: 'people', color: 'purple', note: 'Đã đăng ký' },
    { title: 'Đang mượn', number: active.length, icon: 'journal-arrow-up', color: 'orange', note: 'Phiếu chưa trả' },
    { title: 'Quá hạn', number: late.length, icon: 'clock-history', color: 'red', note: 'Cần được xử lý' }
  ];
  return <><div className="welcome"><div><div className="eyebrow">KHÔNG GIAN QUẢN TRỊ THƯ VIỆN</div><h2>Chào mừng trở lại! <span>👋</span></h2><p>Theo dõi tình hình hoạt động thư viện của bạn trong một nơi duy nhất.</p></div><div className="welcome-illustration"><i className="bi bi-book-half" /></div></div>
    <div className="stats">{cards.map(card => <div className="stat-card" key={card.title}><div className={`stat-icon ${card.color}`}><i className={`bi bi-${card.icon}`} /></div><div className="stat-title">{card.title}</div><strong>{card.number}</strong><small>{card.note}</small></div>)}</div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-top"><div><h3>Phiếu mượn gần đây</h3><p>Cập nhật các hoạt động mượn trả</p></div><NavLink to="/loans" className="text-link">Xem tất cả <i className="bi bi-arrow-right" /></NavLink></div><div className="table-responsive"><table className="table clean-table"><thead><tr><th>Độc giả</th><th>Sách</th><th>Hạn trả</th><th>Trạng thái</th></tr></thead><tbody>{[...loans].sort((a, b) => (b.borrowDate || '').localeCompare(a.borrowDate || '')).slice(0, 5).map(loan => <tr key={loan.id}><td className="fw-semibold">{readerName(loan, readers)}</td><td>{books.find(item => String(item.id) === String(loan.bookId))?.title || 'Không xác định'}</td><td>{fmtDate(loan.dueDate)}</td><td><Status loan={loan} /></td></tr>)}</tbody></table>{loans.length === 0 && <Empty />}</div></section>
    <section className="panel"><div className="panel-top"><div><h3>Thư viện của bạn</h3><p>Thông tin kho sách</p></div></div><div className="inventory"><div><span>Tổng số bản sách</span><strong>{totalCopies}</strong></div><div><span>Số bản đang mượn</span><strong>{active.length}</strong></div><div><span>Số bản còn lại</span><strong>{available}</strong></div><div><span>Phiếu đã trả</span><strong>{returned}</strong></div><div><span>Tổng số phiếu</span><strong>{loans.length}</strong></div><div><span>Danh mục sách</span><strong>{categories.length}</strong></div></div><div className="tip"><i className="bi bi-lightbulb" /><span>Mẹo: sử dụng mục <b>Mượn / Trả sách</b> để ghi nhận lượt mượn mới.</span></div></section></div>
  </>;
}
