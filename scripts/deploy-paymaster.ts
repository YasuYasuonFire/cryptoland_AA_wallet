// scripts/deploy.ts

import { ethers, run } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const entryPoint = "0x0576a174D229E3cFA37253523E645A78A0C91B57"; //EntryPointのコントラクトアドレスを指定する

    console.log("Deploying contract with account:", deployer.address);

    const PaymasterContract = await ethers.getContractFactory("DepositByAdPaymaster");
    const paymasterContract = await PaymasterContract.deploy(entryPoint);

    console.log("Deploying paymasterContract...");

    await paymasterContract.deployed();
    console.log("paymasterContract deployed to:", paymasterContract.address);

    await paymasterContract.deposit({ value: ethers.utils.parseEther("0.01") })
    console.log('depositted');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
