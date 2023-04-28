// scripts/deploy.ts

import { ethers, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const TestContract = await ethers.getContractFactory("testContract");
  const testContract = await TestContract.deploy();

  console.log("Deploying testContract...");

  await testContract.deployed();
  console.log("testContract deployed to:", testContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
