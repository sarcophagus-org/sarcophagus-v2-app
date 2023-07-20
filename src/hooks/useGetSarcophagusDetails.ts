import { useEffect, useState } from 'react';
import { SarcophagusDetails, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function useGetSarcophagusDetails(sarcoId: string | undefined) {
  const [sarcophagus, setSarcophagus] = useState<SarcophagusDetails>();
  const [loadingSarcophagus, setLoadingSarcophagus] = useState<any>();

  useEffect(() => {
    if (!sarcoId) return;

    setLoadingSarcophagus(true);
    sarco.api.getSarcophagusDetails(sarcoId || '').then(res => {
      setSarcophagus(res);
      setLoadingSarcophagus(false);
    });
  }, [sarcoId]);

  return { sarcophagus, loadingSarcophagus };
}
