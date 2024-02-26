// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "../lib/forge-std/src/Script.sol";

import {Pharma} from "../src/Pharma.sol";

contract DeployPharma is Script {
    function run() external {
        vm.startBroadcast();
        Pharma pharma = new Pharma();
        vm.stopBroadcast();
    }
}
