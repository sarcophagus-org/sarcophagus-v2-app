import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import { KadDHT } from '@libp2p/kad-dht';
import { WebRTCStar } from '@libp2p/webrtc-star';

// protocol names used to set up communication with archaeologist nodes
// these values must be the same for webapp's and archaeologist's node config
export const PUBLIC_KEY_STREAM = '/archaeologist-public-key';
export const NEGOTIATION_SIGNATURE_STREAM = '/archaeologist-negotiation-signature';
const DHT_PROTOCOL_PREFIX = '/archaeologist-service';

const dht = new KadDHT({
  protocolPrefix: DHT_PROTOCOL_PREFIX,
  clientMode: false,
});

const webRtcStar = new WebRTCStar();

export const nodeConfig: any = {
  addresses: {
    // Add the signaling server address, along with our PeerId to our multiaddrs list
    // libp2p will automatically attempt to dial to the signaling server so that it can
    // receive inbound connections from other peers
    listen: process.env
      .REACT_APP_SIGNAL_SERVER_LIST!.split(',')
      .map((s: string) => s.trim())
      .map((server: any) => {
        return `/dns4/${server}/tcp/443/wss/p2p-webrtc-star`;
      }),
  },
  transports: [webRtcStar],
  connectionEncryption: [new Noise()],
  streamMuxers: [new Mplex()],
  peerDiscovery: [webRtcStar.discovery],
  dht,
  connectionManager: {
    autoDial: false,
  },
};
