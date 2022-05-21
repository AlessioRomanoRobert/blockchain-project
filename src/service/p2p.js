import WebSocket from 'ws';

// ESTE SERVICIO ES PARA LA RED PEER TO PEER

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = { BLOCKS: 'blocks', TX: 'transaction', WIPE: 'wipe_memorypool' };

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    // creamos el websocket
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.onConnection(socket));

    // conectamos los nodos a nuestra red
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`Service ws:${P2P_PORT} listening...`);
  }

  onConnection(socket) {
    const { blockchain } = this;
    console.log('[ws:socket] connected.');
    this.sockets.push(socket);

    // Evento socket que espera un mensaje
    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);
      try {
        // Valida y actualiza los nodos REMPLAZA EN CAS DE QUE PROCEDA LA BLOCKCHAIN pasando los bloques en value
        if (type === MESSAGE.BLOCKS) blockchain.replace(value);
        // accede a instancia de memory pool pasandole la transacción en value
        else if (type === MESSAGE.TX) blockchain.memoryPool.addOrUpdate(value);
        // cada instancia se encarga de borrar las transacciones de la memrypool
        else if (type === MESSAGE.WIPE) blockchain.memoryPool.wipe();
      } catch (error) {
        console.log(`[ws:message] error ${error}`);
      }
    });

    // ENVIA SOCKET
    socket.send(JSON.stringify({ type: MESSAGE.BLOCKS, value: blockchain.blocks }));
  }

  sync() {
    // mensaje de broadcast a toda la red con los nodos que tenemos actualmente
    const {
      blockchain: { blocks },
    } = this;
    this.broadcast(MESSAGE.BLOCKS, blocks);
  }

  broadcast(type, value) {
    // mandamos un mensaje a todos los sockets que tenemos activos
    console.log(`[ws:broadcast] ${type}...`);
    const message = JSON.stringify({ type, value });
    this.sockets.forEach((socket) => socket.send(message));
  }
}

export { MESSAGE };
export default P2PService;
