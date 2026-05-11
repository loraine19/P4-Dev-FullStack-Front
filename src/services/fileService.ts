import { fileApi } from '../api/fileApi';
import type { FileItem } from '../types/file.types';

/* IFILE SERVICE INTERFACE */
interface IFileService {
  getMyFiles(): Promise<FileItem[]>;
  uploadFile(formData: FormData): Promise<FileItem | null>;
  deleteFile(id: number): Promise<void>;
}

/* FILE SERVICE */
// not wired yet — will replace mock data in MySpacePage
class FileService implements IFileService {
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

export const fileService = new FileService();
