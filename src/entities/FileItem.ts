import type { FileItemDto } from '../types/file.types';
import { formatFileSize } from '../utils/formatFileSize';

/* FILE ENTITY */
export class FileItem {
  readonly id: number;
  readonly originalName: string;
  readonly size: number;
  readonly mimeType: string;
  readonly shareToken: string;
  readonly passwordProtected: boolean;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly tags: { id: number; name: string }[];

  constructor(dto: FileItemDto) {
    this.id = dto.id;
    this.originalName = dto.originalName;
    this.size = dto.size;
    this.mimeType = dto.mimeType;
    this.shareToken = dto.shareToken;
    this.passwordProtected = dto.passwordProtected;
    this.expiresAt = new Date(dto.expiresAt);
    this.createdAt = new Date(dto.createdAt);
    this.tags = dto.tags;
  }

  /* IS EXPIRED */
  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  /* DAYS REMAINING */
  // negative = already expired
  daysRemaining(): number {
    const diff = this.expiresAt.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /* DISPLAY SIZE */
  displaySize(): string {
    return formatFileSize(this.size);
  }

  /* DISPLAY NAME */
  displayName(): string {
    return this.originalName;
  }

  /* FORMAT EXPIRY */
  // returns human-readable expiry label for display
  formatExpiry(): string {
    const days = this.daysRemaining();
    if (days < 0) return 'Expiré';
    if (days === 0) return "Expire aujourd'hui";
    if (days === 1) return 'Expire demain';
    return `Expire dans ${days} jours`;
  }
}
