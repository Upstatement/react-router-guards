import { ListResult, Pokemon } from 'types';
import { LIST_FETCH_LIMIT } from 'utils/constants';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

interface BasicResponse {
  [key: string]: any;
}

const fetchFromAPI = async (
  endpoint: string,
  options?: Record<string, any>,
): Promise<BasicResponse> => {
  let queryString = '';
  if (options) {
    queryString = Object.keys(options)
      .map(key => `${key}=${encodeURIComponent(options[key])}`)
      .join('&');
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}?${queryString}`);
  const data = response.json();
  return data;
};

interface List {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListResult[];
}

export default {
  async list(offset: number) {
    return fetchFromAPI('/pokemon', {
      offset,
      limit: LIST_FETCH_LIMIT,
    }) as Promise<List>;
  },
  get(identifier: string | number) {
    return fetchFromAPI(`/pokemon/${identifier}`) as Promise<Pokemon>;
  },
};
