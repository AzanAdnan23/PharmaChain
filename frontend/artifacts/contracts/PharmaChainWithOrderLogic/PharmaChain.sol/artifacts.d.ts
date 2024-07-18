// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { PharmaChain$Type } from "./PharmaChain";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["PharmaChain"]: PharmaChain$Type;
    ["contracts/PharmaChainWithOrderLogic/PharmaChain.sol:PharmaChain"]: PharmaChain$Type;
  }

  interface ContractTypesMap {
    ["PharmaChain"]: GetContractReturnType<PharmaChain$Type["abi"]>;
    ["contracts/PharmaChainWithOrderLogic/PharmaChain.sol:PharmaChain"]: GetContractReturnType<PharmaChain$Type["abi"]>;
  }
}