import { decrypt as eciesDecrypt, encrypt as eciesEncrypt } from 'ecies-geth';
import { BigNumber, ethers } from 'ethers';
import { formatEther, keccak256 } from 'ethers/lib/utils';
import moment from 'moment';
import { Archaeologist } from 'types';

/**
 * Returns the smallest maximumRewrapInterval value
 * from the profiles of the archaeologists provided
 */
export function getLowestRewrapInterval(archaeologists: Archaeologist[]): number {
  return Math.min(
    ...archaeologists.map(arch => {
      return Number(arch.profile.maximumRewrapInterval);
    })
  );
}

/**
 * Formats an address into a more readable format
 * Replaces the middle with "..." and uppercases it
 * @param address The address to format
 * @returns The formatted address
 */
export function formatAddress(address: string): string {
  const sliced = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return sliced.replace(/[a-z]/g, char => char.toUpperCase());
}

export function formatToastMessage(message: string, length: number = 125): string {
  return message.length > length ? message.slice(0, length) + '...' : message;
}

/**
 * Returns base64 data of a given File object
 * @param file The File object
 * @returns Base64 data as a buffer
 */
export function readFileDataAsBase64(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      resolve(event.target?.result as Buffer);
    };

    reader.onerror = err => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Remove an item from an array
 */
export function removeFromArray<T>(array: T[], value: T) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function humanizeUnixTimestamp(unixTimestamp: number): string {
  return new Date(unixTimestamp).toLocaleDateString('en-US');
}

export function removeNonIntChars(value: string): string {
  return value.replace(/[-\.\+e]/g, '').trim();
}

export function removeLeadingZeroes(value: string): string {
  while (value.charAt(0) === '0' && value.charAt(1) !== '') {
    value = value.substring(1);
  }
  return value;
}

/**
 * Encrypts a payload given a public key
 * @param publicKey The public key to encrypt the payload with
 * @param payload The payload to encrypt
 * @returns The encrypted payload
 */
export async function encrypt(publicKey: string, payload: Buffer): Promise<Buffer> {
  return eciesEncrypt(Buffer.from(ethers.utils.arrayify(publicKey)), Buffer.from(payload));
}

export async function decrypt(privateKey: string, payload: Buffer): Promise<Buffer> {
  return eciesDecrypt(Buffer.from(ethers.utils.arrayify(privateKey)), payload);
}

export function doubleHashShard(shard: Uint8Array): string {
  if (shard) {
    return keccak256(keccak256(Buffer.from(shard)));
  } else {
    return '';
  }
}

export function formatFee(value: number | string, fixed = 2): string {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (fixed <= 0) return '0';

  if (value === 0) {
    return '0';
  } else if (value > 0 && value < 1 / 10 ** fixed) {
    return `< 0.${'0'.repeat(fixed - 1)}1`;
  } else {
    return value % 1 === 0 ? value.toString() : value.toFixed(fixed);
  }
}

/**
 * Given a list of archaeologists, sums up their digging fees
 */
export function sumDiggingFees(archaeologists: Archaeologist[]): BigNumber {
  return archaeologists.reduce(
    (acc, curr) => acc.add(parseInt(formatEther(curr.profile.minimumDiggingFee))),
    ethers.constants.Zero
  );
}

/**
 * Builds a resurrection date string from a BigNumber
 * Ex: 09.22.2022 7:30pm (12 Days)
 * @param resurrectionTime
 * @returns The resurrection string
 */
export function buildResurrectionDateString(
  resurrectionTime: BigNumber,
  format = 'MM.DD.YYYY h:mmA'
): string {
  const resurrectionDateString = moment.unix(resurrectionTime.toNumber()).format(format);
  const msUntilResurrection = resurrectionTime.toNumber() * 1000 - Date.now();
  const humanizedDuration = moment.duration(msUntilResurrection).humanize();
  const timeUntilResurrection =
    msUntilResurrection < 0 ? `-${humanizedDuration}` : humanizedDuration;
  return `${resurrectionDateString} (${timeUntilResurrection})`;
}
