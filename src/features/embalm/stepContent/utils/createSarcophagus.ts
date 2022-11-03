import { ArchaeologistEncryptedShard } from '../../../../types';
import { ethers } from 'ethers';
import { doubleHashShard, encrypt } from '../../../../lib/utils/helpers';

export async function encryptShards(
  publicKeys: string[],
  payload: Uint8Array[]
): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(
    publicKeys.map(async (publicKey, i) => ({
      publicKey,
      encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
      unencryptedShardDoubleHash: doubleHashShard(payload[i])
    }))
  );
}