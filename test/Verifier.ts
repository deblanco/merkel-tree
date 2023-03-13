import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { expect } from "chai";
import { ethers } from "hardhat";

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
});
