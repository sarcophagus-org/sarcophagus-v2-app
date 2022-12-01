// Sarcophagus toast messages
// All toast message parameters are defined in this file

import { ToastProps } from 'components/SarcoToast';
import { maxFileSize } from 'lib/constants';
import prettyBytes from 'pretty-bytes';
import { formatToastMessage } from './helpers';

const duration = 5000;
const position = 'bottom-right';

export const infoSample = (): ToastProps => ({
  title: 'Toast message',
  description: 'This is some info',
  status: 'info',
  duration,
  position,
});

export const successSample = (): ToastProps => ({
  title: 'Toast message',
  description: 'This is a success',
  status: 'success',
  duration,
  position,
});

export const warningSample = (): ToastProps => ({
  title: 'Toast message',
  description: 'This is a warning',
  status: 'warning',
  duration,
  position,
});

export const errorSample = (): ToastProps => ({
  title: 'Toast message',
  description: 'This is an error',
  status: 'error',
  duration,
  position,
});

export const connectStart = (): ToastProps => ({
  title: 'Attempting to Connect',
  description: 'Attempting to connect to the Bundlr node...',
  status: 'info',
  duration,
  position,
});

export const connectSuccess = (): ToastProps => ({
  title: 'Connection Successful',
  description: 'Successfully connected to the Bundlr node',
  status: 'success',
  duration,
  position,
});

export const connectFailure = (errorMessage: string): ToastProps => ({
  title: 'Failed to connect to Bundlr',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const disconnect = (): ToastProps => ({
  title: 'Disconnected',
  description: 'Disconnected from the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const fundStart = (): ToastProps => ({
  title: 'Funding...',
  description: 'Funding the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const fundSuccess = (): ToastProps => ({
  title: 'Successful Bundlr fund transaction!',
  description:
    'Bundlr transaction is confirmed. It may take a few minutes for your Bundlr balance to update.',
  status: 'success',
  duration,
  position,
});

export const fundFailure = (errorMessage: string): ToastProps => ({
  title: 'Funding failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const withdrawStart = (): ToastProps => ({
  title: 'Withdrawing...',
  description: 'Withdrawing balance from the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const withdrawSuccess = (): ToastProps => ({
  title: 'Withdraw Successful!',
  description: 'Successfully withdrew funds from Bundlr node',
  status: 'success',
  duration,
  position,
});

export const withdrawFailure = (errorMessage: string): ToastProps => ({
  title: 'Withdraw failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const uploadStart = (): ToastProps => ({
  title: 'Uploading...',
  description: 'Uploading file to the Bundlr node',
  status: 'info',
  duration,
  position,
});

export const uploadSuccess = (): ToastProps => ({
  title: 'Upload Successful!',
  description: 'Successful uploaded file to Bundlr node',
  status: 'success',
  duration,
  position,
});

export const uploadFailure = (errorMessage: string): ToastProps => ({
  title: 'Upload failed',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const fileTooBig = (): ToastProps => ({
  title: 'File too big',
  description: `Your file size must not exceed ${prettyBytes(maxFileSize)}.`,
  status: 'error',
  duration,
  position,
});

export const payloadSaveSuccess = (): ToastProps => ({
  title: 'Payload saved',
  description: 'Your payload has been saved for a later step.',
  status: 'success',
  duration,
  position,
});

export const generateOuterKeys = (): ToastProps => ({
  title: 'Keys generated',
  description: 'A new pair of encryption keys have been generated.',
  status: 'success',
  duration,
  position,
});

export const generateOuterKeysFailure = (errorMessage: string): ToastProps => ({
  title: 'Failed to generate keys',
  description: formatToastMessage(errorMessage),
  status: 'error',
  duration,
  position,
});

export const dialArchaeologistSuccess = (): ToastProps => ({
  title: 'Connected Successfully!',
  description: 'Connected to archaeologist',
  status: 'success',
  duration,
  position,
});

export const dialArchaeologistFailure = (): ToastProps => ({
  title: 'Connection failed',
  description: 'Unable to connect to archaeologist',
  status: 'error',
  duration,
  position,
});

export const rewrapSuccess = (): ToastProps => ({
  title: 'Rewrap Successful!',
  description: 'Your sarcophagus was successfully rewrapped',
  status: 'success',
  duration,
  position,
});

export const rewrapFailure = (): ToastProps => ({
  title: 'Rewrap Failed.',
  description: 'Your sarcophagus was not rewrapped',
  status: 'error',
  duration,
  position,
});

export const burySuccess = (): ToastProps => ({
  title: 'Bury Successful.',
  description: 'Your sarcophagus was buried successfully',
  status: 'success',
  duration,
  position,
});

export const buryFailure = (): ToastProps => ({
  title: 'Bury Failed.',
  description: 'Your sarcophagus was not buried',
  status: 'error',
  duration,
  position,
});

export const cleanSuccess = (): ToastProps => ({
  title: 'Clean Successful.',
  description: 'Your sarcophagus was cleaned successfully',
  status: 'success',
  duration,
  position,
});

export const cleanFailure = (): ToastProps => ({
  title: 'Clean Failed.',
  description: 'The sarcophagus was not cleaned',
  status: 'error',
  duration,
  position,
});

export const publicKeyRetrieved = (): ToastProps => ({
  title: 'Public key successfully retrieved!',
  status: 'success',
  duration,
  position,
});
