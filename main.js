const { SHA256 } = require("crypto-js");

class Block {
  constructor(index, timestamp, data, previoushash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoushash = previoushash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previoushash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: ", this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }
  createGenesisBlock() {
    let genesisBlock = new Block(0, "22/02/21", "genesis block");
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.previoushash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isBlockChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log(currentBlock.calculateHash());
        return false;
      }
      if (currentBlock.previoushash !== previousBlock.hash) {
        return false;
      }
      return true;
    }
  }
}

let mikeCoin = new BlockChain();
mikeCoin.addNewBlock(new Block(1, "23/02/21", { amount: 5 }));
mikeCoin.addNewBlock(new Block(2, "24/02/21", { amount: 7 }));
// console.log(JSON.stringify(mikeCoin, null, 4));
// console.log(mikeCoin.isBlockChainValid());
