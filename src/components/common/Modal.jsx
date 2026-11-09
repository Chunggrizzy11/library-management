import { useEffect } from 'react';
export default function Modal({ title, onClose, children }) {
  useEffect(() => { const handler = event => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose]);
  return <div className="modal-backdrop-custom" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
      <div className="dialog-head"><h5>{title}</h5><button className="btn btn-sm btn-light" onClick={onClose} aria-label="Đóng"><i className="bi bi-x-lg" /></button></div>
      {children}
    </div>
  </div>;
}
