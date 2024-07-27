const hre = require("hardhat");
const { ethers } = hre;

async function getBalance(address) {
  const provider = ethers.provider;
  const balance = await provider.getBalance(address);
  return balance;
}

async function main() {
  // Get the first signer from the provider
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Retrieve the balance of the deployer
  const balance = await getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  // Define the contract to deploy
  const Token = await ethers.getContractFactory("MyToken");
  const name = "NBL_Test";
  const symbol = "NBL";
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 tokens with 18 decimals

  console.log("Deploying contract with the following parameters:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Initial Supply:", initialSupply.toString());
  console.log("Deploying contract...");
  console.log("Contract deployed, waiting for confirmation...");

  // Deploy the contract with the specified parameters
  const contract = await Token.deploy(name, symbol, initialSupply);

  // Wait until the contract is deployed
  
  await contract.waitForDeployment();
  // await contract.deployed();
  // Log the address of the deployed contract
  console.log("Contract deployed to address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });