import Block, { DIFFICULTY } from './block';

describe('Block', () => {
  let timestamp;
  let previousBlock;
  let data;
  let hash;
  let nonce;
  let difficulty;

  beforeEach(() => {
    timestamp = new Date(2010, 0, 1);
    previousBlock = Block.genesis;
    data = 't3St-d4t4';
    hash = 'h4S4';
    nonce = 128;
  });

  it('create an instance with parameters', () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
  });

  it('use static mine()', () => {
    const block = Block.mine(previousBlock, data, nonce, difficulty);
    const { difficulty } = block;
    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.nonce).not.toEqual(0);
    expect(data).toEqual(data);
  });

  it('use static hash()', () => {
    hash = Block.hash(timestamp, previousBlock.hash, data);
    const hasOutput = 'b1c19ac8a5f35de6df89929f0b9a7e0d02271d5fc19c8af90dd1382ffab7e63b';

    expect(hash).toEqual(hasOutput);
  });

  it('use toString()', () => {
    const block = Block.mine(previousBlock, data);
    console.log(block.toString());

    expect(typeof block.toString()).toEqual('string');
  });
});
