import Transaction from './transaction';
import Wallet from './wallet';

const blockchainWallet = new Wallet(undefined, 10000); // aqui definimos la wallet que pagará los mineros

export { Transaction, blockchainWallet };
export default Wallet;
