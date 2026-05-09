import apiClient from './apiClient';
import type { FileItem } from '../types/file.types';

/* IFILE API INTERFACE */
interface IFileApi {
  getAll(): Promise<import('axios').AxiosResponse<FileItem[]>>;
  upload(formData: FormData): Promise<import('axios').AxiosResponse<FileItem>>;
  remove(id: number): Promise<import('axios').AxiosResponse<void>>;
}

/* FILE API */
class FileApi implements IFileApi {
  /* GET ALL */
  getAll() {
    return apiClient.get<FileItem[]>('/files');
  }

  /* UPLOAD */
  upload(formData: FormData) {
    return apiClient.post<FileItem>('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /* REMOVE */
  remove(id: number) {
    return apiClient.delete<void>(`/files/${id}`);
  }
}

export const fileApi = new FileApi();
