import { fileApi } from '../api/fileApi';
import type { FileItem } from '../types/file.types';

/* IFILES SERVICE INTERFACE */
interface IFilesService {
  getMyFiles(): Promise<FileItem[]>;
  uploadFile(formData: FormData): Promise<FileItem | null>;
  deleteFile(id: number): Promise<void>;
}

/* FILES SERVICE */
class FilesService implements IFilesService {
  /* GET MY FILES */
  async getMyFiles(): Promise<FileItem[]> {
    const res = await fileApi.getAll();
    return res.data ?? [];
  }

  /* UPLOAD FILE */
  async uploadFile(formData: FormData): Promise<FileItem | null> {
    const res = await fileApi.upload(formData);
    return res.data;
  }

  /* DELETE FILE */
  async deleteFile(id: number): Promise<void> {
    await fileApi.remove(id);
  }
}

export const filesService = new FilesService();
