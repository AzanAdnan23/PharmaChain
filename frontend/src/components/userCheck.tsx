// COMPONENT TO CHECK IS USER REGISTERED OR NOT

import {getContract} from "viem";
import {
    useAccount,
    useLogout,
    useSendUserOperation,
    useSmartAccountClient,
    useUser,
  } from "@alchemy/aa-alchemy/react";

  import {
    chain,
    accountType,
    gasManagerConfig,
    accountClientOptions as opts,
    ContractAddress,
    ContractAbi,
    publicClient,
  } from "@/config";


  export const userCheck = () => {


    const user = useUser();
    const { address } = useAccount({ type: accountType });


    const PharmaChain = getContract({ address: ContractAddress, abi: ContractAbi, client: publicClient })
 
    const isRegistered = PharmaChain.read.isUserRegistered( [address]);


  };