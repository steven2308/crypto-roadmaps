// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {QuarterBase} from "./abstracts/QuarterBase.sol";
import {
    RMRKImplementationBase
} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";

contract QuarterTexts is QuarterBase {
    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps
    )
        RMRKImplementationBase(
            "QuarterTexts",
            "QTX",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}
}
