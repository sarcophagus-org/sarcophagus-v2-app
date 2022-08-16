
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import { Bootstrap } from '@libp2p/bootstrap';
import { KadDHT } from '@libp2p/kad-dht';
import { WebSockets } from '@libp2p/websockets';
import { WebRTCStar } from '@libp2p/webrtc-star';

import { FloodSub } from '@libp2p/floodsub';

const dht = new KadDHT({
  protocolPrefix: '/archaeologist-service',
  clientMode: false
});

const webRtcStar = new WebRTCStar();

export const nodeConfig = {
  addresses: {
    // Add the signaling server address, along with our PeerId to our multiaddrs list
    // libp2p will automatically attempt to dial to the signaling server so that it can
    // receive inbound connections from other peers
    listen: process.env.REACT_APP_SIGNAL_SERVER_LIST!.split(',').map((s: string) => s.trim()).map((server: any) => {
      return `/dns4/${server}/tcp/443/wss/p2p-webrtc-star`;
    })
  },
  transports: [
    new WebSockets(),
    webRtcStar
  ],
  connectionEncryption: [
    new Noise()
  ],
  streamMuxers: [
    new Mplex()
  ],
  peerDiscovery: [
    webRtcStar.discovery,
    new Bootstrap({
      list: process.env.REACT_APP_BOOTSTRAP_NODE_LIST!.split(',').map((s: string) => s.trim())
    }),
  ],
  dht,
  connectionManager: {
    autoDial: true
  },
  pubsub: new FloodSub({
    enabled: true,
    canRelayMessage: true,
    emitSelf: false
  }),
};
