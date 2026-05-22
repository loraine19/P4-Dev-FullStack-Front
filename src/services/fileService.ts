import { fileApi } from '../api/fileApi';
import type { FileItem } from '../types/file.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError } from './serviceHelpers';

/* IFILE SERVICE INTERFACE */
interface IFileService {
  getMyFiles(): Promise<FileItem[] | ErrorMsg>;
  uploadFile(formData: FormData): Promise<FileItem | ErrorMsg | null>;
  deleteFile(id: number): Promise<void>;
}

/* FILE SERVICE */
class FileService implements IFileService {
  /* GET MY FILES */
  async getMyFiles(): Promise<FileItem[] | ErrorMsg> {
    try {
      const res = await fileApi.getAll();
      return res.data.data ?? [];
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* UPLOAD FILE */
  async uploadFile(formData: FormData): Promise<FileItem | ErrorMsg | null> {
    try {
      const res = await fileApi.upload(formData);
      return res.data.data;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* DELETE FILE */
  async deleteFile(id: number): Promise<void> {
    await fileApi.remove(id);
  }
}

export const fileService = new FileService();
