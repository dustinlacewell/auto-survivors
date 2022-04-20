const Peer = require("peerjs-on-node").Peer;
import { default as OPeer } from "peerjs"

class ASServer {
    peerId: string;
    peer: OPeer;
    peers: Record<string, OPeer.DataConnection>;

    constructor(peerId: string) {
        this.peerId = peerId;
        this.peer = new Peer(peerId);
        this.peers = {};
    }

    setupPeer(peer: OPeer) {
        peer.on('connection', (conn: OPeer.DataConnection) => {
            conn.on('data', data => this.handleData(conn, data));
            conn.on('open', () => this.handleConnection(conn));
            conn.on('close', () => this.handleDisconnection(conn));
        });
    }

    handleConnection(conn: OPeer.DataConnection) {
        this.peers[conn.peer] = conn;
        console.log(`Connected to peer: ${conn.peer}`);
    }

    handleDisconnection(conn: OPeer.DataConnection) {
        delete this.peers[conn.peer];
        console.log(`Disconnected from peer: ${conn.peer}`);
    }

    handleData(conn: OPeer.DataConnection, data: any) {
        // rebroadcast all messages
        for (const [peerId, peer] of Object.entries(this.peers)) {
            if (peerId !== conn.peer) {
                peer.send(data);
            }
        }
    }
}

const app = new ASServer("as-server");