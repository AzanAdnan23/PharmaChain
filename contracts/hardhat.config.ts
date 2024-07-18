import type { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "../frontend/artifacts",
  },
  defaultNetwork: "arbitrumSepolia",
  networks: {
    arbitrumSepolia: {
      url: `${process.env.ALCHEMY_RPC_URL}`, 
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 421614 // Arbitrum Sepolia chain ID
    }
  }
};

export default config;
