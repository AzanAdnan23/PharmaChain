import type { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200  // Set a low value to optimize the code
      }
    }
  },
  paths: {
    artifacts: "../frontend/artifacts",
  },
  defaultNetwork: "arbitrumSepolia",
  networks: {
    arbitrumSepolia: {
      url: `${process.env.ALCHEMY_RPC_URL}`, 
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 421614, // Arbitrum Sepolia chain ID
      gas: 5000000,
    }
  }
};

export default config;
