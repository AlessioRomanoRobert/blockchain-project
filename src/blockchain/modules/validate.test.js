import Blockchain from '../blockchain';
import validate from './validate';

describe('Validate', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('validates a valid chain', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.addBlock('bl4ck-2');

    expect(validate(blockchain.blocks)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    blockchain.blocks[0].data = 'h4ck-data';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Genesis block.');
  });

  it('invalidates a chain with a corrupt previousHash within a block', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].previousHash = 'h4ck-previoushash';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid previous hash.');
  });

  it('Validate a chain with a correct previousHash within a block', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].previousHash = 'g3n3s1s-h4sh';

    expect(validate(blockchain.blocks)).toBe(true);
  });

  it('invalidates a chain with a corrupt hash within a block', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].hash = 'h4ck-hash';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid hash.');
  });
});
