import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import SectionHeader from '../../components/common/SectionHeader';
import { normalize } from '../../utils/format';
import Pagination from '../../components/common/Pagination';

export default function Categories({ categories, books, onCreate, onDelete, busy }) {
  const { update } = useLibrary();
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [page, setPage] = useState(1); const pageSize = 6;
  const paged = categories.slice((page - 1) * pageSize, page * pageSize);
  const submit = async event => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some(item => String(item.id) !== String(editingId) && normalize(item.name) === normalize(trimmed))) return alert('Danh mục đã tồn tại');
    try {
      if (editingId !== null) await update('categories', editingId, { name: trimmed });
      else await onCreate('categories', { name: trimmed });
      setName(''); setEditingId(null);
    } catch { /* App hiển thị lỗi */ }
  };
  return <><SectionHeader kicker="PHÂN LOẠI" title="Danh mục sách" desc="Phân nhóm đầu sách để dễ dàng quản lý" /><div className="category-layout"><section className="panel"><div className="panel-top"><div><h3>Danh mục hiện có</h3><p>{categories.length} danh mục</p></div></div><div className="category-list">{paged.map(item => <div className="category-row" key={item.id}><div className="category-badge"><i className="bi bi-collection" /></div><div><b>{item.name}</b><small>{books.filter(book => String(book.categoryId) === String(item.id)).length} đầu sách</small></div><button aria-label={`Sửa ${item.name}`} className="icon-btn ms-auto" disabled={busy} onClick={() => { setEditingId(item.id); setName(item.name); }}><i className="bi bi-pencil" /></button><button aria-label={`Xóa ${item.name}`} disabled={busy || books.some(book => String(book.categoryId) === String(item.id))} title="Chỉ xóa được danh mục chưa có sách" className="icon-btn danger" onClick={() => { if (confirm(`Xóa danh mục ${item.name}?`)) onDelete('categories', item.id); }}><i className="bi bi-trash" /></button></div>)}</div><Pagination page={page} pageSize={pageSize} total={categories.length} onChange={setPage} /></section><section className="panel category-create"><h3>{editingId !== null ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h3><p>{editingId !== null ? 'Cập nhật tên danh mục' : 'Tạo nhóm sách mới cho thư viện'}</p><form onSubmit={submit}><label className="field">Tên danh mục *<input required className="form-control" placeholder="Ví dụ: Lịch sử" value={name} onChange={event => setName(event.target.value)} /></label><button type="submit" disabled={busy || !name.trim()} className="btn btn-primary-main mt-3 w-100">{editingId !== null ? 'Lưu danh mục' : 'Thêm danh mục'}</button>{editingId !== null && <button type="button" className="btn btn-light mt-2 w-100" onClick={() => { setEditingId(null); setName(''); }}>Hủy</button>}</form></section></div></>;
}
