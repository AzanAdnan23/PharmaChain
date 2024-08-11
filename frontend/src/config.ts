import { z } from "zod";
import { AlchemyGasManagerConfig } from "@alchemy/aa-alchemy";
import {
  SupportedAccountTypes,
  cookieStorage,
  createConfig,
} from "@alchemy/aa-alchemy/config";
import {
  SmartAccountClientOptsSchema,
  arbitrumSepolia,
} from "@alchemy/aa-core";
import { QueryClient } from "@tanstack/react-query";

import PharmaChain from "../artifacts/contracts/PharmaChain.sol/PharmaChain.json";

import { createPublicClient, http } from 'viem'
import { arbitrumSepolia as arbitrumSepoliaviem } from "viem/chains";

export const ContractAddress = "0xF7c8a0434940ccd6d2B3576bDe4214bf6653B328";
export const ContractAbi = PharmaChain.abi;

export const publicClient = createPublicClient({
  chain: arbitrumSepoliaviem,
  transport:  http(process.env.ALCHEMY_RPC_URL),
});

// [!region create-accounts-config]
// NOTE: feel free to change the chain here!
export const chain = arbitrumSepolia;

export const config = createConfig({
  // this is for requests to the specific chain RPC
  rpcUrl: "/api/rpc/chain/" + chain.id,
  signerConnection: {
    // this is for Alchemy Signer requests
    rpcUrl: "/api/rpc/",
  },
  chain,
  ssr: true,
  storage: cookieStorage,
  sessionConfig: {
    expirationTimeMs: 1000 * 60 * 60 * 24 * 180, // 180 days
  },
});
// [!endregion create-accounts-config]

// [!region other-config-vars]
// provide a query client for use by the alchemy accounts provider
export const queryClient = new QueryClient();
// configure the account type we wish to use once
export const accountType: SupportedAccountTypes = "LightAccount";
// setup the gas policy for sponsoring transactions
export const gasManagerConfig: AlchemyGasManagerConfig = {
  policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
};



// additional options for our account client
type SmartAccountClienOptions = z.infer<typeof SmartAccountClientOptsSchema>;
export const accountClientOptions: Partial<SmartAccountClienOptions> = {
  txMaxRetries: 20,
};
// [!endregion other-config-vars]




