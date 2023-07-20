import { useCallback, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

/**
 * Hook that handles resurrection of a sarcohpagus
 * @param sarcoId The sarcohpagus id
 * @param recipientPrivateKey The recipients private key
 */
export function useResurrection(sarcoId: string, recipientPrivateKey: string) {
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  /**
   * Resurrects the sarcohpagus using the values passed in to the hook
   */
  const resurrect = useCallback(async (): Promise<{
    fileName: string;
    data: string;
    error?: string;
  }> => {
    setIsResurrecting(true);
    try {
      return await sarco.api.claimSarcophagus(sarcoId, recipientPrivateKey, progress =>
        setDownloadProgress(progress * 100)
      );
    } catch (error) {
      console.error(`Error resurrecting sarcophagus: ${error}`);
      return {
        fileName: '',
        data: '',
        error: 'Could not claim Sarcophagus. Please make sure you have the right private key.',
      };
    } finally {
      setIsResurrecting(false);
      setDownloadProgress(0);
    }
  }, [sarcoId, recipientPrivateKey]);

  return { resurrect, isResurrecting, downloadProgress };
}
