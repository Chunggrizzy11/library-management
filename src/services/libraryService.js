import { httpClient } from './httpClient';

export const libraryService = {
  async getAll() {
    const [books, readers, loans, categories] = await Promise.all(
      ['books', 'readers', 'loans', 'categories'].map(resource => httpClient(resource))
    );
    return { books, readers, loans, categories };
  },
  create(resource, data) {
    return httpClient(resource, { method: 'POST', body: JSON.stringify(data) });
  },
  update(resource, id, data) {
    return httpClient(`${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },
  remove(resource, id) {
    return httpClient(`${resource}/${id}`, { method: 'DELETE' });
  }
};
