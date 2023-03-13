import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { expect } from "chai";
import { ethers } from "hardhat";
import BlockFixture from "./block-fixture.json";
import { TransactionFactory } from "@ethereumjs/tx";

describe("VerifierBytes", function () {
  it("Should verify a valid proof for the value #1", async function () {
    const { result: block } = BlockFixture;

    const values: Array<[Buffer]> = [];
    for (const tx of block.transactions) {
      const { input, gas, ...transaction } = tx;
      const value = TransactionFactory.fromTxData({
        ...transaction,
        data: input,
        gasLimit: gas,
      }).serialize();

      values.push([value]);
    }

    const tree = StandardMerkleTree.of(values, ["bytes"]);

    const Verifier = await ethers.getContractFactory("VerifierBytes");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(1);

    const leaf = tree.leafHash(values[1]);
    await expect(verifier.verify(proof, leaf)).not.to.be.reverted;
  });

  it("Should verify a valid proof for the value #2", async function () {
    const { result: block } = BlockFixture;

    const values: Array<[Buffer]> = [];
    for (const tx of block.transactions) {
      const { input, gas, ...transaction } = tx;
      const value = TransactionFactory.fromTxData({
        ...transaction,
        data: input,
        gasLimit: gas,
      }).serialize();

      values.push([value]);
    }

    const tree = StandardMerkleTree.of(values, ["bytes"]);

    const Verifier = await ethers.getContractFactory("VerifierBytes");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(2);

    const leaf = tree.leafHash(values[2]);
    await expect(verifier.verify(proof, leaf)).not.to.be.reverted;
  });

  it("Should verifiy a valid proof for the value #2", async function () {
    const { result: block } = BlockFixture;

    const values: Array<[Buffer]> = [];
    for (const tx of block.transactions) {
      const { input, gas, ...transaction } = tx;
      const value = TransactionFactory.fromTxData({
        ...transaction,
        data: input,
        gasLimit: gas,
      }).serialize();

      values.push([value]);
    }

    const tree = StandardMerkleTree.of(values, ["bytes"]);

    const Verifier = await ethers.getContractFactory("VerifierBytes");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(2);

    const leaf = tree.leafHash(values[2]);
    await expect(verifier.verify(proof, leaf)).not.to.be.reverted;
  });

  it("Should fail to verify a proof for the value #2", async function () {
    const { result: block } = BlockFixture;

    const values: Array<[Buffer]> = [];
    for (const tx of block.transactions) {
      const { input, gas, ...transaction } = tx;
      const value = TransactionFactory.fromTxData({
        ...transaction,
        data: input,
        gasLimit: gas,
      }).serialize();

      values.push([value]);
    }

    const tree = StandardMerkleTree.of(values, ["bytes"]);

    const Verifier = await ethers.getContractFactory("VerifierBytes");
    const verifier = await Verifier.deploy(tree.root);

    const proof = tree.getProof(2);

    const leaf = tree.leafHash(values[3]);
    await expect(verifier.verify(proof, leaf)).to.be.reverted;
  });
  describe("Batches", function () {
    it("Should split in batches the transactions a verify one of the batches against the tree", async function () {
      const { result: block } = BlockFixture;

      const values: Array<[Buffer]> = [];
      for (const tx of block.transactions) {
        const { input, gas, ...transaction } = tx;
        const value = TransactionFactory.fromTxData({
          ...transaction,
          data: input,
          gasLimit: gas,
        }).serialize();
        values.push([value]);
      }

      // we batched the values to make the tree smaller
      const batches = batchReduce(values, 50);

      // and we create with each batch a new tree
      const trees = batches.map((batch) =>
        StandardMerkleTree.of(batch, ["bytes"])
      );

      const treesValues = trees.map((t) => [t.root]);
      // and we create a new tree with the roots of the previous trees
      const tree = StandardMerkleTree.of(treesValues, ["bytes"]);

      const Verifier = await ethers.getContractFactory("VerifierBytes");
      const verifier = await Verifier.deploy(tree.root);

      const proof = tree.getProof(2);

      const leaf = tree.leafHash(treesValues[2]);
      await expect(verifier.verify(proof, leaf)).not.to.be.reverted;
    });

    it("Should verify a transaction inside of one of the batches #0", async function () {
      const { result: block } = BlockFixture;

      const values: Array<[Buffer]> = [];
      for (const tx of block.transactions) {
        const { input, gas, ...transaction } = tx;
        const value = TransactionFactory.fromTxData({
          ...transaction,
          data: input,
          gasLimit: gas,
        }).serialize();
        values.push([value]);
      }

      // we batched the values to make the tree smaller
      const batches = batchReduce(values, 50);

      // and we create with each batch a new tree
      const trees = batches.map((batch) =>
        StandardMerkleTree.of(batch, ["bytes"])
      );

      const treesValues = trees.map((t) => [t.root]);
      // and we create a new tree with the roots of the previous trees
      const tree = StandardMerkleTree.of(treesValues, ["bytes"]);

      const Verifier = await ethers.getContractFactory("VerifierBytes");
      const verifier = await Verifier.deploy(tree.root);

      const proof = tree.getProof(1);

      const leaf = tree.leafHash(treesValues[1]);
      await expect(verifier.verify(proof, leaf)).not.to.be.reverted;

      // Now we are gonna check that the transaction is inside of the batch #1
      const batch = batches[1];
      const tx = batch[1];
      const batchTree = trees[1];

      const txProof = batchTree.getProof(1);
      expect(batchTree.verify(tx, txProof)).to.be.true;
    });

    it("Should verify a transaction inside of one of the batches #1", async function () {
      const { result: block } = BlockFixture;

      const values: Array<[Buffer]> = [];
      for (const tx of block.transactions) {
        const { input, gas, ...transaction } = tx;
        const value = TransactionFactory.fromTxData({
          ...transaction,
          data: input,
          gasLimit: gas,
        }).serialize();
        values.push([value]);
      }

      // we batched the values to make the tree smaller
      const batches = batchReduce(values, 50);

      // and we create with each batch a new tree
      const trees = batches.map((batch) =>
        StandardMerkleTree.of(batch, ["bytes"])
      );

      const treesValues = trees.map((t) => [t.root]);
      // and we create a new tree with the roots of the previous trees
      const tree = StandardMerkleTree.of(treesValues, ["bytes"]);

      const Verifier = await ethers.getContractFactory("VerifierBytes");
      const verifier = await Verifier.deploy(tree.root);

      const proof = tree.getProof(1);

      const leaf = tree.leafHash(treesValues[1]);
      await expect(verifier.verify(proof, leaf)).not.to.be.reverted;

      // Now we are gonna check that the transaction is inside of the batch #1
      const batch = batches[2];
      const tx = batch[1];
      const batchTree = trees[2];

      const verifierTx = await Verifier.deploy(batchTree.root);

      const txProof = batchTree.getProof(1);
      const txLeaf = batchTree.leafHash(tx);

      await expect(verifierTx.verify(txProof, txLeaf)).not.to.be.reverted;
    });
  });
});

function batchReduce<T>(arr: T[], batchSize: number): T[][] {
  return arr.reduce((batches, curr, i) => {
    if (i % batchSize === 0) batches.push([]);
    batches[batches.length - 1].push(arr[i]);
    return batches;
  }, [] as T[][]);
}
