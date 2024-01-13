import axios from 'axios';
import { BigNumber } from 'ethers';

export const getZeroExQuote = async (chainId: number, amount: BigNumber): Promise<any> => {
  try {
    const url = `https://api.encryptafile.com/quote?chainId=${chainId}&amount=${amount}`;
    const quoteResponse = await axios.get(url);
    return quoteResponse.data;
  } catch (e: any) {
    if (axios.isAxiosError(e) && e.response) {
      // Handle Axios-specific error
      // @ts-ignore
      throw Error(e.response?.data?.message || e.message);
    } else {
      // Handle generic errors
      throw Error(e.message);
    }
  }
};