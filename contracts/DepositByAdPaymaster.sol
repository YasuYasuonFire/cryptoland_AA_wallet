// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import '@account-abstraction/contracts/core/BasePaymaster.sol';

contract DepositByAdPaymaster is BasePaymaster {
    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    )
        internal
        override
        returns (bytes memory context, uint256 validationData)
    {}

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        // manage remaining balance here
    }
}
