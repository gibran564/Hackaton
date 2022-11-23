import crypto, { BinaryLike } from 'crypto'

const SHA256 = (message: BinaryLike) => crypto.createHash('sha256').update(message).digest('hex')

export class Block {

  prevHash = ""
  hash: string
  nonce = 0
  
  constructor(
    public timestamp = "",
    public data: object = []
  ) {
    this.hash = this.getHash()
  }

  getHash() {
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
  }

  mine(difficulty: number) {
    while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
      this.nonce++
      this.hash = this.getHash()
    }
  }
}

export class Blockchain {
  chain: Readonly<Block>[] = [new Block(Date.now().toString())]
  difficulty = 2
  blockTime = 1000

  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(block: Block) {
    block.prevHash = this.getLastBlock().hash
    block.hash = block.getHash()
    block.mine(this.difficulty)
    this.chain.push(Object.freeze(block))
    this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1
  }

  isValid(blockchain: Blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i]
      const prevBlock = blockchain.chain[i - 1]

      if (currentBlock.hash !== currentBlock.getHash()) return false
      if (currentBlock.prevHash !== prevBlock.hash) return false
    }
  }
}