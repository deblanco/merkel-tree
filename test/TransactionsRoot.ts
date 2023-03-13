import { expect } from "chai";
import BlockFixture from "./block-fixture.json";
import rlp from "rlp";
import { Trie } from "@ethereumjs/trie";
import { TransactionFactory } from "@ethereumjs/tx";

describe("TransactionsRoot", function () {
  // We use a fixture to avoid having to mine a block for each test
  // We are gonna try to verify the transactions root a block using the transactions hashes
  // from the block

  it("Should reconstruct the transactionsRoot from the block transactions", async function () {
    const { result: block } = BlockFixture;
    const { transactionsRoot } = block;
    const trie = new Trie();
    for (const tx of block.transactions) {
      const { input, gas, ...transaction } = tx;
      await trie.put(
        Buffer.from(rlp.encode(Number(tx.transactionIndex))),
        TransactionFactory.fromTxData({
          ...transaction,
          data: input,
          gasLimit: gas,
        }).serialize()
      );
    }
    expect(transactionsRoot).to.equal("0x" + trie.root().toString("hex"));
  });
});
