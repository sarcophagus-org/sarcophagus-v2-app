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

export const uploadStart = (): UseToastOptions => ({
  title: 'Uploading...',
  description: 'Uploading file to Arweave',
  status: 'info',
  ...defaultOptions,
});

export const uploadSuccess = (): UseToastOptions => ({
  title: 'Upload Successful!',
  description: 'Successfully uploaded file!',
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

export const approveSuccess = (): UseToastOptions => ({
  title: 'Approve Successful.',
  status: 'success',
  ...defaultOptions,
});

export const approveFailure = (): UseToastOptions => ({
  title: 'Approve Failed.',
  status: 'error',
  ...defaultOptions,
});
