import { describe, it, expect, beforeEach } from 'vitest';
import useFileStore from './fileStore';

const makeFile = (id: number) => ({
  id,
  originalName:      `file-${id}.txt`,
  size:              1024,
  mimeType:          'text/plain',
  shareToken:        `tok-${id}`,
  passwordProtected: false,
  expiresAt:         null,
  createdAt:         new Date().toISOString(),
  tags:              [],
});

const RESET = { files: [], uploadingFile: null };

beforeEach(() => {
  useFileStore.setState(RESET);
});

/* setFiles */
describe('fileStore -  setFiles()', () => {
  it('3.1.1 setFiles replaces entire list', () => {
    /* Arrange */
    const files = [makeFile(1), makeFile(2)];

    /* Act */
    useFileStore.getState().setFiles(files);

    /* Assert */
    expect(useFileStore.getState().files).toHaveLength(2);
    expect(useFileStore.getState().files[0].id).toBe(1);
  });
});

/* addFile */
describe('fileStore -  addFile()', () => {
  it('3.2.1 addFile appends to list', () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1)] });

    /* Act */
    useFileStore.getState().addFile(makeFile(2));

    /* Assert */
    expect(useFileStore.getState().files).toHaveLength(2);
    expect(useFileStore.getState().files[1].id).toBe(2);
  });
});

/* removeFile */
describe('fileStore -  removeFile()', () => {
  it('3.3.1 removeFile removes by id, keeps others', () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1), makeFile(2), makeFile(3)] });

    /* Act */
    useFileStore.getState().removeFile(2);

    /* Assert */
    const ids = useFileStore.getState().files.map((f) => f.id);
    expect(ids).not.toContain(2);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });
});

/* setUploadingFile / clearUploadingFile */
describe('fileStore -  uploadingFile', () => {
  it('3.4.1 setUploadingFile → state updated', () => {
    /* Arrange */
    const file = makeFile(10);

    /* Act */
    useFileStore.getState().setUploadingFile(file);

    /* Assert */
    expect(useFileStore.getState().uploadingFile).toEqual(file);
  });

  it('3.5.1 clearUploadingFile → uploadingFile null', () => {
    /* Arrange */
    useFileStore.setState({ uploadingFile: makeFile(10) });

    /* Act */
    useFileStore.getState().clearUploadingFile();

    /* Assert */
    expect(useFileStore.getState().uploadingFile).toBeNull();
  });
});
