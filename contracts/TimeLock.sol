// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/governance/TimelockController.sol';

contract TimeLock is TimelockController {
    // minDelay: How long you have to wait before executing
    // proposers: The list of adders that can make a proposal
    // executors: The list of adders that can execute when a proposal is approved
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {}
}
