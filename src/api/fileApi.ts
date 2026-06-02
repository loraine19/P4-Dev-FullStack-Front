import apiClient from './apiClient';
import type { FileItemDto } from '../types/file.types';
import type { ApiResponseEnvelope } from '../types/api.types';

/* IFILE API INTERFACE */
interface IFileApi {
  getAll(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<FileItemDto[]>>>;
  upload(formData: FormData): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<FileItemDto>>>;
  uploadAnonymous(formData: FormData): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<FileItemDto>>>;
  remove(id: number): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
}

/* FILE API */
class FileApi implements IFileApi {
  /* GET ALL */
  getAll() {
    return apiClient.get<ApiResponseEnvelope<FileItemDto[]>>('/files');
  }

  /* UPLOAD */
  upload(formData: FormData) {
    return apiClient.post<ApiResponseEnvelope<FileItemDto>>('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /* UPLOAD ANONYMOUS */
  uploadAnonymous(formData: FormData) {
    return apiClient.post<ApiResponseEnvelope<FileItemDto>>('/files/anonymous', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /* REMOVE */
  remove(id: number) {
    return apiClient.delete<ApiResponseEnvelope<null>>(`/files/${id}`);
  }
}

export const fileApi = new FileApi();
