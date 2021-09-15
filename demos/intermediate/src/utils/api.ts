import { ListResult, Pokemon } from 'types';
import { LIST_FETCH_LIMIT } from 'utils/constants';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchFromAPI<T>(
  endpoint: string,
  options?: Record<string, any>,
  init?: RequestInit,
): Promise<T> {
  let queryString = '';
  if (options) {
    queryString = Object.keys(options)
      .map(key => `${key}=${encodeURIComponent(options[key])}`)
      .join('&');
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}?${queryString}`, init);
  const data = response.json();
  return data;
}

interface List {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListResult[];
}

export default {
  list(offset: number, init?: RequestInit) {
    return fetchFromAPI<List>(
      '/pokemon',
      {
        offset,
        limit: LIST_FETCH_LIMIT,
      },
      init,
    );
  },
  get(identifier: string | number, init?: RequestInit) {
    return fetchFromAPI<Pokemon>(`/pokemon/${identifier}`, undefined, init);
  },
};
