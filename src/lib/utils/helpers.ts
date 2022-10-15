import moment from 'moment';
import { encrypt as eciesEncrypt } from 'ecies-geth';
import { ethers } from 'ethers';
import { hexlify, solidityKeccak256 } from 'ethers/lib/utils';

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

/**
 * Async sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// Approximately 1 month
export function convertMonthsToMs(num: number) {
  return num * 2_629_746_000;
}

export function convertWeeksToMs(num: number) {
  return num * 604_800_000;
}

export function convertDaysToMs(num: number) {
  return num * 86_400_000;
}

export function convertHoursToMs(num: number) {
  return num * 3_600_000;
}

export function convertMinutesToMs(num: number) {
  return num * 60_000;
}

export function humanizeDuration(duration: number) {
  if (duration === 0) return '0 seconds';
  return moment.duration(duration / 1000).humanize({ d: 7, w: 4 });
}

export function formatLargeNumber(num: string): string {
  if (num.length > 9) {
    return parseInt(num).toExponential(4);
  } else if (num.length <= 9 && num.length > 4) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return num;
  }
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

export function zeroIfEmpty(value: string): string {
  return value.trim() === '' ? '0' : value;
}

/**
 * Generates a fake eth address. This address will be invalid, it's just for the mock archaeologist.
 */
export function generateFakeAddress(): string {
  return '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * Generates a random number between min and max.
 */
export function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
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

export function doubleHashShard(shard: Uint8Array): string {
  if (shard) {
    const unencryptedHash = solidityKeccak256(['string'], [hexlify(shard)]);
    const unencryptedDoubleHash = solidityKeccak256(['string'], [unencryptedHash]);
    return unencryptedDoubleHash;
  } else {
    return '';
  }
}
