export interface FileItem {
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

export interface DownloadMeta {
  filename: string;
  size: number;
  mimeType: string;
  requiresPassword: boolean;
}
