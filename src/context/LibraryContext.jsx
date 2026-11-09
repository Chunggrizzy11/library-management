import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { libraryService } from '../services/libraryService';

const LibraryContext = createContext(null);
const emptyData = { books: [], readers: [], loans: [], categories: [] };

export function LibraryProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setData(await libraryService.getAll());
      setError('');
    } catch {
      setError('Không kết nối được JSON Server. Hãy chạy npm run server tại cổng 9999.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const mutate = async operation => {
    setBusy(true);
    try {
      const result = await operation();
      await reload();
      return result;
    } catch (err) {
      setError(err.message || 'Không thể lưu dữ liệu');
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const create = (resource, payload) => mutate(() => libraryService.create(resource, payload));
  const update = (resource, id, payload) => mutate(() => libraryService.update(resource, id, payload));
  const remove = (resource, id) => mutate(() => libraryService.remove(resource, id));

  const value = useMemo(() => ({ data, loading, busy, error, reload, create, update, remove }), [data, loading, busy, error, reload]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error('useLibrary phải được gọi bên trong LibraryProvider');
  return value;
}
