import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import FileCard from './FileCard';
import type { FileItemDto } from '../../../types/file.types';

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

const makeFile = (overrides: Partial<FileItemDto> = {}): FileItemDto => ({
  id: 1,
  originalName: 'rapport.pdf',
  shareToken: 'tok123',
  expiresAt: FUTURE,
  mimeType: 'application/pdf',
  passwordProtected: false,
  tags: [],
  size: 1024,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const baseHandlers = {
  onDelete: vi.fn(),
  onDownload: vi.fn(),
  onCopyLink: vi.fn(),
};

describe('FileCard', () => {
  it('26.1 renders file name', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile()}
        isExpired={false}
        expiryText="Expire dans 7 jours"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.getByText('rapport.pdf')).toBeInTheDocument();
  });

  it('26.2 renders expiration text', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile()}
        isExpired={false}
        expiryText="Expire dans 7 jours"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.getByText('Expire dans 7 jours')).toBeInTheDocument();
  });

  it('26.3 renders lock icon when passwordProtected=true', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ passwordProtected: true })}
        isExpired={false}
        expiryText="Expire dans 7 jours"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.getByLabelText('Fichier protégé')).toBeInTheDocument();
  });

  it('26.4 hides lock icon when passwordProtected=false', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile()}
        isExpired={false}
        expiryText="Expire dans 7 jours"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.queryByLabelText('Fichier protégé')).not.toBeInTheDocument();
  });

  it('26.5 renders tags in chip-row', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ tags: [{ id: 1, name: 'backend' }, { id: 2, name: 'ts' }] })}
        isExpired={false}
        expiryText="Expire dans 7 jours"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('ts')).toBeInTheDocument();
  });

  it('26.6 hides context menu when file expired', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ expiresAt: PAST })}
        isExpired
        expiryText="Expiré"
        {...baseHandlers}
      />,
    );
    /* Assert */
    expect(screen.queryByRole('button', { name: 'Options' })).not.toBeInTheDocument();
  });
});
