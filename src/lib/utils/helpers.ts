import { decrypt as eciesDecrypt, encrypt as eciesEncrypt } from 'ecies-geth';
import { BigNumber, ethers, Signature, Signer } from 'ethers';
import moment from 'moment';

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
 * @returns Object with params:
 *
 *  - `type` - file type descriptor string formatted as `"data:<file-type>/<file-ext>;base64"`
 *
 *  - `data` - file data formatted as a base64 string
 */
export function readFileDataAsBase64(file: File): Promise<{ type: string; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      // format of `res` is:
      // "data:image/png;base64,iVBORw0KGg..."
      const res = event.target?.result as string;
      if (!res.startsWith('data:')) {
        reject('There was a problem reading the file');
      }

      const i = res.indexOf(',');

      resolve({
        type: res.slice(0, i),
        data: Buffer.from(res.slice(i + 1), 'base64'),
      });
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

/**
 * Split an array into two arrays based on the result of a predicate function
 */
export const filterSplit = <T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const trueArray: T[] = [];
  const falseArray: T[] = [];
  arr.forEach(item => {
    if (predicate(item)) {
      trueArray.push(item);
    } else {
      falseArray.push(item);
    }
  });
  return [trueArray, falseArray];
};

export function humanizeUnixTimestamp(unixTimestamp: number): string {
  return new Date(unixTimestamp).toLocaleDateString();
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
  return eciesEncrypt(Buffer.from(ethers.utils.arrayify(publicKey)), payload);
}

export async function decrypt(privateKey: string, payload: Buffer): Promise<Buffer> {
  return eciesDecrypt(Buffer.from(ethers.utils.arrayify(privateKey)), payload);
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
 * Builds a resurrection date string from a BigNumber
 * Ex: 09.22.2022 7:30pm (12 Days)
 * @param resurrectionTime
 * @returns The resurrection string
 */
export function buildResurrectionDateString(
  resurrectionTime: BigNumber | undefined,
  timestampMs: number,
  options?: { format?: string; hideDuration?: boolean }
): string {
  const { format = 'MM.DD.YYYY h:mmA', hideDuration = false } = options || {};

  // In the case where sarcophagus resurrection time is not defined for whatever reason
  if (!resurrectionTime) {
    return '--';
  }

  // In the case where the sarcophagus is buried, the resurrection time will be set to the max
  // uint256 value. It's not possible to display this number as a date.
  if (resurrectionTime.toString() === ethers.constants.MaxUint256.toString()) {
    return '--';
  }

  const resurrectionDateString = moment.unix(resurrectionTime.toNumber()).format(format);
  const msUntilResurrection = resurrectionTime.toNumber() * 1000 - timestampMs;
  const humanizedDuration = moment.duration(msUntilResurrection).humanize();
  const timeUntilResurrection =
    msUntilResurrection < 0 ? `${humanizedDuration} ago` : humanizedDuration;
  return hideDuration
    ? resurrectionDateString
    : `${resurrectionDateString} (${timeUntilResurrection})`;
}

export function isBytes32(value: string): boolean {
  if (value.startsWith('0x')) {
    return value.length === 66 && /^[0-9a-fA-F]+$/.test(value.slice(2));
  } else {
    return value.length === 64 && /^[0-9a-fA-F]+$/.test(value);
  }
}

export const flat = (data: string | string[]): string[] => {
  return data instanceof Array ? data : [data];
};

export async function sign(
  signer: Signer,
  message: string | string[],
  type: string | string[]
): Promise<Signature> {
  const dataHex = ethers.utils.defaultAbiCoder.encode(flat(type), flat(message));
  const dataHash = ethers.utils.keccak256(dataHex);
  const dataHashBytes = ethers.utils.arrayify(dataHash);
  const signature = await signer.signMessage(dataHashBytes);
  return ethers.utils.splitSignature(signature);
}

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
