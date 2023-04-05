// Sarcophagus toast messages
// All toast message parameters are defined in this file

import { UseToastOptions } from '@chakra-ui/react';
import { maxFileSize } from 'lib/constants';
import prettyBytes from 'pretty-bytes';
import { formatToastMessage } from './helpers';

const defaultOptions: Partial<UseToastOptions> = {
  duration: 5000,
  isClosable: true,
  position: 'bottom-right',
};

export const infoSample = (): UseToastOptions => ({
  title: 'Toast message',
  description: 'This is some info',
  status: 'info',
  ...defaultOptions,
});

export const successSample = (): UseToastOptions => ({
  title: 'Toast message',
  description: 'This is a success',
  status: 'success',
  ...defaultOptions,
});

export const warningSample = (): UseToastOptions => ({
  title: 'Toast message',
  description: 'This is a warning',
  status: 'warning',
  ...defaultOptions,
});

export const errorSample = (): UseToastOptions => ({
  title: 'Toast message',
  description: 'This is an error',
  status: 'error',
  ...defaultOptions,
});

export const loadArchStatsError = (): UseToastOptions => ({
  title: 'Error loading archaeologists',
  description: 'Unable to load archaeologist statistics',
  status: 'error',
  ...defaultOptions,
});

export const connectStart = (): UseToastOptions => ({
  title: 'Attempting to Connect',
  description: 'Attempting to connect to the Bundlr node...',
  status: 'info',
  ...defaultOptions,
});

export const connectSuccess = (): UseToastOptions => ({
  title: 'Connection Successful',
  description: 'Successfully connected to the Bundlr node',
  status: 'success',
  ...defaultOptions,
});

export const connectFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Failed to connect to Bundlr',
  description: formatToastMessage(errorMessage),
  status: 'error',
  ...defaultOptions,
});

export const disconnect = (): UseToastOptions => ({
  title: 'Disconnected',
  description: 'Disconnected from the Bundlr node',
  status: 'info',
  ...defaultOptions,
});

export const fundStart = (): UseToastOptions => ({
  title: 'Funding...',
  description: 'Funding the Bundlr node',
  status: 'info',
  ...defaultOptions,
});

export const fundSuccess = (): UseToastOptions => ({
  title: 'Successful Bundlr fund transaction!',
  description:
    'Bundlr transaction is confirmed. It may take a few minutes for your Bundlr balance to update.',
  status: 'success',
  ...defaultOptions,
});

export const fundFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Funding failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  ...defaultOptions,
});

export const withdrawStart = (): UseToastOptions => ({
  title: 'Withdrawing...',
  description: 'Withdrawing balance from the Bundlr node',
  status: 'info',
  ...defaultOptions,
});

export const withdrawSuccess = (): UseToastOptions => ({
  title: 'Withdraw Successful!',
  description: 'Successfully withdrew funds from Bundlr node',
  status: 'success',
  ...defaultOptions,
});

export const withdrawFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Withdraw failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  ...defaultOptions,
});

export const uploadStart = (): UseToastOptions => ({
  title: 'Uploading...',
  description: 'Uploading file to the Bundlr node',
  status: 'info',
  ...defaultOptions,
});

export const uploadSuccess = (): UseToastOptions => ({
  title: 'Upload Successful!',
  description: 'Successful uploaded file to Bundlr node',
  status: 'success',
  ...defaultOptions,
});

export const uploadFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Upload failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  ...defaultOptions,
});

export const fileTooBig = (): UseToastOptions => ({
  title: 'File too big',
  description: `Your file size must not exceed ${prettyBytes(maxFileSize)}.`,
  status: 'error',
  ...defaultOptions,
});

export const payloadSaveSuccess = (): UseToastOptions => ({
  title: 'Payload saved',
  description: 'Your payload has been saved for a later step.',
  status: 'success',
  ...defaultOptions,
});

export const generateOuterKeys = (): UseToastOptions => ({
  title: 'Keys generated',
  description: 'A new pair of encryption keys have been generated.',
  status: 'success',
  ...defaultOptions,
});

export const generateOuterKeysFailure = (errorMessage: string): UseToastOptions => ({
  title: 'Failed to generate keys',
  description: formatToastMessage(errorMessage),
  status: 'error',
  ...defaultOptions,
});

export const dialArchaeologistSuccess = (): UseToastOptions => ({
  title: 'Connected Successfully!',
  description: 'Connected to archaeologist',
  status: 'success',
  ...defaultOptions,
});

export const dialArchaeologistFailure = (): UseToastOptions => ({
  title: 'Connection failed',
  description: 'Unable to connect to archaeologist',
  status: 'error',
  ...defaultOptions,
});

export const rewrapSuccess = (): UseToastOptions => ({
  title: 'Rewrap Successful!',
  description: 'Your sarcophagus was successfully rewrapped',
  status: 'success',
  ...defaultOptions,
});

export const rewrapFailure = (): UseToastOptions => ({
  title: 'Rewrap Failed.',
  description: 'Your sarcophagus was not rewrapped',
  status: 'error',
  ...defaultOptions,
});

export const burySuccess = (): UseToastOptions => ({
  title: 'Bury Successful.',
  description: 'Your sarcophagus was buried successfully',
  status: 'success',
  ...defaultOptions,
});

export const buryFailure = (): UseToastOptions => ({
  title: 'Bury Failed.',
  description: 'Your sarcophagus was not buried',
  status: 'error',
  ...defaultOptions,
});

export const cleanSuccess = (): UseToastOptions => ({
  title: 'Clean Successful.',
  description: 'Your sarcophagus was cleaned successfully',
  status: 'success',
  ...defaultOptions,
});

export const cleanFailure = (): UseToastOptions => ({
  title: 'Clean Failed.',
  description: 'The sarcophagus was not cleaned',
  status: 'error',
  ...defaultOptions,
});

export const publicKeyRetrieved = (): UseToastOptions => ({
  title: 'Public key successfully retrieved!',
  status: 'success',
  ...defaultOptions,
});

export const accuseSuccess = (): UseToastOptions => ({
  title: 'Accuse Successful.',
  description: 'You successfully accused an archaeologist',
  status: 'success',
  ...defaultOptions,
});

export const accuseFailure = (): UseToastOptions => ({
  title: 'Accuse Failed.',
  description: 'The archaeologist was not accused',
  status: 'error',
  ...defaultOptions,
});
