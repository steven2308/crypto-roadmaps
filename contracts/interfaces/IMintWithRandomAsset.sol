// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

interface IMintWithRandomAsset {
    function nestMintWithRandomAsset(
        address to,
        uint8 quarter,
        uint256 destinationId
    ) external returns (uint256 tokenId, uint64 assetId);
}
