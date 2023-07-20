import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { useEffect, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export const useSarcophagusCount = () => {
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    activeSarcophagi: 0,
    inactiveSarcophagi: 0,
    totalSarcophagi: 0,
  });

  const { isSarcoInitialized } = useSupportedNetwork();

  useEffect(() => {
    if (!isSarcoInitialized) return;

    setLoading(true);
    sarco.api.getSarcophagiCount().then(res => {
      setCounts({ ...res, totalSarcophagi: res.activeSarcophagi + res.inactiveSarcophagi });
      setLoading(false);
    });
  }, [isSarcoInitialized]);

  return { counts, loading };
};
