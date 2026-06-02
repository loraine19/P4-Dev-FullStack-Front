import apiClient from './apiClient';
import type { Tag } from '../types/tag.types';
import type { ApiResponseEnvelope } from '../types/api.types';

/* ITAG API INTERFACE */
interface ITagApi {
  getAll(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<Tag[]>>>;
  create(name: string): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<Tag>>>;
  remove(id: number): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
}

/* TAG API */
class TagApi implements ITagApi {
  /* GET ALL */
  getAll() {
    return apiClient.get<ApiResponseEnvelope<Tag[]>>('/tags');
  }

  /* CREATE */
  create(name: string) {
    return apiClient.post<ApiResponseEnvelope<Tag>>('/tags', { name });
  }

  /* REMOVE */
  remove(id: number) {
    return apiClient.delete<ApiResponseEnvelope<null>>(`/tags/${id}`);
  }
}

export const tagApi = new TagApi();
