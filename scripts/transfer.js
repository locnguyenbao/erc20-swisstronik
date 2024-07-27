const hre = require("hardhat");
const { ethers } = hre;
const { encryptDataField } = require("@swisstronik/utils");

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpclink = hre.network.config.url;

  console.log("RPC link:", rpclink);
  console.log("Data before encryption:", data);

  const [encryptedData] = await encryptDataField(rpclink, data);

  console.log("Encrypted data:", encryptedData);

  const tx = await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });

  console.log("Signed transaction:", tx);

  return tx;
};

async function main() {
  const recipient = "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1";
  const amount = ethers.parseUnits("1", 18); // 1 token with 18 decimals

  const [deployer] = await ethers.getSigners();

  console.log("Using account:", deployer.address);

  const tokenAddress = "0x96E7BDfB84d8bA91e1a3f5c4058DbD4B50DE32A1";
  const tokenAbi = [
    "function transfer(address to, uint amount) external returns (bool)"
  ];
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, deployer);

 // console.log(`Transferring ${ethers.formatUnits(amount, 18)} tokens to ${recipient}...`);

  try {
    const data = tokenContract.interface.encodeFunctionData("transfer", [recipient, amount]);

    const tx = await sendShieldedTransaction(deployer, tokenAddress, data, 0);

    console.log("Transaction hash before wait:", tx.hash);

    const receipt = await tx.wait();

    console.log("Transaction hash after wait:", receipt.logs);
    console.log("Transfer complete. Tokens transferred:", ethers.formatUnits(amount, 18));
  } catch (error) {
    console.error("Transfer failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
