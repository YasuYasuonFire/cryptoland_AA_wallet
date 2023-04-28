// import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types';
import * as fs from 'fs';
import '@nomiclabs/hardhat-etherscan';
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.8.12', settings: {} }, { version: '0.5.0' }],
  },
  typechain: {
    outDir: 'src/pages/Account/account-api/typechain-types',
  },
  networks: {
    // goerli: getNetwork('goerli'),
    goerli: {
      url: process.env.STAGING_ALCHEMY_KEY || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5,
      // 必要に応じて、他のプロパティも設定することができます。例えば、accounts, chainId など。
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
