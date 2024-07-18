const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PharmaChainModule", (m) => {
  const PharmaChainContract = m.contract("PharmaChain");

  return { PharmaChainContract };
});

// npx hardhat ignition deploy ignition/modules/PharmaChain.js
