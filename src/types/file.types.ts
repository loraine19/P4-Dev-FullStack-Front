export interface UploadingFile {
  file: File | null;
  name: string;
  error: string;
}

export interface UploadParams {
  file: File;
  expirationDays: number;
  password?: string;
  tagIds?: number[];
}

export interface FileItemDto {
  id: number;
  originalName: string;
  size: number;
  mimeType: string;
  shareToken: string;
  passwordProtected: boolean;
  expiresAt: string;
  createdAt: string;
  tags: { id: number; name: string }[];
}
