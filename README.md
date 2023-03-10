# transactions-root-tree

A test battery of `Merkle Trees` related to the Ethereum EVM transactions.

Test cases:

- From a list of block transactions, someone could rebuild the `transactionsRoot`
- Proof a transaction is included in the `transactionsRoot`.
- Generate a Tree of batches of blocks and test again the previous scenarios (replicating some of the zk-rollups that some L2 blockchains are using currently)

Check `test/` folder.

![Merkle Tree](https://bitcoin.eu/wp-content/uploads/2017/12/Hash_Tree.jpg)

## Transactions Root

The transactionsRoot field in the block header contains the root hash of the Merkle tree of transactions of the block. The root hash is the proof that the block contains all the transactions in the proper order.

The transactions root hash in the block header has the following purposes:

- To prove the integrity of transactions in the block without presenting all transactions.
- To sign the block header only, separately from its transactions.
