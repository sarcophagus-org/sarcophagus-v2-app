import { sarco } from 'sarcophagus-v2-sdk';

// Web worker that creates a wallet without disrupting the screen render
// Although it only takes about 250ms to create a wallet on average, the blip is noticeable
// and leads to a bad user experience, especially if useEffect triggers multiple times.
self.onmessage = () => self.postMessage(sarco.utils.generateKeyPair());
