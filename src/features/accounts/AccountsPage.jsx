import { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { httpClient } from '../../services/httpClient';
import { fmtDate } from '../../utils/format';
import Pagination from '../../components/common/Pagination';

const isAdmin = account => account.role === 'admin';
const isActiveAdmin = account => isAdmin(account) && !account.locked;
const sameId = (a, b) => a != null && b != null && String(a) === String(b);
// Keep only fields needed by this page; credentials never enter rendering state.
const accountDetails = ({ id, name, email, role, locked, createdAt }) => ({ id, name, email, role: role || 'user', locked: Boolean(locked), createdAt });

export default function AccountsPage({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const allowed = user?.role === 'admin' && !user?.locked;

  useEffect(() => {
    if (!allowed) { setAccounts([]); setLoading(false); return; }
    let active = true;
    setLoading(true); setError('');
    httpClient('users').then(data => {
      if (!Array.isArray(data)) throw new Error('Dữ liệu tài khoản không hợp lệ.');
      if (active) setAccounts(data.map(accountDetails));
    }).catch(err => { if (active) setError(err?.message || 'Không thể tải tài khoản.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [allowed, reload]);

  async function changeAccount(account, patch) {
    if (busy || !allowed) return;
    setBusy(true); setError(''); setNotice('');
    try {
      // Refresh before the change so another administrator's recent changes are considered.
      const data = await httpClient('users');
      if (!Array.isArray(data)) throw new Error('Dữ liệu tài khoản không hợp lệ.');
      const latest = data.map(accountDetails);
      setAccounts(latest);
      const target = latest.find(item => sameId(item.id, account.id));
      if (!target) throw new Error('Tài khoản không còn tồn tại.');
      const self = sameId(target.id, user?.id);
      if (self && (patch.locked === true || patch.role === 'user')) throw new Error('Bạn không thể khóa hoặc hạ quyền tài khoản của mình.');
      if (isActiveAdmin(target) && (patch.locked === true || patch.role === 'user') && latest.filter(isActiveAdmin).length <= 1) {
        throw new Error('Phải giữ ít nhất một quản trị viên đang hoạt động.');
      }
      await httpClient(`users/${encodeURIComponent(target.id)}`, { method: 'PATCH', body: JSON.stringify(patch) });
      setAccounts(previous => previous.map(item => sameId(item.id, target.id) ? { ...item, ...patch } : item));
      setNotice('Đã cập nhật tài khoản.');
    } catch (err) { setError(err?.message || 'Không thể cập nhật tài khoản.'); }
    finally { setBusy(false); }
  }

  const adminCount = accounts.filter(isActiveAdmin).length;
  const pagedAccounts = accounts.slice((page - 1) * pageSize, page * pageSize);
  return <>
    <SectionHeader kicker="TÀI KHOẢN" title="Quản lý tài khoản" desc="Xem thông tin, phân quyền và quản lý trạng thái tài khoản" />
    {!allowed ? <div className="auth-error" role="alert">Chỉ quản trị viên đang hoạt động có thể quản lý tài khoản.</div> : <section className="panel">
      <div className="panel-top"><div><h3>Danh sách tài khoản</h3><p>{accounts.length} tài khoản</p></div><button className="btn btn-light" type="button" disabled={loading || busy} onClick={() => setReload(value => value + 1)}>Làm mới</button></div>
      {error && <div className="auth-error mx-4 mb-3" role="alert">{error}</div>}
      {notice && <div className="alert alert-success mx-4" role="status">{notice}</div>}
      {loading ? <div className="loading">Đang tải tài khoản...</div> : <div className="table-responsive"><table className="table clean-table">
        <thead><tr><th>Họ và tên</th><th>Email</th><th>Ngày tạo</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>{pagedAccounts.map(account => {
          const self = sameId(account.id, user?.id);
          const lastAdmin = isActiveAdmin(account) && adminCount <= 1;
          const preventRemoval = self || lastAdmin;
          return <tr key={account.id}>
            <td><b>{account.name || '—'}</b>{self && <span className="muted-small"> (Bạn)</span>}</td><td>{account.email || '—'}</td><td>{account.createdAt ? fmtDate(account.createdAt) : '—'}</td>
            <td><select aria-label={`Vai trò của ${account.name || account.email}`} className="form-select form-select-sm" value={account.role} disabled={busy || (isAdmin(account) && preventRemoval)} onChange={event => changeAccount(account, { role: event.target.value })}><option value="user">Người dùng</option><option value="admin">Quản trị viên</option></select></td>
            <td><span className={`status ${account.locked ? 'late' : 'done'}`}><span className="status-dot" />{account.locked ? 'Đã khóa' : 'Hoạt động'}</span></td>
            <td><button type="button" className="btn btn-return" disabled={busy || (!account.locked && preventRemoval)} title={!account.locked && preventRemoval ? 'Không thể khóa tài khoản của bạn hoặc quản trị viên hoạt động cuối cùng' : ''} onClick={() => changeAccount(account, { locked: !account.locked })}>{account.locked ? 'Mở khóa' : 'Khóa'}</button></td>
          </tr>;
        })}</tbody>
      </table>{!accounts.length && !error && <div className="empty"><p>Chưa có tài khoản nào.</p></div>}<Pagination page={page} pageSize={pageSize} total={accounts.length} onChange={setPage} /></div>}
    </section>}
  </>;
}

