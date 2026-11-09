import { ownLoans, statusOf } from './userUtils.js';

export default function UserLoans({ books = [], loans = [], readers = [], user }) {
  const mine = ownLoans(loans, readers, user);
  return <main className="container py-4"><header className="mb-4"><h1>Sách của tôi</h1><p className="text-muted">Theo dõi yêu cầu mượn và lịch sử mượn sách.</p></header>
    {!mine.length ? <p>Chưa có yêu cầu hoặc lịch sử mượn sách.</p> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Sách</th><th>Trạng thái</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th></tr></thead><tbody>{mine.map((loan, index) => <tr key={loan.id ?? index}><td>{books.find(book => String(book.id) === String(loan.bookId))?.title || 'Sách không còn trong danh mục'}</td><td>{statusOf(loan)}</td><td>{loan.borrowDate || '—'}</td><td>{loan.dueDate || '—'}</td><td>{loan.returnDate || '—'}</td></tr>)}</tbody></table></div>}
  </main>;
}
