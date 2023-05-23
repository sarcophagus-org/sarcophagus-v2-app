import { useEffect, useState } from 'react';
import { SarcophagusDetails, sarco } from 'sarcophagus-v2-sdk';

export function useGetSarcophagusDetails(sarcoId: string | undefined) {
    console.log('useGetSarcophagusDetails');
    
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
