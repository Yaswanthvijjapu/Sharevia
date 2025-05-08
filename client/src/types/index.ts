export interface File {
    _id: string;
    path: string;
    name: string;
    type: string;
    size: number;
    user: string | null;
    downloadCount: number;
    uniqueId: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    shareUrl: string;
  }