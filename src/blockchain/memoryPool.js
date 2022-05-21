import { Transaction } from '../wallet';

class MemoryPool {
  // REGISTRA TRANSACCIONES QUE TODAVIA NO SE HAN CONFIRMADO, LOS MINEROS VAN COGIENDO DE AQUI
  constructor() {
    this.transactions = [];
  }

  addOrUpdate(transaction) {
    const { input, outputs = [] } = transaction;
    // comprobamos que todos los outputs que se generan en la transaccion sean iguales al input
    const outputTotal = outputs.reduce((total, output) => total + output.amount, 0);
    if (input.amount !== outputTotal) throw Error(`Invalid transaction from address ${input.address}`);
    if (!Transaction.verify(transaction)) throw Error(`Invalid signature from address  ${input.address}`);

    const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
    if (txIndex >= 0) this.transactions[txIndex] = transaction;
    else this.transactions.push(transaction);
  }

  find(address) {
    return this.transactions.find(({ input }) => input.address === address);
  }

  wipe() {
    this.transactions = [];
  }
}

export default MemoryPool;
