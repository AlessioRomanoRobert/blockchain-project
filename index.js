import PKG from './package.json';
import Block from './src/blockchain/block';

const { name, version } = PKG;
console.log(`${name} versión: ${version}`);

const { genesis } = Block;

const block = Block.mine(genesis, 'd4t4-1');
console.log(block.toString());

const block2 = Block.mine(block, 'D4t4-2');
console.log(block2.toString());
