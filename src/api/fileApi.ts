import apiClient from './apiClient';
import type { FileItem } from '../types/file.types';
import type { ApiResponseEnvelope } from '../types/user.types';

/* IFILE API INTERFACE */
interface IFileApi {
  getAll(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<FileItem[]>>>;
  upload(formData: FormData): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<FileItem>>>;
  remove(id: number): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
}

/* FILE API */
class FileApi implements IFileApi {
  /* GET ALL */
  getAll() {
    return apiClient.get<ApiResponseEnvelope<FileItem[]>>('/files');
  }

  /* UPLOAD */
  upload(formData: FormData) {
    return apiClient.post<ApiResponseEnvelope<FileItem>>('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /* REMOVE */
  remove(id: number) {
    return apiClient.delete<ApiResponseEnvelope<null>>(`/files/${id}`);
  }
}

export const fileApi = new FileApi();
