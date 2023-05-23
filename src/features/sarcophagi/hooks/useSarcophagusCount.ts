import { useEffect, useState } from 'react';
import { sarco } from 'sarcophagus-v2-sdk';

export const useSarcophagusCount = () => {
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    activeSarcophagi: 0,
    inactiveSarcophagi: 0,
    totalSarcophagi: 0,
  });

  useEffect(() => {
    if (!sarco.isInitialised) return;

    setLoading(true);
    sarco.api.getSarcophagiCount().then(res => {
      setCounts({ ...res, totalSarcophagi: res.activeSarcophagi + res.inactiveSarcophagi });
      setLoading(false);
    });
  }, [sarco.isInitialised]);

  return { counts, loading };
};
