export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return <nav className="simple-pagination" aria-label="Phân trang"><span>Trang {page} / {pages}</span><div><button className="btn btn-sm btn-outline-primary" disabled={page === 1} onClick={() => onChange(page - 1)}><i className="bi bi-chevron-left" /></button>{Array.from({ length: pages }, (_, index) => index + 1).map(number => <button key={number} className={`btn btn-sm ${number === page ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onChange(number)}>{number}</button>)}<button className="btn btn-sm btn-outline-primary" disabled={page === pages} onClick={() => onChange(page + 1)}><i className="bi bi-chevron-right" /></button></div></nav>;
}
