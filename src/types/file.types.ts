import type { Tag } from './tag.types';

export interface FileItem {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  shareToken: string;
  expiresAt: string;
  createdAt: string;
  tags: Tag[];
}

export interface DownloadMeta {
  filename: string;
  size: number;
  mimeType: string;
  requiresPassword: boolean;
}
