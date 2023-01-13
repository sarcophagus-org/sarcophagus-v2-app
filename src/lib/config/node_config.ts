import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { kadDHT } from '@libp2p/kad-dht';
// import { webRTCStar } from '@libp2p/webrtc-star';
import { webSockets } from '@libp2p/websockets';

// protocol names used to set up communication with archaeologist nodes
// these values must be the same for webapp's and archaeologist's node config
export const NEGOTIATION_SIGNATURE_STREAM = '/archaeologist-negotiation-signature';
const DHT_PROTOCOL_PREFIX = '/archaeologist-service';

const dht = kadDHT({
  protocolPrefix: DHT_PROTOCOL_PREFIX,
  clientMode: false,
});

// TODO -- once discovery is re-enabled, either continue using webRTCStar, or
// use bootstrap nodes and remove webRTCStar

// const webRtcStar = webRTCStar();

export const nodeConfig: any = {
  // addresses: {
  //   // Add the signaling server address, along with our PeerId to our multiaddrs list
  //   // libp2p will automatically attempt to dial to the signaling server so that it can
  //   // receive inbound connections from other peers
  //   listen: process.env
  //     .REACT_APP_SIGNAL_SERVER_LIST!.split(',')
  //     .map((s: string) => s.trim())
  //     .map((server: any) => {
  //       return `/dns4/${server}/tcp/443/wss/p2p-webrtc-star`;
  //     }),
  // },
  transports: [
    webSockets(),
    // webRtcStar.transport
  ],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
  peerDiscovery: [
    // webRtcStar.discovery
  ],
  dht,
  connectionManager: {
    autoDial: false,
    dialTimeout: 5000,
  },
};
