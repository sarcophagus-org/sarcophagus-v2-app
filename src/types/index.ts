export interface ArweavePayload {
  file: Buffer;
  keyShares: Record<string, string>;
}

export type Address = `0x${string}`;
