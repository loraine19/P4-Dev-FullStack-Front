import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UploadButton from './UploadButton';
import useFileStore from '../../../stores/fileStore';
import { ERROR_MESSAGES } from '../../../constants/error-messages';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

import { useNavigate } from 'react-router-dom';

/* FACTORIES */
const makeFile = (name: string, size: number, type = 'application/octet-stream') =>
  Object.defineProperty(new File(['x'], name, { type }), 'size', { value: size });

const renderBtn = () => render(<MemoryRouter><UploadButton /></MemoryRouter>);

/* UPLOAD BUTTON */
describe('UploadButton', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useFileStore.setState({ uploadingFile: null });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  /* 1 */
  it('1 renders upload button', () => {
    /* Arrange & Act */
    renderBtn();
    /* Assert */
    expect(screen.getByRole('button', { name: /choisir un fichier/i })).toBeInTheDocument();
  });

  /* 2 */
  it('2 shows error on forbidden extension', () => {
    /* Arrange */
    renderBtn();
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    const badFile = makeFile('virus.exe', 1024);

    /* Act */
    fireEvent.change(input, { target: { files: [badFile] } });

    /* Assert */
    expect(screen.getByRole('alert')).toHaveTextContent('.exe');
  });

  /* 3 */
  it('3 shows error when file exceeds max size', () => {
    /* Arrange */
    renderBtn();
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    const bigFile = makeFile('huge.pdf', 2 * 1024 * 1024 * 1024, 'application/pdf');

    /* Act */
    fireEvent.change(input, { target: { files: [bigFile] } });

    /* Assert */
    expect(screen.getByRole('alert')).toHaveTextContent(ERROR_MESSAGES.UPLOAD.FILE_TOO_LARGE);
  });

  /* 4 */
  it('4 navigates to /upload on valid file', () => {
    /* Arrange */
    renderBtn();
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    const validFile = makeFile('document.pdf', 1024, 'application/pdf');

    /* Act */
    fireEvent.change(input, { target: { files: [validFile] } });

    /* Assert */
    expect(mockNavigate).toHaveBeenCalledWith('/upload');
    expect(useFileStore.getState().uploadingFile?.file).toBe(validFile);
    expect(useFileStore.getState().uploadingFile?.name).toBe('document.pdf');
  });
});
