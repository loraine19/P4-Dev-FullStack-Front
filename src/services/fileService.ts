import { fileApi } from '../api/fileApi';
import type { FileItemDto, UploadParams } from '../types/file.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError } from './serviceHelpers';

/* IFILE SERVICE INTERFACE */
interface IFileService {
  getMyFiles(): Promise<FileItemDto[] | ErrorMsg>;
  upload(params: UploadParams, isAuthenticated: boolean): Promise<FileItemDto | ErrorMsg | null>;
  deleteFile(id: number): Promise<void | ErrorMsg>;
}

/* FILE SERVICE */
class FileService implements IFileService {
  /* GET MY FILES */
  async getMyFiles(): Promise<FileItemDto[] | ErrorMsg> {
    try {
      const res = await fileApi.getAll();
      return res.data.data ?? [];
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* BUILD FORM DATA */
  private buildFormData({ file, expirationDays, password, tagIds }: UploadParams): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expirationDays', String(expirationDays));
    if (password) formData.append('downloadPassword', password);
    tagIds?.forEach((id) => formData.append('tags', String(id)));
    return formData;
  }

  /* UPLOAD */
  async upload(params: UploadParams, isAuthenticated: boolean): Promise<FileItemDto | ErrorMsg | null> {
    try {
      const formData = this.buildFormData(params);
      const res = isAuthenticated
        ? await fileApi.upload(formData)
        : await fileApi.uploadAnonymous(formData);
      return res.data.data;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* DELETE FILE */
  async deleteFile(id: number): Promise<void | ErrorMsg> {
    try {
      await fileApi.remove(id);
    } catch (error) {
      return catchApiError(error);
    }
  }
}

export const fileService = new FileService();
