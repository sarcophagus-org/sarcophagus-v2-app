// Sarcophagus toast messages
// All toast message parameters are defined in this file

import { UseToastOptions } from '@chakra-ui/react';
import { formatToastMessage } from './helpers';

const duration = 5000;
const position = 'bottom-right';

export const connectStart = (): UseToastOptions => ({
  title: 'Attempting to Connect',
  description: 'Attempting to connect to the Bundlr node...',
  status: 'info',
  duration,
  position,
});

export const connectSuccess = (): UseToastOptions => ({
  title: 'Connection Successful',
  description: 'Successfully connected to the Bundlr node',
  status: 'success',
  duration,
  position,
});

export const connectFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Failed to connect to Bundlr',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const disconnect = (): UseToastOptions => ({
  title: 'Disconnected',
  description: 'Disconnected from the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const fundStart = (): UseToastOptions => ({
  title: 'Funding...',
  description: 'Funding the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const fundSuccess = (): UseToastOptions => ({
  title: 'Successfully funded!',
  description: 'Bundlr node has been funded',
  status: 'success',
  duration,
  position,
});

export const fundFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Funding failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const withdrawStart = (): UseToastOptions => ({
  title: 'Withdrawing...',
  description: 'Withdrawing balance from the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const withdrawSuccess = (): UseToastOptions => ({
  title: 'Withdraw Successful!',
  description: 'Successfully withdrew funds from Bundrl node',
  status: 'success',
  duration,
  position,
});

export const withdrawFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Withdraw failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const uploadStart = (): UseToastOptions => ({
  title: 'Uploading...',
  description: 'Uploading file to the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const uploadSuccess = (): UseToastOptions => ({
  title: 'Upload Successful!',
  description: 'Successful uploaded file to Bundr node',
  status: 'success',
  duration,
  position,
});

export const uploadFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Upload failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const recoverPublicKeyFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Public Key Failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration: null,
  position,
});

export const recoverPublicKeyInvalidAddress = (): UseToastOptions => ({
  title: 'Invalid Address',
  description: 'Given input in not a valid etherum address',
  status: 'warning',
  duration,
  position,
});

export const recoverPublicKeySuccess = (): UseToastOptions => ({
  title: 'Recover Public Key Successful!',
  description: 'Successfully recovered public key from address',
  status: 'success',
  duration,
  position,
});

export const recoverPublicKeyNoTransactions = (): UseToastOptions => ({
  title: 'No Transactions',
  description: 'This address has no transaction in which to recover the pubilc key',
  status: 'warning',
  duration,
  position,
});
