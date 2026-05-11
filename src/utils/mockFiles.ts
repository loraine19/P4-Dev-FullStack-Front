/* FILE STATUS CONSTANTS */
export const FILE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
} as const;

export type TFileStatus = (typeof FILE_STATUS)[keyof typeof FILE_STATUS];

/* FILE INTERFACE */
export interface IFile {
  id: string;
  name: string;
  size: number;
  expiresAt: Date;
  status: TFileStatus;
  protectedFile: boolean;
}

/* MOCK FILES DATA */
const generateMockFiles = (): IFile[] => {
  const now = new Date();
  const files: IFile[] = [
    {
      id: '1',
      name: 'IMG_9210_1231231313.jpg',
      size: 2450000,
      expiresAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: FILE_STATUS.ACTIVE,
      protectedFile: true,
    },
    {
      id: '2',
      name: 'composition2.mp3',
      size: 8900000,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      status: FILE_STATUS.ACTIVE,
      protectedFile: false,
    },
    {
      id: '3',
      name: 'vacances_ardeche.mp4',
      size: 450000000,
      expiresAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      status: FILE_STATUS.EXPIRED,
      protectedFile: true,
    },
    {
      id: '4',
      name: 'presentation_q1_2025.pdf',
      size: 5700000,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: FILE_STATUS.ACTIVE,
      protectedFile: false,
    },
    {
      id: '5',
      name: 'rapport_annuel_2024.xlsx',
      size: 3200000,
      expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: FILE_STATUS.EXPIRED,
      protectedFile: true,
    },
  ];

  return files;
};

export default generateMockFiles;
