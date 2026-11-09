import { today } from '../../utils/format';
import { loanStatus } from '../../utils/library';
export default function Status({ loan }) { const type = loanStatus(loan, today()); return <span className={`status ${type}`}><span className="status-dot" />{({ done: 'Đã trả', late: 'Quá hạn', pending: 'Chờ duyệt', rejected: 'Đã từ chối', active: 'Đang mượn' })[type]}</span>; }
