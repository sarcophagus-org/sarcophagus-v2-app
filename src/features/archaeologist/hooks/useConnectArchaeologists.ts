import { Archaeologist } from '../../../types';

import { PeerId } from '@libp2p/interfaces/peer-id';
import { Libp2p } from 'libp2p';

export async function connectArchaeologists(selectedArchaeologists: Archaeologist[], browserNode: Libp2p) {
  try {

    selectedArchaeologists.forEach(a => {
      console.log('a.profile.peerId', a.profile.peerId);

      browserNode.dialProtocol(a.profile.peerId as PeerId, '/message');
    });

  } catch (error) {
    // TODO: Implement better error handling
    console.error(error);
  }
}
