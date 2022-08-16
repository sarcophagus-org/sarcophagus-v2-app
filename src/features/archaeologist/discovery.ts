import { Libp2p } from 'libp2p';
if (!process.env.REACT_APP_BOOTSTRAP_NODE_LIST) {
  throw Error('REACT_APP_BOOTSTRAP_NODE_LIST not set in .env');
}

if (!process.env.REACT_APP_SIGNAL_SERVER_LIST) {
  throw Error('REACT_APP_SIGNAL_SERVER_LIST not set in .env');
}

export async function initialisePeerDiscovery(browserNode: Libp2p) {
  if (browserNode.isStarted()) return;

  const idTruncateLimit = 5;

  const discoveredPeers: string[] = [];

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
    // TODO: will need to track all connected nodes, and set this value
    // based on user input
    // selectedArweaveConn = evt.detail;

    const peerId = evt.detail.remotePeer.toString();
    console.log(`Connection established to: ${peerId.slice(peerId.length - idTruncateLimit)}`);
  });

  browserNode.pubsub.addEventListener('message', (evt) => {
    const msg = new TextDecoder().decode(evt.detail.data);
    const sourceId = evt.detail.from.toString();
    console.log(`from ${sourceId.slice(sourceId.length - idTruncateLimit)}: ${msg}`);
  });

  browserNode.pubsub.subscribe('env-config');

  return browserNode;
}