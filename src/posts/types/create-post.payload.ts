export type CreatePostPayload = {
  title: string;
  description: string;
  userUuid: string;
  tags: string[];
  file?: UploadedFile;
};

export type UploadedFile = {
  dataBuffer: Buffer;
  fileName: string;
  mimeType: string;
};
