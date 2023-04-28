// scripts/deploy.ts

import { ethers, run } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    // paymasterContractのアドレスを指定します
    const paymasterContractAddress = "0xbb1b4b23fa7f4ee1af8681f03fec91361987a54c";

    // paymasterContractのコントラクトインスタンスを作成します
    const PaymasterContract = await ethers.getContractFactory("DepositByAdPaymaster");
    const paymasterContract = new ethers.Contract(paymasterContractAddress, PaymasterContract.interface, deployer);


    await paymasterContract.deposit({ value: ethers.utils.parseEther("0.1") })
    console.log('depositted');

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
