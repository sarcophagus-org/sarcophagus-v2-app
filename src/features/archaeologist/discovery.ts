import { solidityKeccak256 } from 'ethers/lib/utils';
import { Libp2p } from 'libp2p';
import { Archaeologist } from 'types';
import { pipe } from 'it-pipe';
import { pushable } from 'it-pushable';

if (!process.env.REACT_APP_BOOTSTRAP_NODE_LIST) {
  throw Error('REACT_APP_BOOTSTRAP_NODE_LIST not set in .env');
}

if (!process.env.REACT_APP_SIGNAL_SERVER_LIST) {
  throw Error('REACT_APP_SIGNAL_SERVER_LIST not set in .env');
}

const discoveredPeers: string[] = []; // addresses
const discoveredArchs: Record<string, Archaeologist> = {}; // maps arch addresses to Archaeologist objects
const nodeConnections: Record<string, any> = {}; // maps peer ids to connections to them

const archEnvConfigTopic = 'env-config';

export async function initialisePeerDiscovery(browserNode: Libp2p, setArchs: (archs: Archaeologist[]) => void) {
  if (browserNode.isStarted()) return;

  const idTruncateLimit = 5;

  const nodeId = browserNode.peerId.toString();
  console.log(`starting browser node with id: ${nodeId.slice(nodeId.length - idTruncateLimit)}`);
  await browserNode.start();


  // Listen for new peers
  browserNode.addEventListener('peer:discovery', (evt) => {
    const peerId = evt.detail.id.toString();

    if (discoveredPeers.find((p) => p === peerId) === undefined) {
      discoveredPeers.push(peerId);
      console.log(`${nodeId.slice(nodeId.length - idTruncateLimit)} discovered: ${peerId.slice(peerId.length - idTruncateLimit)}`);
    }
  });


  // Listen for peers connecting
  browserNode.connectionManager.addEventListener('peer:connect', async (evt) => {
    const peerId = evt.detail.remotePeer.toString();
    nodeConnections[peerId] = evt.detail;
    console.log(`Connection established to: ${peerId.slice(peerId.length - idTruncateLimit)}`);
  });

  browserNode.pubsub.addEventListener('message', (evt) => {
    const msg = new TextDecoder().decode(evt.detail.data);

    const sourceId = evt.detail.from.toString();

    if (evt.detail.topic === archEnvConfigTopic) {
      const archConfigJson: Record<string, any> = JSON.parse(msg);
      const archAddress = solidityKeccak256(['string'], [archConfigJson.encryptionPublicKey]);

      const newArch = {
        publicKey: archConfigJson.encryptionPublicKey,
        address: archAddress,
        bounty: archConfigJson.minBounty,
        diggingFee: archConfigJson.minDiggingFees,
        isArweaver: archConfigJson.isArweaver,
        feePerByte: archConfigJson.feePerByte,
        maxResurrectionTime: archConfigJson.maxResurrectionTime,
        connection: nodeConnections[sourceId],
      };

      discoveredArchs[archAddress] = newArch;

      setArchs(Object.values(discoveredArchs));
    }
  });

  browserNode.pubsub.subscribe(archEnvConfigTopic);
}


export async function confirmArweaveTransaction(arg: { arch: Archaeologist, arweaveTxId: string, unencryptedShardHash: string }) {
  const { arch, arweaveTxId, unencryptedShardHash } = arg;
  try {
    const archConnection = discoveredArchs[arch.address].connection;

    if (!archConnection) throw new Error('No connection to archaeologist');

    const outboundMsg = JSON.stringify({
      arweaveTxId,
      unencryptedShardHash,
    });

    const outboundStream = pushable({});
    outboundStream.push(new TextEncoder().encode(outboundMsg));

    const { stream } = await archConnection.newStream('/validate-arweave');

    pipe(
      outboundStream,
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
