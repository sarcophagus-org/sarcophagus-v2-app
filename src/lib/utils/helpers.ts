import { decrypt as eciesDecrypt, encrypt as eciesEncrypt } from 'ecies-geth';
import { BigNumber, ethers, Signature, Signer } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
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
 * Returns the smallest maximumResurrectionTime value
 * from the profiles of the archaeologists provided
 */
export function getLowestResurrectionTime(archaeologists: Archaeologist[]): number {
  return Math.min(
    ...archaeologists.map(arch => {
      return Number(arch.profile.maximumResurrectionTime);
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
 * @param diggingFeeRates An array of the archaeologist's digging fees per second rates
 * @param resurrectionTimestamp The timestamp of the resurrection in ms
 * @returns The total projected digging fees as a string
 */
export function calculateProjectedDiggingFees(
  diggingFeeRates: BigNumber[],
  resurrectionTimestamp: number
): BigNumber {
  if (resurrectionTimestamp === 0) return ethers.constants.Zero;
  const totalDiggingFeesPerSecond = diggingFeeRates.reduce(
    (acc, curr) => acc.add(curr),
    ethers.constants.Zero
  );

  const resurrectionSeconds = Math.floor(resurrectionTimestamp / 1000);
  const nowSeconds = Math.floor(Date.now() / 1000);

  return totalDiggingFeesPerSecond.mul(resurrectionSeconds - nowSeconds);
}

/**
 * Reduces the number of decimals displayed for sarco value (or any float). If the value is a whole
 * number, decimals will be hidden. If a precision of 2 is set and the value is 0.0000452, then
 * "< 0.01" will be returned.
 *
 * @param valueInWei The value to be formateed
 * @param precision The number of decimal places to show
 * @returns A formatted value
 */
export function formatSarco(valueInWei: string | number, precision: number = 2): string {
  const value = formatEther(valueInWei.toString());
  const numericValue: number = Number(value);
  if (isNaN(numericValue)) {
    return value.toString();
  }
  const formattedValue: string = numericValue.toFixed(precision).replace(/\.?0*$/, '');

  if (formattedValue === '0' && parseFloat(value) > 0) {
    return `< 0.${'0'.repeat(precision - 1)}1`;
  }

  return formattedValue;
}

/**
 * Returns the estimated total digging fees, and protocol fee,
 * that the embalmer will be due to pay.
 */
export function getTotalFeesInSarco(
  resurrectionTimestamp: number,
  archaeologists: Archaeologist[],
  protocolFeeBasePercentage?: number
) {
  const totalDiggingFees = calculateProjectedDiggingFees(
    archaeologists.map(a => a.profile.minimumDiggingFeePerSecond),
    resurrectionTimestamp
  );

  // protocolFeeBasePercentage is pulled from the chain, temp show 0 until it loads
  const protocolFee = protocolFeeBasePercentage
    ? totalDiggingFees.div(BigNumber.from(100 * protocolFeeBasePercentage))
    : ethers.constants.Zero;

  return {
    totalDiggingFees,
    formattedTotalDiggingFees: formatSarco(totalDiggingFees.toString()),
    protocolFee,
  };
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
  // In the case where the sarcophagus is buried, the resurrection time will be set to the max
  // uint256 value. It's not possible to display this number as a date.
  if (resurrectionTime.toString() === ethers.constants.MaxUint256.toString()) {
    return '--';
  }

  const resurrectionDateString = moment.unix(resurrectionTime.toNumber()).format(format);
  const msUntilResurrection = resurrectionTime.toNumber() * 1000 - Date.now();
  const humanizedDuration = moment.duration(msUntilResurrection).humanize();
  const timeUntilResurrection =
    msUntilResurrection < 0 ? `${humanizedDuration} ago` : humanizedDuration;
  return `${resurrectionDateString} (${timeUntilResurrection})`;
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

// This function estimates sarco per month based on average number of days per month. This value is
// only used to display to the user, never as an argument to the smart contracts.
export function convertSarcoPerSecondToPerMonth(diggingFeePerSecond: string): string {
  const averageNumberOfSecondsPerMonth = 2628288;
  return BigNumber.from(diggingFeePerSecond).mul(averageNumberOfSecondsPerMonth).toString();
}
