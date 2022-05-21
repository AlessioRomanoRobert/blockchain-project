const { v1: uuidV1 } = require('uuid');
import { elliptic } from '../modules';

const REWARD = 1;

class Transaction {
  constructor() {
    this.id = uuidV1();
    this.input = null;
    this.outputs = [];
  }

  static create(senderWallet, recipientAdress, amount) {
    const { balance, publicKey } = senderWallet;
    // validacion que el amount no sea mayor del balance total
    if (amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);

    const transaction = new Transaction();
    // aqui crea los dos outputs de la transaccion
    transaction.outputs.push(
      ...[
        { amount: balance - amount, address: publicKey },
        { amount, address: recipientAdress },
      ]
    );
    // aqui creamos es input
    transaction.input = Transaction.sign(transaction, senderWallet);

    return transaction;
  }

  static verify(transaction) {
    // los datos para la firma son publicos y cualquiera puede validar transacciones
    const {
      input: { address, signature },
      outputs,
    } = transaction;

    return elliptic.verifySignature(address, signature, outputs);
  }

  static sign(transaction, senderWallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(transaction.outputs), // lo ideal  es pasarle todos los outputs
    };
  }

  static reward(minerWallet, blockchainWallet) {
    // desde la wallet especial y unica enviamos la recompensa al wallet del minero
    return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
  }

  update(senderWallet, recipientAdress, amount) {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) throw Error(`Amount: ${amount} exceeds balance (${senderOutput.amount})`);

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipientAdress });
    this.input = Transaction.sign(this, senderWallet);

    return this;
  }
}

export { REWARD };

export default Transaction;
