import QRCode, { QRCodeToDataURLOptions } from 'qrcode';
import { useEffect, useState } from 'react';

export const useQRCode = (value: string) => {
  const [dataURL, setDataURL] = useState<string>();
  useEffect(() => {
    QRCode.toDataURL(value).then(setDataURL);
  }, [value]);
  return dataURL;
};
