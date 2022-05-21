import { Transaction, blockchainWallet } from '../wallet';
import { MESSAGE } from '../service/p2p';

class Miner {
  constructor(blockchain, p2pService, wallet) {
    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  mine() {
    const {
      blockchain: { memoryPool }, // sacamos memorypool de la blockchain
      p2pService,
      wallet,
    } = this;
    // comprobamos que existan transacciones sin confirmar en la memorypool
    if (memoryPool.transactions.length === 0) throw Error('There are no unconfirmed transactions.');
    // incluimos las reward del minero a las transacciones
    memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
    // crea bloque que es la transaccion valida
    const block = this.blockchain.addBlock(memoryPool.transactions);
    // sincroniza la nueva blockchain
    p2pService.sync();
    // borrar todas las transacciones que hay en memorypool
    // EL MINERO COGE TODAS LAS TRANSACCIONES QUE HAY Y GENERA UN BLOQUE NUEVO CON ESTAS
    memoryPool.wipe();
    // trasmitimos el broadcasting para todos los nodos de nuestra red! (el mensaje es siempre limpiar la memorypool)
    p2pService.broadcast(MESSAGE.WIPE);

    return block;
  }
}

export default Miner;
