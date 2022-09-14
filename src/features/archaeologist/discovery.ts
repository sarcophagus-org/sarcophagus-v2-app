import { Libp2p } from 'libp2p';
import { Archaeologist } from 'types';
import { pipe } from 'it-pipe';
import { ethers } from 'ethers';

if (!process.env.REACT_APP_BOOTSTRAP_NODE_LIST) {
  throw Error('REACT_APP_BOOTSTRAP_NODE_LIST not set in .env');
}

if (!process.env.REACT_APP_SIGNAL_SERVER_LIST) {
  throw Error('REACT_APP_SIGNAL_SERVER_LIST not set in .env');
}

const discoveredPeers: Record<string, boolean> = {};
const discoveredArchs: Record<string, Archaeologist> = {}; // maps arch addresses to Archaeologist objects
const nodeConnections: Record<string, any> = {}; // maps peer ids to connections to them

export async function initialisePeerDiscovery(
  browserNode: Libp2p,
  storedArchaeologists: Archaeologist[],
  callbacks: {
    setArchs: (archs: Archaeologist[]) => void,
    onArchConnected: (arch: Archaeologist) => void,
  }
) {
  if (browserNode.isStarted()) return;

  const idTruncateLimit = 5;

  const nodeId = browserNode.peerId.toString();
  console.log(`starting browser node with id: ${nodeId.slice(nodeId.length - idTruncateLimit)}`);
  await browserNode.start();


  // Listen for new peers
  browserNode.addEventListener('peer:discovery', async (evt) => {
    const peerId = evt.detail.id;
    const peerIdStr = peerId.toString();

    if (!discoveredPeers[peerIdStr]) {
      discoveredPeers[peerIdStr] = true;
      console.log(`${nodeId.slice(nodeId.length - idTruncateLimit)} discovered: ${peerIdStr.slice(peerIdStr.length - idTruncateLimit)}`);

      const i = storedArchaeologists.findIndex(a => a.profile.peerId.toString() === peerIdStr);

      if (i !== -1) {
        storedArchaeologists[i].isOnline = true;
        storedArchaeologists[i].profile.peerId = peerId;
        callbacks.setArchs(storedArchaeologists);
      }

      // TODO: Update to dial a node only during arweave validation.
      await browserNode.dialProtocol(evt.detail.id, '/message');
    }
  });


  // Listen for peers connecting
  browserNode.connectionManager.addEventListener('peer:connect', async (evt) => {
    const peerId = evt.detail.remotePeer.toString();
    nodeConnections[peerId] = evt.detail;
    console.log(`Connection established to: ${peerId.slice(peerId.length - idTruncateLimit)}`);
  });

  browserNode.connectionManager.addEventListener('peer:disconnect', async (evt) => {
    const peerId = evt.detail.remotePeer;
    const peerIdStr = peerId.toString();

    discoveredPeers[peerIdStr] = false;
    console.log(`disconnected from: ${peerIdStr.slice(peerIdStr.length - idTruncateLimit)}`);

    const i = storedArchaeologists.findIndex(a => a.profile.peerId.toString() === peerIdStr);

    if (i !== -1) {
      storedArchaeologists[i].isOnline = false;
      callbacks.setArchs(storedArchaeologists);
    }
  });

  const msgProtocol = '/env-config';
  console.info(`listening to stream on protocol: ${msgProtocol}`);
  browserNode.handle([msgProtocol], ({ stream }) => {
    pipe(
      stream,
      async function (source) {
        for await (const msg of source) {
          const decoded = new TextDecoder().decode(msg);
          console.info(`received message ${decoded}`);

          const archConfigJson: Record<string, any> = JSON.parse(decoded);

          const signerAddress = ethers.utils.verifyMessage(JSON.stringify({
            encryptionPublicKey: archConfigJson.encryptionPublicKey,
            peerId: archConfigJson.peerId,
          }),
            archConfigJson.signature,
          );

          const i = storedArchaeologists.findIndex(a => a.profile.archAddress === signerAddress);

          if (i !== -1) {
            const arch = storedArchaeologists[i];
            if (arch.profile.peerId !== archConfigJson.peerId) {
              // This is POSSIBLE, but in practice shouldn't ever happen.
              // But that's how you know it'll DEFINITELY happen eh? Sigh.
              console.error('Peer ID mismatch'); // TODO: Handle this problem better. Relay feedback to user.
              return;
            }

            arch.publicKey = archConfigJson.encryptionPublicKey;
            callbacks.onArchConnected(arch);
          }
        }
      }
    ).finally(() => {
      // clean up resources
      stream.close();
    });
  });
}

export async function confirmArweaveTransaction(arg: { arch: Archaeologist, arweaveTxId: string, unencryptedShardHash: string }) {
  const { arch, arweaveTxId, unencryptedShardHash } = arg;
  try {
    const archConnection = discoveredArchs[arch.profile.archAddress].connection;

    if (!archConnection) throw new Error('No connection to archaeologist');

    const outboundMsg = JSON.stringify({
      arweaveTxId,
      unencryptedShardHash,
    });

    const { stream } = await archConnection.newStream('/validate-arweave');

    pipe(
      [new TextEncoder().encode(outboundMsg)],
      stream,
      async (source) => {
        for await (const data of source) {
          const dataStr = new TextDecoder().decode(data as BufferSource | undefined);
          console.log('dataStr', dataStr);
        }
      }
    );
  } catch (err) {
    console.error(`Error in peer conn listener: ${err}`);
  }
}
