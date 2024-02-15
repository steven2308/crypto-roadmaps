// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {QuarterBase} from "./abstracts/QuarterBase.sol";
import {
    RMRKImplementationBase
} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";

contract QuarterBoxes is QuarterBase {
    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps
    )
        RMRKImplementationBase(
            "QuarterBoxes",
            "QBX",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}
}
