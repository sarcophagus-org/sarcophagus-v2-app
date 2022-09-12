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

export async function initialisePeerDiscovery(browserNode: Libp2p, setArchs: (archs: Archaeologist[]) => void) {
  if (browserNode.isStarted()) return;

  const idTruncateLimit = 5;

  const nodeId = browserNode.peerId.toString();
  console.log(`starting browser node with id: ${nodeId.slice(nodeId.length - idTruncateLimit)}`);
  await browserNode.start();


  // Listen for new peers
  browserNode.addEventListener('peer:discovery', async (evt) => {
    const peerId = evt.detail.id.toString();

    if (!discoveredPeers[peerId]) {
      discoveredPeers[peerId] = true;
      console.log(`${nodeId.slice(nodeId.length - idTruncateLimit)} discovered: ${peerId.slice(peerId.length - idTruncateLimit)}`);

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
    const peerId = evt.detail.remotePeer.toString();
    console.log(`disconnected from: ${peerId.slice(peerId.length - idTruncateLimit)}`);
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

          const newArch = {
            publicKey: archConfigJson.encryptionPublicKey,
            connection: nodeConnections[archConfigJson.peerId],
            profile: {
              archAddress: archConfigJson.address,
              diggingFee: ethers.utils.parseEther('10'),
              maxResurrectionInterval: 30000,
            }
          };

          discoveredArchs[archConfigJson.address] = newArch;

          setArchs(Object.values(discoveredArchs));
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
