import { Block, Blockchain } from "./block.test";

const JeChain = new Blockchain();

JeChain.addBlock(new Block(Date.now().toString(), {
  from: "jes",
  to: "you",
  ammount: 100
}));

console.log(JeChain.chain);