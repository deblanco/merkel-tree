import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { expect } from "chai";
import { ethers } from "hardhat";
import BlockFixture from "./block-fixture.json";
import rlp from "rlp";
import { Trie } from "@ethereumjs/trie";
import { TransactionFactory } from "@ethereumjs/tx";

describe("Verifier", function () {
  it("Should return the right merkle root", async function () {
    const values = [
      ["0x1111111111111111111111111111111111111111", "5000000000000000000"],
      ["0x2222222222222222222222222222222222222222", "2500000000000000000"],
    ];

    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(tree.root);

    expect(await verifier.root()).to.equal(tree.root);
  });

  it("Should verifiy a valid proof for the value #0", async function () {
    const values = [
      ["0x1111111111111111111111111111111111111111", "5000000000000000000"],
      ["0x2222222222222222222222222222222222222222", "2500000000000000000"],
    ];

    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(0);

    await expect(verifier.verify(proof, values[0][0], values[0][1])).not.to.be
      .reverted;
  });

  it("Should verifiy a valid proof for the value #1", async function () {
    const values = [
      ["0x1111111111111111111111111111111111111111", "5000000000000000000"],
      ["0x2222222222222222222222222222222222222222", "2500000000000000000"],
    ];

    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(1);

    await expect(verifier.verify(proof, values[1][0], values[1][1])).not.to.be
      .reverted;
  });

  it("Should verifiy a invalid proof", async function () {
    const values = [
      ["0x1111111111111111111111111111111111111111", "5000000000000000000"],
      ["0x2222222222222222222222222222222222222222", "2500000000000000000"],
    ];

    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(1);

    await expect(verifier.verify(proof, values[1][0], values[1][1])).not.to.be
      .reverted;
  });

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

    it("Should verify that one of the txns (leaf) is in the transactionsRoot", async function () {
      const { result: block } = BlockFixture;
      const { transactionsRoot } = block;

      const Verifier = await ethers.getContractFactory("Verifier");
      const verifier = await Verifier.deploy(transactionsRoot);

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
    });
  });
});
