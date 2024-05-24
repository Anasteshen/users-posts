export type UpdatePostPayload = {
  id: number;
  title?: string;
  description?: string;
  tags?: string[];
  userUuid: string;
};
