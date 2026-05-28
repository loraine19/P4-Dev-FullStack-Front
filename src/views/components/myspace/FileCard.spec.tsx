import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@project-lary/react-material-symbols', () => ({
  Description: () => null,
  Lock: () => null,
  MoreVert: () => null,
}));

import FileCard from './FileCard';
import type { FileItem } from '../../../types/file.types';

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

const makeFile = (overrides: Partial<FileItem> = {}): FileItem => ({
  id: 1,
  originalName: 'rapport.pdf',
  shareToken: 'tok123',
  expiresAt: FUTURE,
  passwordProtected: false,
  tags: [],
  size: 1024,
  ...overrides,
});

describe('FileCard', () => {
  it('26.1 affiche le nom du fichier', () => {
    /* Arrange / Act */
    render(
      <FileCard file={makeFile()} expiryText="Expire dans 7 jours" onDelete={vi.fn()} onDownload={vi.fn()} />,
    );

    /* Assert */
    expect(screen.getByText('rapport.pdf')).toBeInTheDocument();
  });

  it('26.2 affiche le texte d\'expiration', () => {
    /* Arrange / Act */
    render(
      <FileCard file={makeFile()} expiryText="Expire dans 7 jours" onDelete={vi.fn()} onDownload={vi.fn()} />,
    );

    /* Assert */
    expect(screen.getByText('Expire dans 7 jours')).toBeInTheDocument();
  });

  it('26.3 affiche l\'icône lock si passwordProtected=true', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ passwordProtected: true })}
        expiryText="Expire dans 7 jours"
        onDelete={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    /* Assert */
    expect(screen.getByLabelText('Fichier protégé')).toBeInTheDocument();
  });

  it('26.4 n\'affiche pas l\'icône lock si passwordProtected=false', () => {
    /* Arrange / Act */
    render(
      <FileCard file={makeFile()} expiryText="Expire dans 7 jours" onDelete={vi.fn()} onDownload={vi.fn()} />,
    );

    /* Assert */
    expect(screen.queryByLabelText('Fichier protégé')).not.toBeInTheDocument();
  });

  it('26.5 affiche les tags dans la chip-row', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ tags: [{ id: 1, name: 'backend' }, { id: 2, name: 'ts' }] })}
        expiryText="Expire dans 7 jours"
        onDelete={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    /* Assert */
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('ts')).toBeInTheDocument();
  });

  it('26.6 n\'affiche pas de menu contextuel si le fichier est expiré', () => {
    /* Arrange / Act */
    render(
      <FileCard
        file={makeFile({ expiresAt: PAST })}
        expiryText="Expiré"
        onDelete={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    /* Assert */
    expect(screen.queryByRole('button', { name: 'Options' })).not.toBeInTheDocument();
  });
});
