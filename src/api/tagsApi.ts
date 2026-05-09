import apiClient from './apiClient';
import type { Tag } from '../types/tag.types';

/* ITAG API INTERFACE */
interface ITagApi {
  getAll(): Promise<import('axios').AxiosResponse<Tag[]>>;
  create(name: string): Promise<import('axios').AxiosResponse<Tag>>;
  remove(id: number): Promise<import('axios').AxiosResponse<void>>;
}

/* TAG API */
class TagApi implements ITagApi {
  /* GET ALL */
  getAll() {
    return apiClient.get<Tag[]>('/tags');
  }

  /* CREATE */
  create(name: string) {
    return apiClient.post<Tag>('/tags', { name });
  }

  /* REMOVE */
  remove(id: number) {
    return apiClient.delete<void>(`/tags/${id}`);
  }
}

export const tagApi = new TagApi();
